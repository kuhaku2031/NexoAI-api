import requests

BASE_URL = "http://localhost:3001"
REGISTER_ENDPOINT = f"{BASE_URL}/api/v1/auth/register"
LOGIN_ENDPOINT = f"{BASE_URL}/api/v1/auth/login"

def test_user_registration_process():
    # User registration payload with company data and role OWNER expected by flow summary
    user_registration_data = {
        "email": "newuser+tc002@test.com",
        "password": "StrongPass!23",
        "fullName": "Test User TC002",
        "company": {
            "name": "Test Company TC002",
            "address": "123 Test St",
            "phone": "+1234567890",
            "email": "contact@companytc002.com"
        }
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(
        REGISTER_ENDPOINT,
        json=user_registration_data,
        headers=headers,
        timeout=30
    )

    assert response.status_code == 201, f"Unexpected status code: {response.status_code} - {response.text}"

    response_json = response.json()

    # Validate presence of JWT tokens and role OWNER in response
    assert "accessToken" in response_json, "accessToken not found in response"
    assert "refreshToken" in response_json, "refreshToken not found in response"
    assert "user" in response_json and "role" in response_json["user"], "User role info missing"
    assert response_json["user"]["role"] == "OWNER", f"User role is not OWNER: {response_json['user']['role']}"

    # Validate company data is returned and matches
    assert "company" in response_json["user"], "Company data missing in response user info"
    assert response_json["user"]["company"]["name"] == user_registration_data["company"]["name"], "Company name mismatch"


test_user_registration_process()
