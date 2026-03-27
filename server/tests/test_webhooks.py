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


@patch("app.routers.debts._create_virtual_account")
def test_interswitch_webhook_partial_payment(mock_create_virtual_account, client):
    mock_create_virtual_account.return_value = {
        "virtual_account_no": "9090000001",
        "ussd_string": "*322*909#",
        "payment_ref": "KK-PARTIAL"
    }
    
    # 1. Register, login, create debt (amount 2000)
    client.post("/auth/register", json={"name": "Partial Trader", "phone": "08011112222", "business_name": "PBiz", "pin": "1234"})
    token = client.post("/auth/login", json={"phone": "08011112222", "pin": "1234"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    debt_resp = client.post("/debts", headers=headers, json={
        "customer_name": "Partial Customer",
        "customer_phone": "08033334444",
        "amount": 2000
    })
    debt_data = debt_resp.json()
    payment_ref = debt_data["payment_ref"]
    
    # 2. First partial payment: 800 Naira (80000 kobo)
    payload1 = {
        "paymentReference": payment_ref,
        "amount": 80000,
        "transactionDate": "2023-10-01T12:00:00Z"
    }
    payload1_bytes = json.dumps(payload1).encode()
    settings = get_settings()
    sig1 = _generate_signature(payload1_bytes, settings.webhook_secret)
    
    resp1 = client.post(
        "/webhooks/interswitch",
        content=payload1_bytes,
        headers={"x-interswitch-signature": sig1, "Content-Type": "application/json"}
    )
    assert resp1.status_code == 200
    
    # Verify PART PAID
    check1 = client.get(f"/debts/{debt_data['id']}", headers=headers)
    assert check1.json()["status"] == "PART PAID"
    assert check1.json()["total_paid"] == 800
    
    # 3. Second partial payment: 1200 Naira (120000 kobo) -> Total 2000 (Fully Paid)
    payload2 = {
        "paymentReference": payment_ref,
        "amount": 120000,
        "transactionDate": "2023-10-01T12:05:00Z"
    }
    payload2_bytes = json.dumps(payload2).encode()
    sig2 = _generate_signature(payload2_bytes, settings.webhook_secret)
    
    resp2 = client.post(
        "/webhooks/interswitch",
        content=payload2_bytes,
        headers={"x-interswitch-signature": sig2, "Content-Type": "application/json"}
    )
    assert resp2.status_code == 200
    
    # Verify PAID
    check2 = client.get(f"/debts/{debt_data['id']}", headers=headers)
    assert check2.json()["status"] == "PAID"
    assert check2.json()["total_paid"] == 2000
    assert check2.json()["paid_at"] is not None
