import httpx
from app.config import get_settings

settings = get_settings()


def _format_phone(phone: str) -> str:
    """Standardize to 234XXXXXXXXXX for Termii API."""
    cleaned = "".join(filter(str.isdigit, phone))
    if cleaned.startswith("0") and len(cleaned) == 11:
        return "234" + cleaned[1:]
    if cleaned.startswith("234") and len(cleaned) == 13:
        return cleaned
    return cleaned # fallback


def send_debt_notification(
    customer_phone: str,
    customer_name: str,
    trader_business_name: str,
    amount: float,
    ussd_string: str,
    virtual_account_no: str,
) -> bool:
    """Send SMS to customer when a debt is logged."""
    message = (
        f"Hello {customer_name}, you owe {trader_business_name} "
        f"N{amount:,.0f}.\n"
        f"Pay now: Dial {ussd_string} OR transfer to {virtual_account_no} (GTBank).\n"
        f"Powered by KreditKard."
    )
    return _send(customer_phone, message)


def send_payment_confirmation(
    trader_phone: str,
    customer_name: str,
    amount: float,
    is_partial: bool = False,
    remaining: float = 0.0,
) -> bool:
    """Notify the trader that a customer has paid (fully or partially)."""
    if is_partial:
        message = (
            f"Partial payment received! {customer_name} just paid N{amount:,.0f}. "
            f"Remaining balance: N{remaining:,.0f}. "
            f"Your KreditKard ledger has been updated."
        )
    else:
        message = (
            f"Payment received! {customer_name} just paid N{amount:,.0f}. "
            f"Debt cleared. Your KreditKard ledger has been updated."
        )
    return _send(trader_phone, message)


def _send(phone: str, message: str) -> bool:
    """Internal — POST to Termii send API."""
    try:
        payload = {
            "to": _format_phone(phone),
            "from": settings.termii_sender_id,
            "sms": message,
            "type": "plain",
            "channel": "generic",
            "api_key": settings.termii_api_key,
        }
        response = httpx.post(
            f"{settings.termii_base_url}/api/sms/send",
            json=payload,
            timeout=8.0,
        )
        return response.status_code == 200
    except Exception:
        # Log but don't crash — SMS failure must not block debt creation
        print(f"[SMS] Failed to send to {phone}")
        return False
