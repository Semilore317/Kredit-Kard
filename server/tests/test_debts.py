import pytest

@pytest.fixture
def auth_headers(client):
    # Register and login to get token
    client.post(
        "/auth/register",
        json={
            "name": "Debt Trader",
            "phone": "08099998888",
            "business_name": "Debt Biz",
            "pin": "1234"
        }
    )
    login_resp = client.post(
        "/auth/login",
        json={
            "phone": "08099998888",
            "pin": "1234"
        }
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


from unittest.mock import patch

@patch("app.routers.debts.create_virtual_account")
def test_create_debt(mock_create_virtual_account, client, auth_headers):
    mock_create_virtual_account.return_value = {
        "virtual_account_no": "9091234567",
        "ussd_string": "*322*9091234567*500000#",
        "payment_ref": "KK-TESTREF"
    }

    response = client.post(
        "/debts",
        headers=auth_headers,
        json={
            "customer_name": "Test Customer",
            "customer_phone": "08012341234",
            "amount": 5000,
            "description": "Test debt"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 5000
    assert data["status"] == "PENDING"
    assert "payment_ref" in data
    assert data["virtual_account_no"] == "9091234567"
    assert "ussd_string" in data
    mock_create_virtual_account.assert_called_once()


@patch("app.routers.debts.create_virtual_account")
def test_list_debts(mock_create_virtual_account, client, auth_headers):
    mock_create_virtual_account.return_value = {
        "virtual_account_no": "9091234567",
        "ussd_string": "*322*9091234567*500000#",
        "payment_ref": "KK-TESTREF"
    }

    # Create two debts
    client.post(
        "/debts",
        headers=auth_headers,
        json={
            "customer_name": "Customer One",
            "customer_phone": "08011110000",
            "amount": 2000,
        }
    )
    client.post(
        "/debts",
        headers=auth_headers,
        json={
            "customer_name": "Customer Two",
            "customer_phone": "08022220000",
            "amount": 3000,
        }
    )
    
    response = client.get("/debts", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["amount"] == 3000 # descending order by default
    assert data[1]["amount"] == 2000
