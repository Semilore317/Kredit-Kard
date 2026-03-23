"""
Dependency: extract and verify JWT from Authorization header,
returning the authenticated Trader.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database import get_db
from app.config import get_settings
from app.models.trader import Trader

bearer_scheme = HTTPBearer()


def get_current_trader(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Trader:
    settings = get_settings()
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        trader_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    trader = db.query(Trader).filter(Trader.id == trader_id).first()
    if not trader or not trader.is_active:
        raise HTTPException(status_code=401, detail="Trader not found or deactivated")
    return trader
