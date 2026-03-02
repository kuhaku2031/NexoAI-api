import requests

BASE_URL = "http://localhost:3001"
AUTH_ENDPOINT = "/api/v1/auth/login"
PRODUCTS_ENDPOINT = "/api/v1/products"

USERNAME = "test1@test.com"
PASSWORD = "1234"
TIMEOUT = 30

def test_create_product_inventory_management():
    try:
        # Step 1: Login to get JWT token
        login_payload = {
            "email": USERNAME,
            "password": PASSWORD
        }
        login_response = requests.post(
            BASE_URL + AUTH_ENDPOINT,
            json=login_payload,
            timeout=TIMEOUT
        )
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        login_json = login_response.json()
        access_token = login_json.get("access_token")
        assert access_token, "No access_token received in login response"

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        # Step 2: Create a new product with valid data
        product_payload = {
            "name": "Test Product TC007",
            "description": "Test product description",
            "price": 19.99,
            "quantity": 100,
            "sku": "TC007SKU001",
            "category": "Test Category",
            "barcode": "1234567890123",
            "weight": 1.5,
            "height": 10.0,
            "width": 5.0,
            "depth": 3.0,
            "active": True
        }
        create_resp = requests.post(
            BASE_URL + PRODUCTS_ENDPOINT,
            json=product_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Product creation failed: {create_resp.text}"
        product = create_resp.json()
        product_id = product.get("id")
        assert product_id, "Created product has no 'id' field"

        # Step 3: Retrieve the product by ID to verify it is stored correctly
        get_resp = requests.get(
            f"{BASE_URL}{PRODUCTS_ENDPOINT}/{product_id}",
            headers=headers,
            timeout=TIMEOUT
        )
        assert get_resp.status_code == 200, f"Failed to retrieve product: {get_resp.text}"
        retrieved_product = get_resp.json()

        # Validate the retrieved product data matches what was created
        assert retrieved_product["name"] == product_payload["name"]
        assert retrieved_product["description"] == product_payload["description"]
        assert float(retrieved_product["price"]) == product_payload["price"]
        assert int(retrieved_product["quantity"]) == product_payload["quantity"]
        assert retrieved_product["sku"] == product_payload["sku"]
        assert retrieved_product["category"] == product_payload["category"]
        assert retrieved_product["barcode"] == product_payload["barcode"]
        assert float(retrieved_product["weight"]) == product_payload["weight"]
        assert float(retrieved_product["height"]) == product_payload["height"]
        assert float(retrieved_product["width"]) == product_payload["width"]
        assert float(retrieved_product["depth"]) == product_payload["depth"]
        assert retrieved_product["active"] == product_payload["active"]

    finally:
        # Cleanup: Delete the product if it was created
        if 'product_id' in locals():
            try:
                requests.delete(
                    f"{BASE_URL}{PRODUCTS_ENDPOINT}/{product_id}",
                    headers=headers,
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_create_product_inventory_management()