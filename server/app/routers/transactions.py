from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.dependencies import get_current_trader
from app.models.transaction import Transaction
from app.models.trader import Trader
from app.models.debt import Debt
from app.schemas.transaction import TransactionOut

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=list[TransactionOut])
def list_transactions(
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    txns = (
        db.query(Transaction)
        .options(joinedload(Transaction.debt).joinedload(Debt.customer))
        .filter(Transaction.trader_id == trader.id)
        .order_by(Transaction.created_at.desc())
        .all()
    )
    
    results = []
    for txn in txns:
        # Use model_validate for Pydantic v2
        out = TransactionOut.model_validate(txn)
        # Manually attach customer name from the joined relationship
        out.customer_name = txn.debt.customer.name
        results.append(out)
        
    return results
