# Product Requirements Document (PRD)
# NexoAI API

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Document Owner:** Product Team  
**Status:** Active Development

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Problem Statement](#problem-statement)
4. [Goals & Objectives](#goals--objectives)
5. [Target Users](#target-users)
6. [Product Features](#product-features)
7. [Functional Requirements](#functional-requirements)
8. [Non-Functional Requirements](#non-functional-requirements)
9. [Technical Architecture](#technical-architecture)
10. [User Stories](#user-stories)
11. [Success Metrics](#success-metrics)
12. [Development Roadmap](#development-roadmap)
13. [Dependencies & Constraints](#dependencies--constraints)
14. [Risk Assessment](#risk-assessment)
15. [Glossary](#glossary)

---

## 1. Executive Summary

NexoAI API is an enterprise-grade backend system designed to power intelligent business management platforms. It provides comprehensive functionality for point-of-sale (POS) operations, inventory management, sales tracking, multi-tenant company management, and AI-powered business insights.

Built with NestJS and PostgreSQL, the API follows a modular monolithic architecture that ensures scalability, maintainability, and clear separation of concerns, with a future path to microservices architecture.

### Key Highlights

- **Enterprise-Ready:** Multi-tenant architecture supporting multiple companies and locations
- **AI-Powered:** Integration with AI systems for business insights and automated workflows
- **Security-First:** JWT authentication, RBAC, and comprehensive security measures
- **Scalable Design:** Modular architecture ready to transition to microservices
- **Developer-Friendly:** Clean code structure, TypeScript, and comprehensive documentation

---

## 2. Product Overview

### 2.1 Product Vision

To provide a robust, scalable, and intelligent backend infrastructure that empowers small to medium-sized businesses to digitize their operations, gain data-driven insights, and automate workflows through AI integration.

### 2.2 Product Description

NexoAI API is a RESTful backend service that serves as the core engine for business management applications. It handles:

- **Authentication & Authorization:** Secure user management with role-based access control
- **Business Operations:** Complete POS, inventory, and sales management
- **Multi-Tenancy:** Company-based data isolation and management
- **AI Integration:** Chat interfaces and workflow automation through N8N
- **Analytics:** Real-time reporting and business intelligence
- **Payment Processing:** Multiple payment methods and transaction tracking

### 2.3 Product Type

B2B SaaS Backend API Platform

---

## 3. Problem Statement

### 3.1 Current Challenges

**For Small-Medium Businesses:**
- Lack of affordable, comprehensive business management systems
- Disconnected tools that don't communicate with each other
- No access to AI-powered business insights
- Manual processes leading to errors and inefficiencies
- Difficulty tracking inventory, sales, and employee performance

**For Developers:**
- Building POS and business management systems from scratch is time-consuming
- Complex multi-tenant architecture requirements
- Need for secure authentication and authorization systems
- Integration with AI services requires significant effort

### 3.2 Market Opportunity

The global POS software market is projected to reach $30+ billion by 2027. Small and medium businesses are increasingly looking for:
- Cloud-based solutions
- AI-powered insights
- Mobile accessibility
- Affordable pricing
- Easy integration capabilities

---

## 4. Goals & Objectives

### 4.1 Business Goals

1. **Market Penetration:** Capture 5% of the SMB market in target regions within 24 months
2. **User Adoption:** Onboard 1,000+ businesses in the first year
3. **Revenue:** Achieve $500K ARR by end of year 2
4. **Platform Stability:** Maintain 99.9% uptime SLA

### 4.2 Product Goals

1. **Functionality:** Deliver complete POS and inventory management capabilities
2. **Performance:** Handle 10,000+ transactions per day per tenant
3. **Scalability:** Support 100+ concurrent users per company
4. **AI Integration:** Provide actionable business insights through AI
5. **Developer Experience:** Comprehensive API documentation and SDK support

### 4.3 User Goals

**Business Owners:**
- Reduce operational costs by 30%
- Gain real-time visibility into business performance
- Make data-driven decisions with AI insights

**Managers:**
- Streamline daily operations
- Track employee performance
- Manage inventory efficiently

**Employees:**
- Easy-to-use POS system
- Quick transaction processing
- Clear task management

---

## 5. Target Users

### 5.1 Primary Users

#### Business Owners (Company Admins)
- **Demographics:** 30-55 years old, small-medium business owners
- **Tech Savviness:** Moderate
- **Goals:** Business growth, cost reduction, operational efficiency
- **Pain Points:** Limited time, need for insights, manual processes

#### Store Managers
- **Demographics:** 25-45 years old, retail/service industry managers
- **Tech Savviness:** Moderate to high
- **Goals:** Smooth operations, inventory control, staff management
- **Pain Points:** Stock issues, staff coordination, reporting complexity

#### Sales Employees
- **Demographics:** 18-40 years old, front-line staff
- **Tech Savviness:** Basic to moderate
- **Goals:** Fast transaction processing, accurate record-keeping
- **Pain Points:** System complexity, slow processes, errors

### 5.2 Secondary Users

#### Developers/Integrators
- Companies building custom business applications
- System integrators connecting multiple platforms
- Mobile app developers

#### Accountants/Financial Managers
- Need access to financial reports
- Require audit trails
- Tax compliance requirements

---

## 6. Product Features

### 6.1 Feature Overview

| Feature Category | Priority | Status | MVP |
|-----------------|----------|--------|-----|
| Authentication & Authorization | P0 | ✅ Complete | Yes |
| User Management | P0 | ✅ Complete | Yes |
| Company/Tenant Management | P0 | ✅ Complete | Yes |
| Product/Inventory Management | P0 | ✅ Complete | Yes |
| Sales Management | P0 | ✅ Complete | Yes |
| Payment Processing | P0 | ✅ Complete | Yes |
| Point of Sale (POS) | P0 | ✅ Complete | Yes |
| Work Sessions | P1 | ✅ Complete | No |
| Customer Management | P1 | 🚧 In Progress | No |
| AI Chat Integration | P1 | 🚧 In Progress | No |
| Analytics & Reporting | P1 | 🚧 In Progress | No |
| N8N Workflow Automation | P2 | 📋 Planned | No |
| Real-time Notifications | P2 | 📋 Planned | No |
| Advanced Insights | P2 | 📋 Planned | No |

**Priority Legend:**
- P0: Must Have (Critical)
- P1: Should Have (Important)
- P2: Nice to Have (Enhancement)

---

## 7. Functional Requirements

### 7.1 Authentication & Authorization

#### FR-AUTH-001: User Registration
**Priority:** P0 | **Status:** ✅ Complete

**Description:** System shall allow new users to register with company information.

**Acceptance Criteria:**
- User can register with email, password, and company details
- Email must be unique in the system
- Password must meet security requirements (min 8 chars, uppercase, lowercase, number)
- Company is automatically created upon registration
- First user becomes company owner (OWNER role)
- JWT tokens (access + refresh) are generated and returned

**API Endpoint:** `POST /auth/register`

---

#### FR-AUTH-002: User Login
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Registered users can authenticate and receive access tokens.

**Acceptance Criteria:**
- User can login with email and password
- System validates credentials against database
- Returns JWT access token (15min expiry) and refresh token (7 days)
- Failed attempts are logged
- User session is tracked

**API Endpoint:** `POST /auth/login`

---

#### FR-AUTH-003: Token Refresh
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Users can refresh expired access tokens using refresh token.

**Acceptance Criteria:**
- Accepts valid refresh token
- Generates new access token
- Validates refresh token hasn't expired
- Invalidates old refresh token (optional)

**API Endpoint:** `POST /auth/refresh`

---

#### FR-AUTH-004: Role-Based Access Control
**Priority:** P0 | **Status:** ✅ Complete

**Description:** System enforces role-based permissions across all endpoints.

**Roles:**
- **OWNER:** Full access to company data, user management, billing
- **MANAGER:** Access to operations, reports, limited user management
- **EMPLOYEE:** Limited access to POS and assigned tasks

**Implementation:**
- Guards validate user role before endpoint access
- Decorators `@Roles()` define required roles per endpoint
- JWT payload contains user role information

---

### 7.2 Company Management

#### FR-COMPANY-001: Company Creation
**Priority:** P0 | **Status:** ✅ Complete

**Description:** System creates company entity during user registration.

**Acceptance Criteria:**
- Company name is required and must be unique
- Company stores business information (address, phone, tax ID)
- Subscription tier is set (FREE, BASIC, PRO, ENTERPRISE)
- Company owner relationship is established
- Timestamps are automatically managed

---

#### FR-COMPANY-002: Multi-Tenant Isolation
**Priority:** P0 | **Status:** ✅ Complete

**Description:** All data is isolated by company context.

**Acceptance Criteria:**
- Every business entity belongs to a company
- Users can only access data from their company
- Tenant context is extracted from JWT token
- Database queries automatically filter by companyId
- No cross-tenant data leakage

---

### 7.3 User Management

#### FR-USER-001: Create User
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Company owners/managers can create new users.

**Acceptance Criteria:**
- OWNER can create MANAGER and EMPLOYEE users
- MANAGER can create EMPLOYEE users
- Email must be unique globally
- Password is hashed before storage (bcrypt)
- User is assigned to company automatically
- Default role is EMPLOYEE if not specified

**API Endpoint:** `POST /users`

---

#### FR-USER-002: List Users
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Authorized users can view company users.

**Acceptance Criteria:**
- Returns users filtered by company
- EMPLOYEE can only see their own profile
- MANAGER and OWNER can see all company users
- Passwords are excluded from response
- Supports pagination (optional)

**API Endpoint:** `GET /users`

---

#### FR-USER-003: Update User
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Users can update their profile; admins can update any user.

**Acceptance Criteria:**
- Users can update their own name, email
- OWNER can update any user's role
- Password changes require current password validation
- Email changes must maintain uniqueness
- Cannot demote own role to lower than OWNER

**API Endpoint:** `PATCH /users/:id`

---

#### FR-USER-004: Delete User
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Authorized users can soft delete users.

**Acceptance Criteria:**
- Only OWNER can delete users
- Soft delete (sets deleted_at timestamp)
- Cannot delete self
- Deleted users cannot login
- Data remains for audit purposes

**API Endpoint:** `DELETE /users/:id`

---

### 7.4 Product/Inventory Management

#### FR-PRODUCT-001: Create Product
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Authorized users can add products to inventory.

**Acceptance Criteria:**
- Product requires name, price, and stock quantity
- SKU/Barcode is optional but must be unique if provided
- Product belongs to company (multi-tenant)
- Category can be assigned
- Price must be positive number
- Stock quantity is integer (can be 0)
- Images can be stored (URL)

**API Endpoint:** `POST /products`

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "stock": 100,
  "sku": "SKU001",
  "barcode": "1234567890",
  "category": "ELECTRONICS",
  "imageUrl": "https://example.com/image.jpg"
}
```

---

#### FR-PRODUCT-002: Search Products
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Users can search and filter products.

**Acceptance Criteria:**
- Search by name (partial match, case-insensitive)
- Search by SKU or barcode (exact match)
- Filter by category
- Filter by stock status (in stock, low stock, out of stock)
- Results are paginated
- Sorted by name by default

**API Endpoint:** `GET /products/search?q=term&category=CAT&page=1&limit=20`

---

#### FR-PRODUCT-003: Update Product
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Authorized users can update product information.

**Acceptance Criteria:**
- Can update any product field except ID and companyId
- Price changes are logged (optional)
- Stock adjustments update current stock
- Cannot set negative stock or price
- Update timestamp is automatically set

**API Endpoint:** `PATCH /products/:id`

---

#### FR-PRODUCT-004: Delete Product
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Authorized users can remove products.

**Acceptance Criteria:**
- Soft delete preferred (deleted_at)
- Cannot delete product with pending orders (optional)
- Deleted products don't appear in searches
- Historical sales data remains intact

**API Endpoint:** `DELETE /products/:id`

---

#### FR-PRODUCT-005: Low Stock Alerts
**Priority:** P1 | **Status:** 📋 Planned

**Description:** System notifies when product stock is low.

**Acceptance Criteria:**
- Configurable low stock threshold per product
- Alert triggered when stock <= threshold
- Notifications sent to managers/owners
- Dashboard widget shows low stock products

---

### 7.5 Sales Management

#### FR-SALE-001: Create Sale
**Priority:** P0 | **Status:** ✅ Complete

**Description:** System processes complete sale transactions.

**Acceptance Criteria:**
- Sale includes customer info (optional), items, and payment
- Multiple products can be added to single sale
- Calculates total automatically (sum of items)
- Reduces product stock for each item sold
- Creates sale, sale details, and payment records atomically
- Transaction rollback on any failure
- Assigns sale to user who created it
- Records point of sale location

**API Endpoint:** `POST /sales`

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "pointOfSaleId": "pos-123",
  "items": [
    {
      "productId": "prod-1",
      "quantity": 2,
      "price": 29.99
    },
    {
      "productId": "prod-2",
      "quantity": 1,
      "price": 49.99
    }
  ],
  "payment": {
    "method": "CREDIT_CARD",
    "amount": 109.97,
    "reference": "TXN-12345"
  }
}
```

**Business Rules:**
- Stock must be available for all items before processing
- Payment amount must match sale total
- All operations happen in database transaction
- If any step fails, entire transaction is rolled back

---

#### FR-SALE-002: View Sale Details
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Users can view complete sale information.

**Acceptance Criteria:**
- Returns sale with all line items
- Shows payment information
- Includes customer details
- Shows sale creator and timestamp
- Filtered by company (multi-tenant)

**API Endpoint:** `GET /sales/:id`

---

#### FR-SALE-003: List Sales
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Users can view sales history with filters.

**Acceptance Criteria:**
- Paginated results
- Filter by date range
- Filter by user (sales person)
- Filter by point of sale
- Filter by payment method
- Sorted by date (newest first)

**API Endpoint:** `GET /sales?startDate=2024-01-01&endDate=2024-12-31&userId=123&page=1`

---

#### FR-SALE-004: Cancel/Refund Sale
**Priority:** P1 | **Status:** 📋 Planned

**Description:** Authorized users can cancel sales and process refunds.

**Acceptance Criteria:**
- Only MANAGER and OWNER can cancel sales
- Restores product stock
- Creates refund payment record
- Sale marked as cancelled
- Reason required for cancellation
- Cannot cancel already cancelled sales

---

### 7.6 Payment Management

#### FR-PAYMENT-001: Process Payment
**Priority:** P0 | **Status:** ✅ Complete

**Description:** System records payment information for sales.

**Acceptance Criteria:**
- Supports multiple payment methods (CASH, CREDIT_CARD, DEBIT_CARD, TRANSFER)
- Records payment amount and reference
- Links payment to sale
- Validates payment amount matches sale total
- Timestamps payment

**Payment Methods:**
- `CASH`: Cash payments
- `CREDIT_CARD`: Credit card transactions
- `DEBIT_CARD`: Debit card transactions  
- `TRANSFER`: Bank transfers
- `DIGITAL_WALLET`: PayPal, Stripe, etc. (future)

---

#### FR-PAYMENT-002: Payment Reconciliation
**Priority:** P1 | **Status:** 📋 Planned

**Description:** Daily payment reconciliation reports.

**Acceptance Criteria:**
- Shows expected vs actual amounts per payment method
- Identifies discrepancies
- Exportable to CSV/PDF
- Filtered by date and POS location

---

### 7.7 Point of Sale (POS)

#### FR-POS-001: POS Location Management
**Priority:** P0 | **Status:** ✅ Complete

**Description:** Companies can manage multiple POS locations.

**Acceptance Criteria:**
- Create POS location with name and address
- Link POS to company
- Assign users to specific POS
- Track which POS processed each sale
- Enable/disable POS locations

**API Endpoint:** `POST /point-of-sales`

---

#### FR-POS-002: Work Sessions
**Priority:** P1 | **Status:** ✅ Complete

**Description:** Track employee work shifts at POS.

**Acceptance Criteria:**
- Employee starts session at POS
- Records start time and initial cash amount
- Tracks sales during session
- Employee ends session with final cash count
- Calculates expected vs actual cash
- Reports session summary

**API Endpoints:**
- `POST /work-sessions/start`
- `POST /work-sessions/end/:id`
- `GET /work-sessions/:id`

---

### 7.8 Customer Management

#### FR-CUSTOMER-001: Customer Profiles
**Priority:** P1 | **Status:** 🚧 In Progress

**Description:** Store and manage customer information.

**Acceptance Criteria:**
- Create customer with name, email, phone
- Link customers to sales history
- Track purchase history
- Customer loyalty points (optional)
- Export customer list

---

### 7.9 AI Integration

#### FR-AI-001: Chat Interface
**Priority:** P1 | **Status:** 🚧 In Progress

**Description:** AI-powered chat for business queries.

**Acceptance Criteria:**
- Users can ask business questions
- AI accesses company data securely
- Provides insights on sales, inventory, trends
- Conversation history stored
- Multi-turn conversations supported

---

#### FR-AI-002: Business Insights
**Priority:** P1 | **Status:** 🚧 In Progress

**Description:** Automated business insights generation.

**Acceptance Criteria:**
- Daily/weekly insights generated
- Highlights trends, anomalies
- Recommendations for action
- Delivered via dashboard and notifications

---

#### FR-AI-003: N8N Workflow Integration
**Priority:** P2 | **Status:** 📋 Planned

**Description:** Integration with N8N for workflow automation.

**Acceptance Criteria:**
- Webhooks to trigger N8N workflows
- Low stock → automatic purchase order
- High sales → supplier notification
- End of day → generate reports
- Custom workflow templates

---

### 7.10 Analytics & Reporting

#### FR-ANALYTICS-001: Sales Reports
**Priority:** P1 | **Status:** 🚧 In Progress

**Description:** Comprehensive sales analytics.

**Acceptance Criteria:**
- Daily, weekly, monthly sales totals
- Sales by product category
- Sales by employee
- Sales by POS location
- Comparison with previous periods
- Export to PDF/Excel

---

#### FR-ANALYTICS-002: Inventory Reports
**Priority:** P1 | **Status:** 🚧 In Progress

**Description:** Inventory analytics and forecasting.

**Acceptance Criteria:**
- Current stock levels
- Stock movement history
- Slow-moving items identification
- Forecast demand based on trends
- Reorder recommendations

---

#### FR-ANALYTICS-003: Dashboard
**Priority:** P1 | **Status:** 🚧 In Progress

**Description:** Real-time business dashboard.

**Acceptance Criteria:**
- Today's sales overview
- Top selling products
- Low stock alerts
- Active work sessions
- Recent transactions
- Key metrics (revenue, transactions, avg sale)

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Requirement | Target | Priority |
|------------|--------|----------|
| API Response Time | < 200ms for 95% of requests | P0 |
| Database Query Time | < 100ms for standard queries | P0 |
| Concurrent Users | 100+ per company | P0 |
| Daily Transactions | 10,000+ per tenant | P0 |
| Throughput | 100 requests/second | P1 |

**NFR-PERF-001:** API endpoints shall respond within 200ms for 95% of requests under normal load.

**NFR-PERF-002:** System shall support 100 concurrent users per company without degradation.

**NFR-PERF-003:** Database queries shall be optimized with proper indexing on frequently queried fields.

---

### 8.2 Scalability

**NFR-SCALE-001:** Architecture shall support horizontal scaling through load balancing.

**NFR-SCALE-002:** Database shall support read replicas for query distribution.

**NFR-SCALE-003:** System shall handle 10x current load with infrastructure scaling.

**NFR-SCALE-004:** Modular architecture shall allow transition to microservices without major rewrites.

---

### 8.3 Security

**NFR-SEC-001:** All passwords shall be hashed using bcrypt with minimum 10 rounds.

**NFR-SEC-002:** JWT tokens shall expire (15min access, 7 days refresh).

**NFR-SEC-003:** All API endpoints except auth shall require authentication.

**NFR-SEC-004:** Role-based access control shall be enforced at endpoint level.

**NFR-SEC-005:** SQL injection prevention through parameterized queries (TypeORM).

**NFR-SEC-006:** XSS prevention through input validation and sanitization.

**NFR-SEC-007:** CORS shall be configured to allow only trusted origins.

**NFR-SEC-008:** Rate limiting shall prevent abuse (100 requests/minute per IP).

**NFR-SEC-009:** HTTPS/TLS shall be enforced in production.

**NFR-SEC-010:** Sensitive data (passwords, tokens) shall never be logged.

---

### 8.4 Reliability

**NFR-REL-001:** System uptime shall be 99.9% (max 43 minutes downtime/month).

**NFR-REL-002:** Database transactions shall ensure ACID properties.

**NFR-REL-003:** Failed transactions shall rollback completely without partial updates.

**NFR-REL-004:** System shall have automated health checks.

**NFR-REL-005:** Critical errors shall trigger alerts to operations team.

---

### 8.5 Maintainability

**NFR-MAINT-001:** Code shall follow NestJS best practices and conventions.

**NFR-MAINT-002:** All modules shall be loosely coupled with clear interfaces.

**NFR-MAINT-003:** Code coverage shall be minimum 70% for unit tests.

**NFR-MAINT-004:** API documentation shall be auto-generated (Swagger).

**NFR-MAINT-005:** Database migrations shall be versioned and reversible.

**NFR-MAINT-006:** Code shall use TypeScript strict mode.

---

### 8.6 Availability

**NFR-AVAIL-001:** System shall support zero-downtime deployments.

**NFR-AVAIL-002:** Database backups shall run daily with 30-day retention.

**NFR-AVAIL-003:** Disaster recovery plan shall restore service within 4 hours.

---

### 8.7 Usability (API)

**NFR-USE-001:** API shall follow REST conventions.

**NFR-USE-002:** Error messages shall be clear and actionable.

**NFR-USE-003:** API versioning shall prevent breaking changes.

**NFR-USE-004:** Response formats shall be consistent across endpoints.

**NFR-USE-005:** Pagination shall be consistent (page/limit parameters).

---

### 8.8 Compliance

**NFR-COMP-001:** GDPR compliance for European users (data export, deletion).

**NFR-COMP-002:** Audit logs for sensitive operations.

**NFR-COMP-003:** Data retention policies configurable per company.

---

## 9. Technical Architecture

### 9.1 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | NestJS | 10.x | Application framework |
| Language | TypeScript | 5.x | Type-safe development |
| Runtime | Node.js | 20.x | JavaScript runtime |
| Database | PostgreSQL | 14+ | Primary data store |
| ORM | TypeORM | 0.3.x | Database abstraction |
| Authentication | JWT | - | Token-based auth |
| Validation | class-validator | 0.14.x | Input validation |
| Password Hashing | bcrypt | 5.x | Password security |

---

### 9.2 Architecture Pattern

**Current:** Modular Monolithic Architecture

```
┌─────────────────────────────────────────┐
│          NestJS Application             │
├─────────────────────────────────────────┤
│  ┌───────────┐  ┌──────────┐           │
│  │   Core    │  │ Business │           │
│  │  Modules  │  │ Modules  │           │
│  ├───────────┤  ├──────────┤           │
│  │ • Auth    │  │ • Sales  │           │
│  │ • Users   │  │ • POS    │           │
│  │ • Company │  │ • Invntry│           │
│  └─────┬─────┘  └────┬─────┘           │
│        │             │                  │
│        └─────┬───────┘                  │
│              │                          │
│        ┌─────▼─────┐                   │
│        │  TypeORM  │                   │
│        └─────┬─────┘                   │
└──────────────┼──────────────────────────┘
               │
        ┌──────▼───────┐
        │  PostgreSQL  │
        └──────────────┘
```

**Future:** Microservices Architecture (Phase 3)

```
┌─────────────────────────────────────────┐
│           API Gateway                   │
└─────────────────────────────────────────┘
              │
    ┌─────────┼─────────────┬─────────────┐
    │         │             │             │
 ┌───▼───┐  ┌───▼───┐ ┌───▼───┐ ┌───▼────┐
 │ Core  │  │Business│ │  AI   │ │Analytics│
 │Service│  │Service │ │Service│ │Service  │
 └───────┘  └────────┘ └───────┘ └────────┘
```

---

### 9.3 Module Structure

#### Core Modules
- **Auth Module:** Authentication and authorization
- **Users Module:** User management
- **Companies Module:** Tenant management
- **Billing Module:** Subscription handling

#### Business Modules
- **Inventory Module:** Products and categories
- **Sales Module:** Sales and transactions
- **Payment Module:** Payment processing
- **POS Module:** Point of sale operations
- **Work Sessions Module:** Employee shift tracking
- **Customers Module:** Customer management

#### AI Modules
- **Chat Module:** AI conversations
- **Insights Module:** Business intelligence
- **N8N Module:** Workflow automation

#### Analytics Modules
- **Reports Module:** Report generation
- **Dashboards Module:** Real-time metrics

---

### 9.4 Database Schema

**Key Entities:**

```typescript
Company
├── id: string (PK)
├── name: string
├── email: string
├── phone: string
├── address: string
├── subscription: enum
├── isActive: boolean
└── timestamps

User
├── id: string (PK)
├── companyId: string (FK → Company)
├── email: string (unique)
├── password: string (hashed)
├── firstName: string
├── lastName: string
├── role: enum (OWNER, MANAGER, EMPLOYEE)
├── isActive: boolean
└── timestamps

Product
├── id: string (PK)
├── companyId: string (FK → Company)
├── name: string
├── description: string
├── price: decimal
├── stock: integer
├── sku: string (unique, optional)
├── barcode: string (unique, optional)
├── category: enum
├── imageUrl: string
└── timestamps

Sale
├── id: string (PK)
├── companyId: string (FK → Company)
├── userId: string (FK → User)
├── pointOfSaleId: string (FK → PointOfSale)
├── total: decimal
├── customerName: string (optional)
├── customerEmail: string (optional)
├── status: enum
└── timestamps

SaleDetail
├── id: string (PK)
├── saleId: string (FK → Sale)
├── productId: string (FK → Product)
├── quantity: integer
├── price: decimal
└── subtotal: decimal

Payment
├── id: string (PK)
├── saleId: string (FK → Sale)
├── method: enum
├── amount: decimal
├── reference: string
└── timestamp

PointOfSale
├── id: string (PK)
├── companyId: string (FK → Company)
├── name: string
├── location: string
├── isActive: boolean
└── timestamps

WorkSession
├── id: string (PK)
├── userId: string (FK → User)
├── pointOfSaleId: string (FK → PointOfSale)
├── startTime: timestamp
├── endTime: timestamp (nullable)
├── initialCash: decimal
├── finalCash: decimal (nullable)
├── expectedCash: decimal (calculated)
└── status: enum
```

---

### 9.5 API Design

**Base URL:** `https://api.nexoai.com/v1`

**Authentication:** Bearer Token (JWT)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "data": { },
  "message": "Success message