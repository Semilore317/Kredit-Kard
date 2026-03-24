"""
Mock payment service for demo/development.

Returns deterministic fake data with the same schema as the real
Interswitch service, so the frontend never crashes when toggling
PAYMENT_MODE between 'mock' and 'live'.
"""
import uuid


def create_virtual_account(
    payment_ref: str,
    amount: float,
    customer_name: str,
) -> dict:
    """
    Mock version of interswitch.create_virtual_account().

    Returns the exact same schema:
        {
            "virtual_account_no": str,
            "ussd_string": str,
            "payment_ref": str,
        }
    """
    # Generate a deterministic-looking 10-digit virtual account number
    mock_acct = "909" + uuid.uuid4().hex[:7].upper()

    # USSD format matches the corrected Quickteller format: *322*{naira}*{account}#
    ussd_string = f"*322*{round(amount)}*{mock_acct}#"

    return {
        "virtual_account_no": mock_acct,
        "ussd_string": ussd_string,
        "payment_ref": payment_ref,
    }
