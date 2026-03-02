import requests

BASE_URL = "http://localhost:3001"
LOGIN_ENDPOINT = "/api/v1/auth/login"
USERS_ENDPOINT = "/api/v1/users"
USERS_ALL_ENDPOINT = "/api/v1/users/all"
TIMEOUT = 30

auth_username = "test1@test.com"
auth_password = "1234"

def test_create_new_user_with_role_access_control():
    session = requests.Session()
    try:
        # Step 1: Log in to get JWT token
        login_payload = {
            "email": auth_username,
            "password": auth_password
        }
        login_resp = session.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=login_payload,
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_data = login_resp.json()
        assert "access_token" in login_data, "No access_token in login response"
        token = login_data["access_token"]

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        # Step 2: Create a new user with role access control
        # Define new user data - role should be valid (OWNER, MANAGER, or EMPLOYEE)
        # Assuming role-based access control: only OWNER or MANAGER can create users
        # Use "EMPLOYEE" role for created user as example
        new_user_payload = {
            "email": "newuser@example.com",
            "password": "Password123!",
            "first_name": "New",
            "last_name": "User",
            "role": "EMPLOYEE"
        }
        create_resp = session.post(
            BASE_URL + USERS_ENDPOINT,
            json=new_user_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"User creation failed: {create_resp.text}"
        created_user = create_resp.json()
        assert created_user.get("email") == new_user_payload["email"], "Created user email mismatch"
        assert created_user.get("role") == new_user_payload["role"], "Created user role mismatch"
        assert "id" in created_user, "Created user ID missing"
        created_user_id = created_user["id"]

        # Step 3: Verify new user is listed in company users (should be returned in /users)
        list_resp = session.get(
            BASE_URL + USERS_ENDPOINT,
            headers=headers,
            timeout=TIMEOUT
        )
        assert list_resp.status_code == 200, f"Failed to get users list: {list_resp.text}"
        users_list = list_resp.json()
        assert any(u.get("id") == created_user_id for u in users_list), "New user not found in company users"

    finally:
        # Cleanup: Delete the created user
        try:
            if 'created_user_id' in locals():
                del_resp = session.delete(
                    f"{BASE_URL}{USERS_ENDPOINT}/{created_user_id}",
                    headers=headers,
                    timeout=TIMEOUT
                )
                assert del_resp.status_code == 200, f"Failed to delete user: {del_resp.text}"
        except Exception:
            pass

test_create_new_user_with_role_access_control()
