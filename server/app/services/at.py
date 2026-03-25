import httpx
from app.config import get_settings

settings = get_settings()


def get_base_url() -> str:
    """Return sandbox or live URL depending on the username."""
    if getattr(settings, "at_username", "").lower() == "sandbox":
        return "https://api.sandbox.africastalking.com/version1/messaging"
    return "https://api.africastalking.com/version1/messaging"


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
) -> bool:
    """Notify the trader that a customer has paid."""
    message = (
        f"Payment received! {customer_name} just paid N{amount:,.0f}. "
        f"Your KreditKard ledger has been updated."
    )
    return _send(trader_phone, message)


def _send(phone: str, message: str) -> bool:
    """Internal — POST to Africa's Talking messaging API."""
    try:
        url = get_base_url()
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "apiKey": getattr(settings, "at_api_key", ""),
        }
        data = {
            "username": getattr(settings, "at_username", ""),
            "to": phone,  # E.164 natively guaranteed by schemas
            "message": message,
        }
        response = httpx.post(url, headers=headers, data=data, timeout=8.0)
        if response.status_code not in [200, 201]:
            print(f"[AT SMS] Error from gateway: {response.text}")
        return response.status_code in [200, 201]
    except Exception as e:
        # Log but don't crash — SMS failure must not block processing
        print(f"[AT SMS] Failed to send to {phone}: {e}")
        return False
