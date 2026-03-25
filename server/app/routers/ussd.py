from fastapi import APIRouter, Depends, Form, Response
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.customer import Customer
from app.models.debt import Debt, DebtStatus

router = APIRouter(prefix="/ussd", tags=["USSD"])

@router.post("")
def ussd_handler(
    sessionId: str = Form(...),
    serviceCode: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(""),
    db: Session = Depends(get_db),
):
    """
    Africa's Talking USSD Gateway Webhook.
    """
    # 1. Catch-All Guard: Find customer
    customer = db.query(Customer).filter(Customer.phone == phoneNumber).first()
    if not customer:
        return Response(
            content="END You are not registered. Please visit Mama Amaka to start.", 
            media_type="text/plain"
        )

    # 2. Parse current input to defeat the cumulative string trap
    current_input = text.split('*')[-1] if text else ""

    # 3. Menu System
    if current_input == "":
        return Response(
            content="CON Welcome to KreditKard.\n1. View Pending Debts",
            media_type="text/plain"
        )
    
    elif current_input == "1":
        # Find oldest pending debt
        debt = (
            db.query(Debt)
            .filter(
                Debt.customer_id == customer.id, 
                Debt.status == DebtStatus.PENDING
            )
            .order_by(Debt.created_at.asc())
            .first()
        )
        if not debt:
            return Response(
                content="END You have no pending debts. Have a great day!",
                media_type="text/plain"
            )
        
        amount_formatted = f"N{float(debt.amount):,.0f}"
        return Response(
            content=f"END You owe {amount_formatted}. Pay to GTBank: {debt.virtual_account_no}.",
            media_type="text/plain"
        )

    # 4. Invalid Navigation Guard
    return Response(
        content="END Invalid option. Please dial the code again and select 1.",
        media_type="text/plain"
    )
