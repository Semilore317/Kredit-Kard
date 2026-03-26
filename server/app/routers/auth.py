from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
import bcrypt

from app.database import get_db
from app.config import get_settings
from app.models.trader import Trader
from app.schemas.auth import TraderRegister, TraderLogin, TokenResponse, TraderOut

from app.dependencies import get_current_trader

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/me", response_model=TraderOut)
def get_me(trader: Trader = Depends(get_current_trader)):
    return trader

def hash_pin(pin: str) -> str:
    # bcrypt requires bytes, returns bytes. we store as string in db.
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pin.encode('utf-8'), salt).decode('utf-8')


def verify_pin(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))


def create_access_token(trader_id: int) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(trader_id), "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


@router.post("/register", response_model=TraderOut, status_code=status.HTTP_201_CREATED)
def register(body: TraderRegister, db: Session = Depends(get_db)):
    existing = db.query(Trader).filter(Trader.phone == body.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    trader = Trader(
        name=body.name,
        phone=body.phone,
        business_name=body.business_name,
        pin_hash=hash_pin(body.pin),
    )
    db.add(trader)
    db.commit()
    db.refresh(trader)
    return trader


@router.post("/login", response_model=TokenResponse)
def login(body: TraderLogin, db: Session = Depends(get_db)):
    trader = db.query(Trader).filter(Trader.phone == body.phone).first()
    if not trader or not verify_pin(body.pin, trader.pin_hash):
        raise HTTPException(status_code=401, detail="Invalid phone or PIN")
    if not trader.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    return TokenResponse(access_token=create_access_token(trader.id))
