from datetime import datetime
from pydantic import BaseModel


class TransactionOut(BaseModel):
    id: int
    debt_id: int
    amount: float
    payment_ref: str
    channel: str
    status: str
    created_at: datetime
    
    # Nested customer name for display
    customer_name: str | None = None

    model_config = {"from_attributes": True}
