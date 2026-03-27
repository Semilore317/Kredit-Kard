from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.config import get_settings
from app.models.debt import Debt, DebtStatus
from app.schemas.debt import SimulationRequest
from app.services import sms

router = APIRouter(prefix="/demo", tags=["Demo"])
settings = get_settings()

@router.post("/simulate-payment")
def simulate_payment(
    body: SimulationRequest,
    db: Session = Depends(get_db),
):
    """
    Manually simulate a payment (partial or full) for a debt. 
    Only works if app is in 'mock' payment mode.
    """
    if settings.payment_mode != "mock":
        raise HTTPException(
            status_code=403, 
            detail="Payment simulation is only available in mock mode."
        )

    debt = (
        db.query(Debt)
        .options(joinedload(Debt.trader), joinedload(Debt.customer))
        .filter(Debt.payment_ref == body.payment_ref)
        .first()
    )
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    if debt.status == DebtStatus.PAID:
        raise HTTPException(status_code=400, detail="Debt is already fully paid")

    amount_naira = float(body.amount)
    total_amount = float(debt.amount)
    current_paid = float(debt.total_paid or 0)
    
    if amount_naira > (total_amount - current_paid + 0.01):  # allowance for float precision
        raise HTTPException(status_code=400, detail="Amount exceeds remaining balance")

    new_total_paid = current_paid + amount_naira
    is_fully_paid = new_total_paid >= total_amount - 0.01
    new_status = DebtStatus.PAID if is_fully_paid else DebtStatus.PART_PAID
    paid_at = datetime.now(timezone.utc) if is_fully_paid else None

    # Cap total_paid at total_amount to avoid overflow in display
    if is_fully_paid:
        new_total_paid = total_amount

    debt.total_paid = new_total_paid
    debt.status = new_status
    debt.paid_at = paid_at
    db.commit()
    db.refresh(debt)

    # Notify trader (matching real webhook behavior)
    try:
        sms.send_payment_confirmation(
            trader_phone=debt.trader.phone,
            customer_name=debt.customer.name,
            amount=amount_naira,
            is_partial=not is_fully_paid,
            remaining=max(0.0, total_amount - float(debt.total_paid))
        )
    except Exception:
        print(f"[Demo] SMS notification failed for debt {debt.id}")

    return {"status": "ok", "debt_id": debt.id}
