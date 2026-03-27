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
        # Standardize to 11-digit Nigerian: 080XXXXXXXX
        cleaned = re.sub(r"\D", "", v)
        if cleaned.startswith("234") and len(cleaned) == 13:
            cleaned = "0" + cleaned[3:]
            
        if not re.match(r"^0[789][01]\d{8}$", cleaned):
            raise ValueError("Enter a valid Nigerian phone number (11 digits e.g. 080...)")
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
    total_paid: float
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
    total_paid: float
    status: str
    ussd_string: str | None
    created_at: datetime
    paid_at: datetime | None

    model_config = {"from_attributes": True}
