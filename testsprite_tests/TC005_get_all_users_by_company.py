import requests

BASE_URL = "http://localhost:3001"
LOGIN_URL = f"{BASE_URL}/api/v1/auth/login"
USERS_URL = f"{BASE_URL}/api/v1/users"
TIMEOUT = 30

USERNAME = "test1@test.com"
PASSWORD = "1234"


def test_get_all_users_by_company():
    # Step 1: Login to get JWT token
    try:
        login_resp = requests.post(
            LOGIN_URL,
            json={"email": USERNAME, "password": PASSWORD},
            timeout=TIMEOUT
        )
        login_resp.raise_for_status()
        token = login_resp.json().get("access_token")
        assert token, "No access token found in login response"
    except (requests.RequestException, AssertionError) as e:
        raise AssertionError(f"Login failed: {e}")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Step 2: Get all users by company
    try:
        users_resp = requests.get(USERS_URL, headers=headers, timeout=TIMEOUT)
        users_resp.raise_for_status()
        data = users_resp.json()
        assert isinstance(data, list), f"Expected list of users, got {type(data)}"

        # Check company consistency:
        company_ids = set()
        for user in data:
            company_id = user.get("company_id") or (user.get("company") and user.get("company").get("id"))
            assert company_id is not None, "User item missing company id"
            company_ids.add(company_id)

        assert len(company_ids) == 1, f"Users belong to multiple companies: {company_ids}"

    except (requests.RequestException, AssertionError) as e:
        raise AssertionError(f"Get all users by company failed: {e}")


test_get_all_users_by_company()
