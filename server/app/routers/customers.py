from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_trader
from app.models.trader import Trader
from app.models.customer import Customer
from app.models.debt import Debt, DebtStatus
from app.schemas.customer import CustomerOut, CustomerDebtSummary

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=list[CustomerOut])
def list_customers(
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    """List all customers with their total outstanding balance."""
    customers = db.query(Customer).filter(Customer.trader_id == trader.id).all()

    result = []
    for c in customers:
        pending_debts = [d for d in c.debts if d.status == DebtStatus.PENDING]
        result.append(
            {
                "id": c.id,
                "name": c.name,
                "phone": c.phone,
                "total_outstanding": float(sum(d.amount for d in pending_debts)),
                "total_debts": len(c.debts),
            }
        )
    return result


@router.get("/{customer_id}/debts", response_model=list[CustomerDebtSummary])
def get_customer_debts(
    customer_id: int,
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    """Full debt history for a specific customer."""
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id, Customer.trader_id == trader.id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return [
        {
            "id": d.id,
            "amount": float(d.amount),
            "status": d.status.value,
            "description": d.description,
            "ussd_string": d.ussd_string,
        }
        for d in customer.debts
    ]
