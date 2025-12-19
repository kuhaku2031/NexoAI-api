# NexoAI API 🚀

> Enterprise-grade Backend API for AI-powered Point of Sale and Business Management System

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Modules](#key-modules)
- [Security](#security)
- [Development](#development)

---

## 🎯 Overview

NexoAI API is a robust backend system built with NestJS that powers an intelligent business management platform. It provides comprehensive functionality for point-of-sale operations, inventory management, sales tracking, user authentication, and AI-powered insights.

The API follows **monolithic modular architecture** principles, ensuring scalability, maintainability, and clear separation of concerns.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Role-Based Access Control (RBAC) with 3 roles: Owner, Manager, Employee
- Secure password hashing using Bcrypt
- Custom Guards for route protection

### 📦 Inventory Management

- Product CRUD operations with category classification
- Real-time stock tracking and low-stock alerts
- Advanced search functionality
- Barcode/SKU support

### 💰 Point of Sale (POS)

- Complete sales transaction management
- Multiple payment methods support
- Atomic transactions ensuring data consistency
- Sales details tracking with product information

### 📊 Analytics & Reporting

- Sales reports and dashboards
- Inventory analytics
- Work session tracking for employees

### 🏢 Multi-tenant Architecture

- Company-based data isolation
- Multiple point-of-sale locations per company
- User management per company

### 🤖 AI Integration Ready

- N8N integration module for workflow automation
- Chat module for AI-powered interactions
- Insights generation system

---

## 🛠 Tech Stack

| Category                 | Technology                         |
| ------------------------ | ---------------------------------- |
| **Framework**      | NestJS 10.x                        |
| **Language**       | TypeScript 5.x                     |
| **Database**       | PostgreSQL 14+                     |
| **ORM**            | TypeORM 0.3.x                      |
| **Authentication** | JWT (jsonwebtoken)                 |
| **Validation**     | class-validator, class-transformer |
| **Security**       | Bcrypt, Helmet, CORS               |
| **Documentation**  | Swagger/OpenAPI (planned)          |

---

## 🏗 Architecture

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
│  │ • Billing │  │ • Payment│           │
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

### Layered Architecture

```
Controller Layer (HTTP)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (PostgreSQL)
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### Clone Repository

```bash
git clone https://github.com/yourusername/nexoai-api.git
cd nexoai-api
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Database Setup

1. Create PostgreSQL database:

```sql
CREATE DATABASE nexoai;
```

2. Run migrations (or let TypeORM sync):

```bash
npm run migration:run
```

### Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DATABASE_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=nexoai

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
```

---

## 🗄 Database Schema

### Core Entities

#### Users

```typescript
- user_id: string (PK)
- company_id: string (FK)
- email: string (unique)
- password: string (hashed)
- first_name: string
- last_name: string
- role: enum (OWNER, MANAGER, EMPLOYEE)
- is_active: boolean
- refresh_token: string
```

#### Company

```typescript
- company_id: string (PK)
- company_name: string
- business_type: string
- email: string
- phone_number: number
- address: string
```

#### Product

```typescript
- id: number (PK)
- name: string
- code: number (unique)
- purchase_price: decimal
- selling_price: decimal
- category_id: number (FK)
- stock: number
```

#### Sale

```typescript
- sale_id: number (PK)
- discount: decimal
- point_sale_id: number (FK)
- total_amount: decimal
- sale_date: timestamp
- product: jsonb (details array)
```

#### Payment

```typescript
- payment_id: number (PK)
- total_amount: decimal
- point_sale: number (FK)
- sale_id: number (FK)
- paymentDetail: jsonb
- payment_date: timestamp
```

[View complete schema](./src/database/schema.sql)

---

## 📡 API Documentation

### Authentication Endpoints

#### Register Company

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "owner_name": "John",
  "owner_lastname": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123",
  "company_name": "My Business",
  "business_type": "Retail",
  "phone_number": 1234567890,
  "address": "123 Main St",
  "city": "Bogotá",
  "country": "Colombia"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "email": "john@example.com",
    "role": "OWNER",
    "company_id": "COMP_XXX"
  }
}
```

### Products Endpoints

#### Create Product

```http
POST /api/v1/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop HP",
  "code": 1234567890,
  "purchase_price": 500.00,
  "selling_price": 750.00,
  "category": "Electronics",
  "stock": 10
}
```

#### Search Products

```http
POST /api/v1/products/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "search_term": "laptop"
}
```

### Sales Endpoints

#### Create Sale with Payment

```http
POST /api/v1/sales
Authorization: Bearer {token}
Content-Type: application/json

{
  "saleData": {
    "payment_method": "Cash",
    "discount": 0,
    "total_amount": 750.00,
    "point_sale": "Main Store",
    "product": [
      {
        "code": 1234567890,
        "quantity": 1,
        "selling_price": 750.00,
        "product": { "name": "Laptop HP" }
      }
    ]
  },
  "paymentData": {
    "total_amount": 750.00,
    "paymentDetail": [
      {
        "payment_method": "Cash",
        "total_amount": 750.00
      }
    ]
  }
}
```

---

## 📁 Project Structure

```
nexoai-api/
├── src/
│   ├── ai/                      # AI-related modules
│   │   ├── chat/               # Chat functionality
│   │   ├── insights/           # AI insights generation
│   │   └── n8n/                # N8N integration
│   │
│   ├── analytics/              # Analytics & reporting
│   │   ├── dashboards/
│   │   └── reports/
│   │
│   ├── business/               # Core business logic
│   │   ├── customers/         # Customer management
│   │   ├── inventory/         # Inventory & products
│   │   │   ├── categories/
│   │   │   └── products/
│   │   ├── payment/           # Payment processing
│   │   │   ├── payments/
│   │   │   ├── payments-details/
│   │   │   └── payments-methods/
│   │   ├── pos/               # Point of sale
│   │   ├── sale/              # Sales management
│   │   │   ├── sales/
│   │   │   └── sales-details/
│   │   └── work-sessions/     # Employee sessions
│   │
│   ├── common/                # Shared utilities
│   │   ├── decorators/       # Custom decorators
│   │   ├── enum/             # Enumerations
│   │   ├── filters/          # Exception filters
│   │   ├── guard/            # Auth & role guards
│   │   └── utils/            # Utility functions
│   │
│   ├── core/                  # Core application modules
│   │   ├── auth/             # Authentication
│   │   ├── billing/          # Subscription management
│   │   ├── companies/        # Company management
│   │   └── users/            # User management
│   │
│   ├── config/               # Configuration files
│   ├── database/             # Database schemas
│   ├── app.module.ts         # Root module
│   └── main.ts              # Entry point
│
├── .env                      # Environment variables
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔑 Key Modules

### 1. Authentication Module (`src/core/auth/`)

**Responsibilities:**

- User registration and login
- JWT token generation and validation
- Password hashing and comparison
- Refresh token management

**Key Files:**

- `auth.service.ts` - Authentication logic
- `auth.controller.ts` - Auth endpoints
- DTOs for login and registration

### 2. Sales Module (`src/business/sale/sales/`)

**Responsibilities:**

- Create sales transactions
- Manage sales details
- Integrate with payment module
- Handle inventory updates

**Key Feature - Atomic Transactions:**

```typescript
async createSale(createSaleWithPaymentDto) {
  return await this.saleRepository.manager.transaction(
    async (transactionalEntityManager) => {
      // 1. Create sale
      const sale = await transactionalEntityManager.save(Sale, saleData);
  
      // 2. Create sale details
      await transactionalEntityManager.save(SalesDetail, details);
  
      // 3. Create payment
      await transactionalEntityManager.save(Payment, paymentData);
  
      // All or nothing - ensures data consistency
    }
  );
}
```

### 3. Products Module (`src/business/inventory/products/`)

**Responsibilities:**

- CRUD operations for products
- Category management
- Stock tracking
- Search functionality

**Features:**

- Unique product codes
- Category relationships
- Price management (purchase & selling)
- Stock validation

### 4. Users Module (`src/core/users/`)

**Responsibilities:**

- User management
- Role assignment
- Company-user relationships
- Profile management

### 5. Guards (`src/common/guard/`)

**Auth Guard:**

- Validates JWT tokens
- Extracts user info from token
- Protects routes

**Roles Guard:**

- Hierarchical role validation
- OWNER > MANAGER > EMPLOYEE
- Permission-based access control

---

## 🔒 Security

### Implemented Security Measures

1. **Password Security**

   - Bcrypt hashing (10 rounds)
   - No plain text storage
   - Secure comparison
2. **JWT Strategy**

   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Token rotation on refresh
3. **Role-Based Access Control**

   - Hierarchical permissions
   - Guard-based route protection
   - Decorator-based authorization
4. **Input Validation**

   - class-validator decorators
   - DTO validation
   - Type safety with TypeScript
5. **Error Handling**

   - Global exception filter
   - No sensitive data in error responses
   - Proper HTTP status codes

### Planned Security Enhancements

- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Helmet middleware
- [ ] SQL injection prevention (using TypeORM parameterized queries)
- [ ] XSS protection

---

## 👨‍💻 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload

# Production
npm run build              # Build for production
npm run start:prod         # Run production build

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Generate coverage report

# Linting
npm run lint              # Lint code
npm run format            # Format with Prettier
```

### Code Style

- **ESLint** for code quality
- **Prettier** for formatting
- **TypeScript strict mode** enabled
- Follow NestJS best practices

### Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "feat: add new feature"`
3. Push branch: `git push origin feature/my-feature`
4. Create Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Testing
- `chore:` - Maintenance

---

## 🗺 Roadmap

### Phase 1: MVP ✅

- [X] Authentication system
- [X] Basic CRUD operations
- [X] Sales transaction flow
- [X] Payment processing
- [X] Role-based access

### Phase 2: Enhancement (In Progress)

- [ ] AI chat integration
- [ ] Advanced analytics
- [ ] N8N workflow automation
- [ ] Real-time notifications (WebSockets)
- [ ] API documentation (Swagger)

### Phase 3: Scale

- [ ] Caching (Redis)
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Monitoring & logging

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Juan Manuel Contreras Zapata**

- GitHub: [@juancontrerasz](https://github.com/juancontrerasz)
- LinkedIn: [Juan Contreras](https://linkedin.com/in/juancontrerasz)
- Portfolio: [Portfolio Web](https://your-portfolio.com)

---

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM for the excellent ORM
- The open-source community

---

## 📞 Support

For questions or support, please open an issue on GitHub or contact:

- Email: juanmanuelcontreraszapata33@gmail.com

---

<div align="center">
  <strong>Built with ❤️ using NestJS and TypeScript</strong>
</div><p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
