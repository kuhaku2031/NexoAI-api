import requests
from requests.auth import HTTPBasicAuth
import uuid
import time

BASE_URL = "http://localhost:3001"
AUTH_URL = f"{BASE_URL}/api/v1/auth/login"
PAYMENTS_URL = f"{BASE_URL}/api/v1/payments"
SALES_URL = f"{BASE_URL}/api/v1/sales"
PRODUCTS_URL = f"{BASE_URL}/api/v1/products"

USERNAME = "test1@test.com"
PASSWORD = "1234"

timeout = 30


def login_get_token():
    resp = requests.post(
        AUTH_URL,
        json={"email": USERNAME, "password": PASSWORD},
        timeout=timeout
    )
    resp.raise_for_status()
    token = resp.json().get("access_token")
    assert token is not None, "No access_token in login response"
    return token


def create_product(token):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    unique_name = f"product_{uuid.uuid4()}"
    payload = {
        "name": unique_name,
        "description": "Test product",
        "price": 100.00,
        "stock": 10,
        "category_name": "default"
    }
    resp = requests.post(PRODUCTS_URL, json=payload, headers=headers, timeout=timeout)
    resp.raise_for_status()
    product = resp.json()
    product_id = product.get("id")
    assert product_id is not None, "No product ID returned from product creation"
    return product_id


def create_sale_with_payment(token, product_id):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    unique_customer = f"customer_{uuid.uuid4()}"
    payload = {
        "customer": unique_customer,
        "total": 100.00,
        "details": [
            {
                "product_id": product_id,
                "quantity": 1,
                "price": 100.00
            }
        ],
        "payments": [
            {
                "amount": 100.00,
                "method": "cash"
            }
        ]
    }
    resp = requests.post(SALES_URL, json=payload, headers=headers, timeout=timeout)
    resp.raise_for_status()
    sale = resp.json()
    sale_id = sale.get("id")
    assert sale_id is not None, "No sale ID returned from sales creation"
    return sale_id


def delete_sale(token, sale_id):
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.delete(f"{SALES_URL}/{sale_id}", headers=headers, timeout=timeout)
    resp.raise_for_status()
    assert resp.status_code == 200


def test_create_payment_transactions():
    token = login_get_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    sale_id = None
    try:
        # Create a product to use in the sale
        product_id = create_product(token)

        # Step 1: Create a sale to link payments to
        sale_id = create_sale_with_payment(token, product_id)

        # Step 2: Prepare multiple payments linked to the sale
        payments_payload = [
            {
                "sale_id": sale_id,
                "amount": 50.00,
                "method": "cash",
                "reference": f"ref-cash-{uuid.uuid4()}"
            },
            {
                "sale_id": sale_id,
                "amount": 50.00,
                "method": "credit_card",
                "card_number": "4111111111111111",
                "expiry_date": "12/26",
                "cvv": "123",
                "reference": f"ref-cc-{uuid.uuid4()}"
            }
        ]

        # Step 3: POST multiple payments
        response = requests.post(PAYMENTS_URL, json=payments_payload, headers=headers, timeout=timeout)
        
        # Validate response
        assert response.status_code == 201
        payments_created = response.json()
        assert isinstance(payments_created, list)
        assert len(payments_created) == 2

        for payment in payments_created:
            assert payment.get("sale_id") == sale_id
            assert payment.get("amount") in [50.00]
            assert payment.get("method") in ["cash", "credit_card"]
            assert "id" in payment and payment["id"] is not None

    finally:
        # Cleanup: Delete the sale to remove linked payments
        if sale_id:
            try:
                delete_sale(token, sale_id)
            except Exception:
                pass


test_create_payment_transactions()
