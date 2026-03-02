import requests

BASE_URL = "http://localhost:3001"
LOGIN_ENDPOINT = f"{BASE_URL}/api/v1/auth/login"
PRODUCTS_ENDPOINT = f"{BASE_URL}/api/v1/products"
SEARCH_ENDPOINT = f"{PRODUCTS_ENDPOINT}/search"

USERNAME = "test1@test.com"
PASSWORD = "1234"


def test_search_products_functionality():
    # Step 1: Authenticate to get JWT token
    login_payload = {"email": USERNAME, "password": PASSWORD}
    try:
        login_resp = requests.post(
            LOGIN_ENDPOINT,
            json=login_payload,
            timeout=30
        )
        login_resp.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Login failed with exception: {str(e)}"

    login_data = login_resp.json()
    assert 'access_token' in login_data and isinstance(login_data['access_token'], str) and login_data['access_token'], "Login response missing valid access_token"
    token = login_data['access_token']

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Step 2: Create a product to be searchable
    new_product = {
        "name": "TestProductSearchXYZ",
        "description": "A product used specifically for search testing",
        "price": 25.00,
        "quantity": 10,
        "category_name": "TestCategorySearch"
    }

    created_product_id = None
    try:
        create_resp = requests.post(
            PRODUCTS_ENDPOINT,
            json=new_product,
            headers=headers,
            timeout=30
        )
        create_resp.raise_for_status()
        assert create_resp.status_code == 201, f"Expected 201 Created, got {create_resp.status_code}"
        create_data = create_resp.json()
        assert 'id' in create_data and isinstance(create_data['id'], str) and create_data['id'], "Created product response missing valid 'id'"
        created_product_id = create_data['id']

        # Step 3: Search products by name keyword included in created product
        search_payload = {"keyword": "TestProductSearchXYZ"}
        search_resp = requests.post(
            SEARCH_ENDPOINT,
            json=search_payload,
            headers=headers,
            timeout=30
        )
        search_resp.raise_for_status()
        assert search_resp.status_code == 200, f"Expected 200 OK for search, got {search_resp.status_code}"
        search_results = search_resp.json()
        assert isinstance(search_results, list), "Search response should be a list"
        # Check at least one result matches the created product id and name
        matching_products = [p for p in search_results if 'id' in p and p['id'] == created_product_id and p.get('name') == new_product['name']]
        assert len(matching_products) > 0, "Created product not found in search results"

    finally:
        # Step 4: Cleanup - delete the created product
        if created_product_id:
            try:
                delete_resp = requests.delete(
                    f"{PRODUCTS_ENDPOINT}/{created_product_id}",
                    headers=headers,
                    timeout=30
                )
                # Accept 200 OK or 204 No Content as success
                assert delete_resp.status_code in [200, 204], f"Failed to delete test product, status code {delete_resp.status_code}"
            except requests.RequestException:
                pass  # Cleanup best effort


test_search_products_functionality()
