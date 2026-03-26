import pytest
from unittest.mock import patch

@pytest.fixture
def auth_headers(client):
    # Register and login to get token
    client.post(
        "/auth/register",
        json={
            "name": "Analytics Trader",
            "phone": "08011112222",
            "business_name": "Analytics Biz",
            "pin": "1234"
        }
    )
    login_resp = client.post(
        "/auth/login",
        json={
            "phone": "08011112222",
            "pin": "1234"
        }
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@patch("app.routers.debts._create_virtual_account")
def test_dashboard_analytics(mock_create_virtual_account, client, auth_headers):
    mock_create_virtual_account.return_value = {
        "virtual_account_no": "9091234567",
        "ussd_string": "*322*9091234567*5000#",
        "payment_ref": "KK-REF1"
    }

    # 1. Create a debt
    client.post(
        "/debts",
        headers=auth_headers,
        json={
            "customer_name": "Cust 1",
            "customer_phone": "08000000001",
            "amount": 5000,
            "description": "Debt 1"
        }
    )

    # 2. Get analytics
    response = client.get("/analytics/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    
    # Total credit limit should be 5000
    assert data["total_credit_limit"] == 5000
    # Current balance (pending) should be 5000
    assert data["current_balance"] == 5000
    # Trust score should be 0 (no paid debts)
    assert data["trust_score"] == 0
    # Trends should have one entry
    assert len(data["spending_trends"]) >= 1
    assert data["spending_trends"][-1]["amount"] == 5000
