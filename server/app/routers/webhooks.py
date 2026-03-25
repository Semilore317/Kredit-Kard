"""
Webhook endpoint for Interswitch payment notifications.

Security: Interswitch signs each webhook payload with HMAC-SHA512.
We verify the signature before processing anything.
"""
import hashlib
import hmac
import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy import update
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.config import get_settings
from app.models.debt import Debt, DebtStatus
from app.services import at

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


def _verify_interswitch_signature(payload: bytes, signature: str | None) -> bool:
    """Verify HMAC-SHA512 signature from Interswitch."""
    if not signature:
        return False
    settings = get_settings()
    expected = hmac.HMAC(
        settings.webhook_secret.encode(),
        payload,
        hashlib.sha512,
    ).hexdigest()
    return hmac.compare_digest(expected, signature.lower())


@router.post("/interswitch")
async def interswitch_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_interswitch_signature: str | None = Header(None),
):
    raw_body = await request.body()

    if not _verify_interswitch_signature(raw_body, x_interswitch_signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # Parse JSON from the already-read body (don't read stream twice)
    payload = json.loads(raw_body)

    # Interswitch sends paymentReference matching our payment_ref
    payment_ref = payload.get("paymentReference") or payload.get("payment_reference")
    if not payment_ref:
        raise HTTPException(status_code=400, detail="Missing paymentReference in payload")

    debt = (
        db.query(Debt)
        .options(joinedload(Debt.trader), joinedload(Debt.customer))
        .filter(Debt.payment_ref == payment_ref)
        .first()
    )
    if not debt:
        # Return 200 so Interswitch doesn't retry — we just don't know this ref
        return {"status": "ignored", "reason": "unknown payment_ref"}

    if debt.status == DebtStatus.PAID:
        return {"status": "already_paid"}

    # Capture relationship data BEFORE the atomic update
    trader_phone = debt.trader.phone
    customer_name = debt.customer.name
    amount = float(debt.amount)
    debt_id = debt.id

    # Atomic idempotency guard: only transition PENDING → PAID
    # If another concurrent webhook already flipped the status, rowcount == 0
    result = db.execute(
        update(Debt)
        .where(Debt.payment_ref == payment_ref, Debt.status == DebtStatus.PENDING)
        .values(status=DebtStatus.PAID, paid_at=datetime.now(timezone.utc))
    )
    db.commit()

    if result.rowcount == 0:
        # Another concurrent request already processed this payment
        return {"status": "already_paid"}

    # Notify trader (non-fatal — SMS failure must not crash the webhook)
    try:
        at.send_payment_confirmation(
            trader_phone=trader_phone,
            customer_name=customer_name,
            amount=amount,
        )
    except Exception:
        print(f"[Webhook] SMS notification failed for debt {debt_id}")

    return {"status": "ok", "debt_id": debt_id}
