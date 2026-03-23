import httpx
from app.config import get_settings

settings = get_settings()

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def _auth_headers() -> dict:
    """Returns Basic Auth headers using Interswitch client credentials."""
    import base64
    creds = f"{settings.interswitch_client_id}:{settings.interswitch_client_secret}"
    encoded = base64.b64encode(creds.encode()).decode()
    return {**HEADERS, "Authorization": f"Basic {encoded}"}


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

    In sandbox / offline mode this returns mock data so development
    continues without live credentials.
    """
    try:
        payload = {
            "merchantCode": settings.interswitch_client_id,
            "payableCode": payment_ref,
            "amount": int(amount * 100),  # Interswitch expects kobo
            "customerName": customer_name,
            "customerEmail": "",  # optional
        }
        response = httpx.post(
            f"{settings.interswitch_base_url}/api/v2/quickteller/virtualaccounts",
            json=payload,
            headers=_auth_headers(),
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
        virtual_account_no = data.get("accountNumber", "")
        ussd_string = f"*322*{virtual_account_no}*{int(amount * 100)}#"
        return {
            "virtual_account_no": virtual_account_no,
            "ussd_string": ussd_string,
            "payment_ref": payment_ref,
        }
    except Exception:
        # Fallback: return mock data so the rest of the flow doesn't break
        # Replace with real error handling before going live
        mock_account = f"909{abs(hash(payment_ref)) % 10_000_000:07d}"
        return {
            "virtual_account_no": mock_account,
            "ussd_string": f"*322*{mock_account}*{int(amount * 100)}#",
            "payment_ref": payment_ref,
        }
