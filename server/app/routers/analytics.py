from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.dependencies import get_current_trader
from app.models.trader import Trader
from app.models.debt import Debt, DebtStatus

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    trader: Trader = Depends(get_current_trader),
):
    # 1. Total Credit Limit (Total debt amount extended across all time)
    total_credit_limit = db.query(func.sum(Debt.amount)).filter(Debt.trader_id == trader.id).scalar() or 0
    
    # 2. Current Balance (Total amount currently outstanding/PENDING)
    current_balance = db.query(func.sum(Debt.amount)).filter(
        Debt.trader_id == trader.id, 
        Debt.status == DebtStatus.PENDING
    ).scalar() or 0
    
    # 3. Recent Spending Trends (Last 30 days, grouped by date)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    trends_query = db.query(
        func.date(Debt.created_at).label("date"),
        func.sum(Debt.amount).label("total_amount")
    ).filter(
        Debt.trader_id == trader.id,
        Debt.created_at >= thirty_days_ago
    ).group_by(func.date(Debt.created_at)).order_by(func.date(Debt.created_at)).all()
    
    spending_trends = [{"date": str(t.date), "amount": float(t.total_amount)} for t in trends_query]
    
    # 4. Trust Score
    # Simple logic: (Total Paid / Total Debts) * 100
    # If no debts, score is 100 (clean slate)
    total_debts_count = db.query(Debt).filter(Debt.trader_id == trader.id).count()
    if total_debts_count == 0:
        trust_score = 100
    else:
        paid_debts_count = db.query(Debt).filter(
            Debt.trader_id == trader.id, 
            Debt.status == DebtStatus.PAID
        ).count()
        trust_score = round((paid_debts_count / total_debts_count) * 100)

    return {
        "total_credit_limit": float(total_credit_limit),
        "current_balance": float(current_balance),
        "spending_trends": spending_trends,
        "trust_score": trust_score
    }
