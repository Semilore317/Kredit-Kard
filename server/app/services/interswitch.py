import httpx
import base64
import hashlib
import urllib.parse
import time
import uuid
from typing import Optional
from app.config import get_settings
from fastapi import HTTPException
import threading

settings = get_settings()

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# Cache token in memory
_CACHED_TOKEN: Optional[str] = None
_TOKEN_EXPIRY: float = 0
_TOKEN_LOCK = threading.Lock()

def _get_access_token() -> str:
    global _CACHED_TOKEN, _TOKEN_EXPIRY
    
    with _TOKEN_LOCK:
        if _CACHED_TOKEN and time.time() < _TOKEN_EXPIRY:
            return _CACHED_TOKEN

    creds = f"{settings.interswitch_client_id}:{settings.interswitch_client_secret}"
    encoded = base64.b64encode(creds.encode()).decode()

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {encoded}",
    }
    payload = {"grant_type": "client_credentials"}

    token_url = f"{settings.interswitch_base_url}/passport/oauth/token"
    try:
        response = httpx.post(token_url, data=payload, headers=headers, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        _CACHED_TOKEN = data["access_token"]
        # expire 60s early for safety
        _TOKEN_EXPIRY = time.time() + float(data.get("expires_in", 3600)) - 60
        return _CACHED_TOKEN
    except httpx.HTTPError as e:
        # Fallback to mock mechanism if credentials fail, so frontend dev isn't blocked locally
        print(f"[Interswitch] Auth error: {e}. Ensure live keys are active.")
        raise HTTPException(status_code=502, detail="Payment gateway authentication failed.")


def _generate_signature(http_method: str, url: str, timestamp: str, nonce: str) -> str:
    encoded_url = urllib.parse.quote_plus(url)
    base_string = (
        f"{http_method}&{encoded_url}&{timestamp}&{nonce}&"
        f"{settings.interswitch_client_id}&{settings.interswitch_client_secret}"
    )
    hashed = hashlib.sha512(base_string.encode('utf-8')).digest()
    return base64.b64encode(hashed).decode('utf-8')


def create_virtual_account(
    payment_ref: str,
    amount: float,
    customer_name: str,
) -> dict:
    """
    Provisions a virtual account for a debt via Interswitch.

    Returns:
        {
            "virtual_account_no": str,
            "ussd_string": str,       # e.g. *322*0123456789#
            "payment_ref": str,
        }
    """
    token = _get_access_token()
    
    url_path = "/api/v2/quickteller/virtualaccounts"
    full_url = f"{settings.interswitch_base_url}{url_path}"

    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex
    
    signature = _generate_signature("POST", full_url, timestamp, nonce)

    headers = {
        **HEADERS,
        "Authorization": f"Bearer {token}",
        "Timestamp": timestamp,
        "Nonce": nonce,
        "Signature": signature,
        "SignatureMethod": "SHA-512",
        "TerminalId": getattr(settings, "interswitch_terminal_id", "3pInterswitch"),
    }

    payload = {
        "merchantCode": settings.interswitch_client_id,
        "payableCode": payment_ref,
        "amount": round(amount * 100),  # Interswitch expects kobo; round() avoids float drift
        "customerName": customer_name,
        "customerEmail": "",  # optional
    }

    try:
        response = httpx.post(
            full_url,
            json=payload,
            headers=headers,
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
        virtual_account_no = data.get("accountNumber", "")
        # Quickteller USSD format: *322*{naira amount}*{paycode}#
        # Amount in NAIRA (not kobo) — this is what the customer dials
        ussd_string = f"*322*{round(amount)}*{virtual_account_no}#"
        
        return {
            "virtual_account_no": virtual_account_no,
            "ussd_string": ussd_string,
            "payment_ref": payment_ref,
        }
    except Exception as e:
        status_code = getattr(e.response, "status_code", 502) if hasattr(e, "response") else 502
        print(f"[Interswitch] Virtual Account error: {e}")
        raise HTTPException(status_code=status_code, detail="Failed to provision virtual account via Interswitch")
