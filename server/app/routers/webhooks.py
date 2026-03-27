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
from app.services import sms

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

    # Interswitch sends amount in kobo
    amount_paid_kobo = payload.get("amount") or 0
    amount_paid_naira = float(amount_paid_kobo) / 100.0

    # Ensure we have the latest data from DB (important for concurrent/repeated webhooks in tests)
    db.refresh(debt)
    
    # Capture relationship data BEFORE the update
    trader_phone = debt.trader.phone
    customer_name = debt.customer.name
    total_amount = float(debt.amount)
    current_paid = float(debt.total_paid or 0)
    debt_id = debt.id

    new_total_paid = current_paid + amount_paid_naira
    is_fully_paid = new_total_paid >= total_amount
    new_status = DebtStatus.PAID if is_fully_paid else DebtStatus.PART_PAID
    paid_at = datetime.now(timezone.utc) if is_fully_paid else None

    # Update the debt record
    result = db.execute(
        update(Debt)
        .where(Debt.id == debt_id, Debt.status != DebtStatus.PAID)
        .values(
            total_paid=new_total_paid,
            status=new_status,
            paid_at=paid_at
        )
    )
    db.commit()

    if result.rowcount == 0:
        # Debt was already PAID or status mismatch
        return {"status": "already_processed"}

    # Notify trader
    try:
        sms.send_payment_confirmation(
            trader_phone=trader_phone,
            customer_name=customer_name,
            amount=amount_paid_naira,
            is_partial=not is_fully_paid,
            remaining=max(0, total_amount - new_total_paid)
        )
    except Exception:
        print(f"[Webhook] SMS notification failed for debt {debt_id}")

    return {"status": "ok", "debt_id": debt_id}
