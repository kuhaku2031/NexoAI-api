
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** NexoAI-api
- **Date:** 2026-02-09
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 user_login_functionality
- **Test Code:** [TC001_user_login_functionality.py](./TC001_user_login_functionality.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/7dd9c35e-8ab0-419a-944b-e56d9e216c79
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 user_registration_process
- **Test Code:** [TC002_user_registration_process.py](./TC002_user_registration_process.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 46, in <module>
  File "<string>", line 31, in test_user_registration_process
AssertionError: Unexpected status code: 400 - {"statusCode":400,"timestamp":"2026-02-10T03:20:41.767Z","path":"/api/v1/auth/register","message":{"message":["property fullName should not exist","property company should not exist","owner_name should not be empty","owner_name must be shorter than or equal to 150 characters","owner_name must be longer than or equal to 3 characters","owner_name must be a string","owner_lastname should not be empty","owner_lastname must be shorter than or equal to 150 characters","owner_lastname must be longer than or equal to 3 characters","owner_lastname must be a string","confirm_password should not be empty","confirm_password must be shorter than or equal to 150 characters","confirm_password must be longer than or equal to 3 characters","confirm_password must be a string","company_name should not be empty","company_name must be shorter than or equal to 150 characters","company_name must be longer than or equal to 3 characters","company_name must be a string","business_type should not be empty","business_type must be shorter than or equal to 150 characters","business_type must be longer than or equal to 3 characters","business_type must be a string","phone_number should not be empty","phone_number must be shorter than or equal to 150 characters","phone_number must be longer than or equal to 3 characters","phone_number must be a string","address should not be empty","address must be shorter than or equal to 150 characters","address must be longer than or equal to 3 characters","address must be a string","city should not be empty","city must be shorter than or equal to 150 characters","city must be longer than or equal to 3 characters","city must be a string","country should not be empty","country must be shorter than or equal to 150 characters","country must be longer than or equal to 3 characters","country must be a string"],"error":"Bad Request","statusCode":400}}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/e3239ffe-ea68-474f-80d2-d27f60d436e9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 jwt_token_refresh_flow
- **Test Code:** [TC003_jwt_token_refresh_flow.py](./TC003_jwt_token_refresh_flow.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 59, in <module>
  File "<string>", line 27, in test_jwt_token_refresh_flow
AssertionError: Login failed: {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjM4LCJleHAiOjE3NzA2OTcyMzh9.oO_HWz9sXs7WeeUM6F8DBoyn6s8sgriUWvqM5pgRSvs","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjM4LCJleHAiOjE3NzA3ODAwMzh9.32AWWK32t2D7EtG_oViXSmJEsq6CDAB8Q4nUrFOiQZo","user":{"email":"test1@test.com","role":"OWNER","company_id":"COMP_LTOC2LPNU47X","first_name":"juan","last_name":"contreras"}}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/00fe57b0-660e-4176-8eb9-22e2050fe94e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 create_new_user_with_role_access_control
- **Test Code:** [TC004_create_new_user_with_role_access_control.py](./TC004_create_new_user_with_role_access_control.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 82, in <module>
  File "<string>", line 25, in test_create_new_user_with_role_access_control
AssertionError: Login failed: {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjQ3LCJleHAiOjE3NzA2OTcyNDd9.HGHt8vGJ-lD7k8eBx5djXyF62lrdFIpU7uptd0v6j70","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjQ3LCJleHAiOjE3NzA3ODAwNDd9.TZatUvKM15lYx7yBAza57WqfWoUjMPuQKKIwinUe7K4","user":{"email":"test1@test.com","role":"OWNER","company_id":"COMP_LTOC2LPNU47X","first_name":"juan","last_name":"contreras"}}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/48f1aef6-7a3d-4269-836e-ca9ac82e8f3f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 get_all_users_by_company
- **Test Code:** [TC005_get_all_users_by_company.py](./TC005_get_all_users_by_company.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/f44a18fa-3679-4917-bf50-338b8b344756
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 delete_user_soft_deletion
- **Test Code:** [TC006_delete_user_soft_deletion.py](./TC006_delete_user_soft_deletion.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 17, in test_delete_user_soft_deletion
AssertionError: Login failed with status 201

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 88, in <module>
  File "<string>", line 22, in test_delete_user_soft_deletion
AssertionError: Authentication failed: Login failed with status 201

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/a8868acc-bfbc-4de8-b593-be8be3d022d6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 create_product_inventory_management
- **Test Code:** [TC007_create_product_inventory_management.py](./TC007_create_product_inventory_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 94, in <module>
  File "<string>", line 23, in test_create_product_inventory_management
AssertionError: Login failed: {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjUwLCJleHAiOjE3NzA2OTcyNTB9._lEYsDUGCCNuJcMXKlk0A8N5d6jZIa_Rg6JVLiZgWW4","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjUwLCJleHAiOjE3NzA3ODAwNTB9.9mD2208QRcBJeikaQtDCCu_5gxAOCCkB8lnChpVVOLk","user":{"email":"test1@test.com","role":"OWNER","company_id":"COMP_LTOC2LPNU47X","first_name":"juan","last_name":"contreras"}}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/544c17c5-04c7-4efa-994f-3a9c455857f8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 search_products_functionality
- **Test Code:** [TC008_search_products_functionality.py](./TC008_search_products_functionality.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 88, in <module>
  File "<string>", line 51, in test_search_products_functionality
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 400 Client Error: Bad Request for url: http://localhost:3001/api/v1/products

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/14943e8a-971e-4e1e-8b90-f8f224e51746
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 create_sale_with_payment_integration
- **Test Code:** [TC009_create_sale_with_payment_integration.py](./TC009_create_sale_with_payment_integration.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 91, in <module>
  File "<string>", line 16, in test_create_sale_with_payment_integration
AssertionError: Login failed: {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjY1LCJleHAiOjE3NzA2OTcyNjV9.ObP3a2fA80XXa_7Hr425kaKadL7gnspgjTuqodHgYTo","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiQ09NUF9MVE9DMkxQTlU0N1giLCJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWF0IjoxNzcwNjkzNjY1LCJleHAiOjE3NzA3ODAwNjV9.0tY18DST7wG1nqqq7Z9JAvm0rPYRfVS7p0FY1mk2RDI","user":{"email":"test1@test.com","role":"OWNER","company_id":"COMP_LTOC2LPNU47X","first_name":"juan","last_name":"contreras"}}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/78d516ce-3b00-4bb1-8db7-436a583e3da6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 create_payment_transactions
- **Test Code:** [TC010_create_payment_transactions.py](./TC010_create_payment_transactions.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 141, in <module>
  File "<string>", line 93, in test_create_payment_transactions
  File "<string>", line 41, in create_product
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 400 Client Error: Bad Request for url: http://localhost:3001/api/v1/products

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/af0b274c-5e53-4b94-a7f4-715048327419/e181bbc8-62bc-4356-b27f-f5a6386fcbfa
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **20.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---