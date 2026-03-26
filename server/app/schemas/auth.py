from pydantic import BaseModel, field_validator
import re


class TraderRegister(BaseModel):
    name: str
    phone: str
    business_name: str
    pin: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Standardize to 11-digit Nigerian: 080XXXXXXXX
        cleaned = re.sub(r"\D", "", v) # remove all non-digits
        if cleaned.startswith("234") and len(cleaned) == 13:
            cleaned = "0" + cleaned[3:]
        
        if not re.match(r"^0[789][01]\d{8}$", cleaned):
            raise ValueError("Enter a valid Nigerian phone number (11 digits e.g. 080...)")
        return cleaned

    @field_validator("pin")
    @classmethod
    def validate_pin(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 4:
            raise ValueError("PIN must be exactly 4 digits")
        return v


class TraderLogin(BaseModel):
    phone: str
    pin: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TraderOut(BaseModel):
    id: int
    name: str
    phone: str
    business_name: str

    model_config = {"from_attributes": True}
