"""
Demo-only router — simulate a USSD payment for the live hackathon presentation.

This endpoint is ONLY mounted when ENVIRONMENT != 'production'.
It lets us trigger a debt payment in real-time during the demo without
depending on Interswitch sandbox uptime.

Usage:
    POST /demo/simulate-payment
    Body: { "payment_ref": "KK-XXXXXXXX" }
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.debt import Debt, DebtStatus
from app.services import sms

router = APIRouter(prefix="/demo", tags=["Demo (Non-Production Only)"])


class SimulatePaymentRequest(BaseModel):
    payment_ref: str


@router.post("/simulate-payment")
def simulate_payment(
    body: SimulatePaymentRequest,
    db: Session = Depends(get_db),
):
    """
    Simulates an Interswitch USSD payment for demo purposes.
    Finds the debt by payment_ref, marks it PAID, and fires the trader SMS.
    Equivalent to what the real Interswitch webhook would do.
    """
    debt = db.query(Debt).filter(Debt.payment_ref == body.payment_ref).first()
    if not debt:
        raise HTTPException(status_code=404, detail=f"No debt found for ref '{body.payment_ref}'")
    if debt.status == DebtStatus.PAID:
        raise HTTPException(status_code=400, detail="Debt is already marked as PAID")
    if debt.status == DebtStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Cannot pay a cancelled debt")

    debt.status = DebtStatus.PAID
    debt.paid_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(debt)

    # Fire trader notification (non-fatal if SMS service is down)
    sms.send_payment_confirmation(
        trader_phone=debt.trader.phone,
        customer_name=debt.customer.name,
        amount=float(debt.amount),
    )

    return {
        "status": "ok",
        "message": f"✅ Simulated payment for ref {body.payment_ref}",
        "debt_id": debt.id,
        "customer": debt.customer.name,
        "amount": float(debt.amount),
        "paid_at": debt.paid_at.isoformat(),
    }
