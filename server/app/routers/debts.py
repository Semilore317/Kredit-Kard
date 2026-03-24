import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_trader
from app.models.trader import Trader
from app.models.customer import Customer
from app.models.debt import Debt, DebtStatus
from app.schemas.debt import DebtCreate, DebtOut, DebtListOut

from app.config import get_settings
from app.services.interswitch import create_virtual_account as _live_create_va
from app.services.mock_payment import create_virtual_account as _mock_create_va
from app.services import sms

router = APIRouter(prefix="/debts", tags=["Debts"])


def _create_virtual_account(payment_ref: str, amount: float, customer_name: str) -> dict:
    """Dispatch to live or mock payment service based on PAYMENT_MODE env var."""
    settings = get_settings()
    if settings.payment_mode.lower() == "live":
        return _live_create_va(payment_ref, amount, customer_name)
    return _mock_create_va(payment_ref, amount, customer_name)


def _get_or_create_customer(
    db: Session, trader_id: int, name: str, phone: str
) -> Customer:
    customer = (
        db.query(Customer)
        .filter(Customer.trader_id == trader_id, Customer.phone == phone)
        .first()
    )
    if not customer:
        customer = Customer(trader_id=trader_id, name=name, phone=phone)
        db.add(customer)
        db.flush()  # get customer.id without committing
    return customer


def _debt_to_out(debt: Debt) -> dict:
    return {
        "id": debt.id,
        "customer_id": debt.customer_id,
        "customer_name": debt.customer.name,
        "customer_phone": debt.customer.phone,
        "amount": float(debt.amount),
        "description": debt.description,
        "status": debt.status.value,
        "payment_ref": debt.payment_ref,
        "virtual_account_no": debt.virtual_account_no,
        "ussd_string": debt.ussd_string,
        "created_at": debt.created_at,
        "paid_at": debt.paid_at,
    }


@router.post("", response_model=DebtOut, status_code=status.HTTP_201_CREATED)
def create_debt(
    body: DebtCreate,
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    customer = _get_or_create_customer(db, trader.id, body.customer_name, body.customer_phone)

    payment_ref = f"KK-{uuid.uuid4().hex[:8].upper()}"

    # Provision virtual account via Interswitch (falls back to mock in dev)
    try:
        payment_info = _create_virtual_account(payment_ref, body.amount, customer.name)
    except Exception as e:
        db.rollback()
        raise e

    debt = Debt(
        trader_id=trader.id,
        customer_id=customer.id,
        amount=body.amount,
        description=body.description,
        payment_ref=payment_ref,
        virtual_account_no=payment_info["virtual_account_no"],
        ussd_string=payment_info["ussd_string"],
    )
    db.add(debt)
    db.commit()
    db.refresh(debt)

    # Fire SMS — non-blocking (failure doesn't raise)
    sms.send_debt_notification(
        customer_phone=customer.phone,
        customer_name=customer.name,
        trader_business_name=trader.business_name,
        amount=body.amount,
        ussd_string=payment_info["ussd_string"],
        virtual_account_no=payment_info["virtual_account_no"],
    )

    return _debt_to_out(debt)


@router.get("", response_model=list[DebtListOut])
def list_debts(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    query = db.query(Debt).filter(Debt.trader_id == trader.id)
    if status_filter:
        try:
            query = query.filter(Debt.status == DebtStatus(status_filter.upper()))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status '{status_filter}'")
    debts = query.order_by(Debt.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "customer_name": d.customer.name,
            "amount": float(d.amount),
            "status": d.status.value,
            "ussd_string": d.ussd_string,
            "created_at": d.created_at,
            "paid_at": d.paid_at,
        }
        for d in debts
    ]


@router.get("/{debt_id}", response_model=DebtOut)
def get_debt(
    debt_id: int,
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    debt = db.query(Debt).filter(Debt.id == debt_id, Debt.trader_id == trader.id).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    return _debt_to_out(debt)


@router.patch("/{debt_id}/cancel", response_model=DebtOut)
def cancel_debt(
    debt_id: int,
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    debt = db.query(Debt).filter(Debt.id == debt_id, Debt.trader_id == trader.id).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    if debt.status != DebtStatus.PENDING:
        raise HTTPException(
            status_code=400, detail=f"Cannot cancel a debt with status '{debt.status.value}'"
        )
    debt.status = DebtStatus.CANCELLED
    db.commit()
    db.refresh(debt)
    return _debt_to_out(debt)
