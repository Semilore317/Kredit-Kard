import hashlib
import hmac
import json
from app.config import get_settings

def _generate_signature(payload_bytes: bytes, secret: str) -> str:
    return hmac.HMAC(
        secret.encode(),
        payload_bytes,
        hashlib.sha512,
    ).hexdigest()

from unittest.mock import patch

@patch("app.routers.debts._create_virtual_account")
def test_interswitch_webhook_valid_signature(mock_create_virtual_account, client):
    mock_create_virtual_account.return_value = {
        "virtual_account_no": "9090000000",
        "ussd_string": "*322*909#",
        "payment_ref": "KK-WEBHOOK"
    }
    # 1. Setup a debt directly (we mock the DB creation without auth just to test webhook)
    # Easiest way is to create via /debts using an auth header fixture but let's just create raw
    
    # Let's register, login, create debt
    client.post("/auth/register", json={"name": "WH Trader", "phone": "08077771111", "business_name": "WH Biz", "pin": "1234"})
    token = client.post("/auth/login", json={"phone": "08077771111", "pin": "1234"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    debt_resp = client.post("/debts", headers=headers, json={
        "customer_name": "WH Customer",
        "customer_phone": "08077772222",
        "amount": 1000
    })
    debt_data = debt_resp.json()
    payment_ref = debt_data["payment_ref"]
    
    # 2. Forge a webhook request
    payload = {
        "paymentReference": payment_ref,
        "amount": 100000, # 1000 in kobo
        "transactionDate": "2023-10-01T12:00:00Z"
    }
    payload_bytes = json.dumps(payload).encode()
    settings = get_settings()
    signature = _generate_signature(payload_bytes, settings.webhook_secret)
    
    # 3. Fire the webhook
    response = client.post(
        "/webhooks/interswitch",
        content=payload_bytes,
        headers={
            "x-interswitch-signature": signature,
            "Content-Type": "application/json"
        }
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    
    # 4. Verify debt is PAID
    check = client.get(f"/debts/{debt_data['id']}", headers=headers)
    assert check.json()["status"] == "PAID"


def test_interswitch_webhook_invalid_signature(client):
    payload_bytes = b'{"paymentReference": "KK-FAKE"}'
    
    response = client.post(
        "/webhooks/interswitch",
        content=payload_bytes,
        headers={
            "x-interswitch-signature": "invalid-signature",
            "Content-Type": "application/json"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid webhook signature"
