import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:3001"
AUTH_CREDENTIALS = ("test1@test.com", "1234")
TIMEOUT = 30

def test_delete_user_soft_deletion():
    # Step 1: Authenticate and get JWT token
    login_url = f"{BASE_URL}/api/v1/auth/login"
    login_payload = {
        "email": AUTH_CREDENTIALS[0],
        "password": AUTH_CREDENTIALS[1]
    }
    try:
        login_resp = requests.post(login_url, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
        login_data = login_resp.json()
        assert "access_token" in login_data, "access_token not in login response"
        token = login_data["access_token"]
    except Exception as e:
        raise AssertionError(f"Authentication failed: {e}")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    # Step 2: Create a new user to delete
    create_user_url = f"{BASE_URL}/api/v1/users"
    user_payload = {
        "email": "tempuser_to_delete@test.com",
        "password": "TempPassword123!",
        "firstName": "Temp",
        "lastName": "User",
        "role": "EMPLOYEE"
    }
    user_id = None
    try:
        create_resp = requests.post(create_user_url, json=user_payload, headers=headers, timeout=TIMEOUT)
        assert create_resp.status_code == 201, f"User creation failed: {create_resp.text}"
        created_user = create_resp.json()
        user_id = created_user.get("id") or created_user.get("_id") or created_user.get("userId")
        assert user_id, "User ID not returned after creation"

        # Step 3: Delete the user (soft delete)
        delete_user_url = f"{BASE_URL}/api/v1/users/{user_id}"
        delete_resp = requests.delete(delete_user_url, headers=headers, timeout=TIMEOUT)
        assert delete_resp.status_code == 200, f"User deletion failed: {delete_resp.text}"

        # Step 4: Verify user is not accessible via get all users by company
        get_users_url = f"{BASE_URL}/api/v1/users"
        get_users_resp = requests.get(get_users_url, headers=headers, timeout=TIMEOUT)
        assert get_users_resp.status_code == 200, f"Get users failed: {get_users_resp.text}"
        users_list = get_users_resp.json()
        # users_list might be list or wrapped in a key; handle both cases
        if isinstance(users_list, dict):
            users = users_list.get("data") or users_list.get("users") or []
        else:
            users = users_list
        assert all(user.get("id") != user_id and user.get("_id") != user_id for user in users), \
            "Deleted user still appears in users listing"

        # Step 5: Verify user data is retained by accessing user directly (assuming get user by id endpoint)
        get_user_url = f"{BASE_URL}/api/v1/users/{user_id}"
        get_user_resp = requests.get(get_user_url, headers=headers, timeout=TIMEOUT)
        # Depending on API design, deleted user might still be returned (with a deleted flag)
        # or an error/not found. We'll allow either no content or soft deleted flag.
        if get_user_resp.status_code == 200:
            user_data = get_user_resp.json()
            # Expect some field that indicates soft deletion, e.g., "deleted" or "isDeleted"
            assert user_data.get("deleted", False) or user_data.get("isDeleted", False), \
                "User data returned but not marked as deleted"
        else:
            # If user is not found after deletion, fail the test as it contradicts soft deletion premise
            assert False, f"Deleted user not found but expected soft deletion retention. Status: {get_user_resp.status_code}"

    finally:
        # Cleanup: Hard delete the user if still exists (no endpoint provided for hard delete other than delete user)
        if user_id:
            try:
                # Attempt to delete again if possible to ensure cleanup (if soft delete doesn't fully delete)
                requests.delete(f"{BASE_URL}/api/v1/users/{user_id}", headers=headers, timeout=TIMEOUT)
            except:
                pass

test_delete_user_soft_deletion()