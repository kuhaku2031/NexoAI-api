import requests

BASE_URL = "http://localhost:3001"
LOGIN_URL = f"{BASE_URL}/api/v1/auth/login"
REFRESH_URL = f"{BASE_URL}/api/v1/auth/refresh"

EMAIL = "test1@test.com"
PASSWORD = "1234"
TIMEOUT = 30


def test_jwt_token_refresh_flow():
    try:
        # Step 1: Log in to get access and refresh tokens
        login_payload = {
            "email": EMAIL,
            "password": PASSWORD
        }
        login_headers = {"Content-Type": "application/json"}

        login_resp = requests.post(
            LOGIN_URL,
            json=login_payload,
            headers=login_headers,
            timeout=TIMEOUT,
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_data = login_resp.json()
        assert "access_token" in login_data, "access_token missing in login response"
        assert "refresh_token" in login_data, "refresh_token missing in login response"

        # Use the refresh_token to get new tokens

        refresh_payload = {
            "refreshToken": login_data["refresh_token"]
        }
        refresh_headers = {"Content-Type": "application/json"}

        refresh_resp = requests.post(
            REFRESH_URL,
            json=refresh_payload,
            headers=refresh_headers,
            timeout=TIMEOUT,
        )
        assert refresh_resp.status_code == 200, f"Token refresh failed: {refresh_resp.text}"
        refresh_data = refresh_resp.json()
        assert "access_token" in refresh_data, "access_token missing in refresh response"
        assert "refresh_token" in refresh_data, "refresh_token missing in refresh response"

        # Optional: Verify that new tokens differ from old tokens (implying refresh action)
        assert refresh_data["access_token"] != login_data["access_token"] or refresh_data["refresh_token"] != login_data["refresh_token"], "Tokens did not change after refresh"

    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"
    except ValueError as e:
        assert False, f"Invalid JSON response: {e}"


test_jwt_token_refresh_flow()
