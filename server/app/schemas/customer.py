from pydantic import BaseModel


class CustomerOut(BaseModel):
    id: int
    name: str
    phone: str
    total_outstanding: float
    total_debts: int

    model_config = {"from_attributes": True}


class CustomerDebtSummary(BaseModel):
    id: int
    amount: float
    status: str
    description: str | None
    ussd_string: str | None

    model_config = {"from_attributes": True}
