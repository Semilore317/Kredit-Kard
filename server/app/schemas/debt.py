from datetime import datetime
from pydantic import BaseModel, field_validator
import re


class CustomerNested(BaseModel):
    id: int
    name: str
    phone: str

class DebtCreate(BaseModel):
    customer_name: str
    customer_phone: str
    amount: float
    description: str | None = None

    @field_validator("customer_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"\s+", "", v)
        if not re.match(r"^(\+234|0)[789]\d{9}$", cleaned):
            raise ValueError("Enter a valid Nigerian phone number")
        return cleaned

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Amount must be greater than zero")
        return v


class DebtOut(BaseModel):
    id: int
    customer: CustomerNested
    amount: float
    description: str | None
    status: str
    payment_ref: str | None
    virtual_account_no: str | None
    ussd_string: str | None
    created_at: datetime
    paid_at: datetime | None

    model_config = {"from_attributes": True}


class DebtListOut(BaseModel):
    id: int
    customer: CustomerNested
    amount: float
    status: str
    ussd_string: str | None
    created_at: datetime
    paid_at: datetime | None

    model_config = {"from_attributes": True}
