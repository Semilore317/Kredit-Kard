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
        cleaned = re.sub(r"\s+", "", v)
        if not re.match(r"^(\+234|0)[789]\d{9}$", cleaned):
            raise ValueError("Enter a valid Nigerian phone number")
        if cleaned.startswith("0"):
            cleaned = "+234" + cleaned[1:]
        elif cleaned.startswith("234"):
            cleaned = "+" + cleaned
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

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"\s+", "", v)
        if not re.match(r"^(\+234|0)[789]\d{9}$", cleaned):
            raise ValueError("Enter a valid Nigerian phone number")
        if cleaned.startswith("0"):
            cleaned = "+234" + cleaned[1:]
        elif cleaned.startswith("234"):
            cleaned = "+" + cleaned
        return cleaned


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TraderOut(BaseModel):
    id: int
    name: str
    phone: str
    business_name: str

    model_config = {"from_attributes": True}
