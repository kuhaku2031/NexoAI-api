import requests

BASE_URL = "http://localhost:3001"
EMAIL = "test1@test.com"
PASSWORD = "1234"
TIMEOUT = 30

def test_create_sale_with_payment_integration():
    # Login to obtain JWT token
    login_url = f"{BASE_URL}/api/v1/auth/login"
    login_payload = {
        "email": EMAIL,
        "password": PASSWORD
    }
    login_resp = requests.post(login_url, json=login_payload, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json().get("access_token")
    assert token, "Access token not found in login response"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Step 1: Create a product to sell
    product_url = f"{BASE_URL}/api/v1/products"
    product_payload = {
        "name": "Test Product for Sale",
        "description": "Product used for sales creation test",
        "price": 15.0,
        "stock": 50,
        "category": "TestCategory"
    }
    product_id = None

    # Step 2: Create a category (if necessary, try creating to avoid dependency)
    category_url = f"{BASE_URL}/api/v1/categories"
    category_payload = {"name": "TestCategory", "description": "Category for test product"}

    category_resp = requests.post(category_url, headers=headers, json=category_payload, timeout=TIMEOUT)
    if category_resp.status_code not in [201, 409]:  # 409 if already exists
        assert False, f"Failed to create or recognize category: {category_resp.text}"

    # Create Product
    product_resp = requests.post(product_url, headers=headers, json=product_payload, timeout=TIMEOUT)
    assert product_resp.status_code == 201, f"Product creation failed: {product_resp.text}"
    product_id = product_resp.json().get("id")
    assert product_id, "Product ID missing from creation response"

    sale_url = f"{BASE_URL}/api/v1/sales"
    sale_id = None

    # Prepare sale with payment payload
    sale_payload = {
        "customer_name": "Test Customer",
        "total_amount": 15.0,
        "items": [
            {
                "product_id": product_id,
                "quantity": 1,
                "price": 15.0
            }
        ],
        "payment": {
            "method": "cash",
            "amount": 15.0,
            "details": {
                "reference": "TestPaymentRef"
            }
        }
    }

    # Send POST to sales with payment integration endpoint
    sale_resp = requests.post(sale_url, headers=headers, json=sale_payload, timeout=TIMEOUT)
    assert sale_resp.status_code == 201, f"Sale creation failed: {sale_resp.text}"
    sale_json = sale_resp.json()
    sale_id = sale_json.get("id")
    assert sale_id, "Sale ID not found in response"
    assert sale_json.get("total_amount") == 15.0, "Total amount mismatch in sale"
    assert "payment" in sale_json, "Payment info missing in sale response"
    assert sale_json["payment"].get("amount") == 15.0, "Payment amount mismatch"

    # Cleanup product
    if product_id:
        try:
            prod_del_resp = requests.delete(f"{product_url}/{product_id}", headers=headers, timeout=TIMEOUT)
            assert prod_del_resp.status_code == 200, f"Failed to delete product: {prod_del_resp.text}"
        except Exception as e:
            print(f"Warning: Exception during product cleanup: {e}")

test_create_sale_with_payment_integration()
