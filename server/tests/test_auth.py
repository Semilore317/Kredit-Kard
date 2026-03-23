def test_register_trader(client):
    response = client.post(
        "/auth/register",
        json={
            "name": "Test Trader",
            "phone": "08011112222",
            "business_name": "Test Biz",
            "pin": "1234"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Trader"
    assert data["phone"] == "08011112222"
    assert "id" in data


def test_login_trader(client):
    # First register
    client.post(
        "/auth/register",
        json={
            "name": "Login Trader",
            "phone": "08033334444",
            "business_name": "Login Biz",
            "pin": "0000"
        }
    )
    
    # Then login
    response = client.post(
        "/auth/login",
        json={
            "phone": "08033334444",
            "pin": "0000"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_pin(client):
    client.post(
        "/auth/register",
        json={
            "name": "Invalid Trader",
            "phone": "08055556666",
            "business_name": "Invalid Biz",
            "pin": "1111"
        }
    )
    
    response = client.post(
        "/auth/login",
        json={
            "phone": "08055556666",
            "pin": "9999" # wrong pin
        }
    )
    assert response.status_code == 401
