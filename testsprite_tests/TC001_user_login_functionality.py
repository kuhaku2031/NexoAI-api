import requests

BASE_URL = "http://localhost:3001"


def test_user_login_functionality():
    login_url = f"{BASE_URL}/api/v1/auth/login"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    payload = {
        "email": "test1@test.com",
        "password": "1234"
    }

    try:
        response = requests.post(login_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Login request failed: {e}"

    assert response.status_code in (200, 201), f"Expected status code 200 or 201 but got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not in JSON format"

    assert 'access_token' in data or 'token' in data, "JWT token not found in response"

    token = data.get('access_token') or data.get('token')
    assert isinstance(token, str) and len(token) > 0, "Received token is invalid"

    parts = token.split('.')
    assert len(parts) == 3, "Token is not a valid JWT format"

    print("User login functionality test passed with valid JWT token.")


test_user_login_functionality()
