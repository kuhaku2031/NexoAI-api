<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=NexoAI%20API&fontSize=50&fontAlignY=40" />
</p>

<h3 align="center">AI-Powered Multi-Tenant Business Management Platform</h3>
<p align="center">
  Real-time LLM chat · Vector embeddings · Automated AI insights · Multi-tenant SaaS
</p>

<p align="center">
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/></a>
  <img src="https://img.shields.io/badge/Llama_3-FF6B35?style=for-the-badge&logoColor=white"/>
  <img src="https://img.shields.io/badge/pgvector-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
</p>

---

## 🎯 Overview

NexoAI API is a production-grade backend for an AI-powered business management SaaS targeting Latin American SMBs. Built with NestJS and TypeScript, it integrates real LLM capabilities — not as a feature add-on, but as a core part of the system.

**This is not a demo.** The AI module runs streaming conversations with Llama 3, persists history in Firestore, stores conversation embeddings with pgvector for semantic search, and generates automated business insights via scheduled jobs.

---

## ✨ What's Actually Built

### 🤖 AI & LLM Integration

- **Real-time LLM streaming** via Server-Sent Events (SSE) connected to Llama 3 (8B) through OpenRouter
- Conversation history stored in **Firebase Firestore** with per-company data isolation and security validation
- Support for both **cloud models** (OpenRouter/Groq) and **local models** (Ollama) via the same interface
- **Vector embeddings** using `nomic-embed-text` via Ollama, stored in PostgreSQL with pgvector
- **Semantic search** across archived conversations using cosine similarity (`<->` operator)
- **Automated conversation archiving** — nightly cron job embeds and archives conversations older than 30 days

### 📊 Automated Business Insights

- Daily cron job (08:00) generates AI insights per company
- Detects **low stock products** (< 10 units) and generates alerts
- Tracks **daily sales KPIs** per point of sale
- Foundation for LLM-generated natural language summaries (in progress)

### 🔐 Security & Multi-tenancy

- **JWT access + refresh token rotation** with configurable expiration
- **Hierarchical RBAC**: Owner > Manager > Employee — each role unlocks a superset of the lower role's permissions
- Custom `@Auth()` decorator combining `AuthGuard` + `RolesGuard` in one line
- **Firestore conversation ownership validation** — every message operation validates the conversation belongs to the requesting company
- Global exception filter returning consistent error shapes

### 🏢 Business Modules

- **POS** — point-of-sale management with multi-location support per company
- **Inventory** — product CRUD with categories, barcode/SKU, stock tracking, paginated filtering
- **Sales** — atomic transactions across sale + sales details + payment + payment details in a single TypeORM transaction
- **Payments** — multiple payment methods per sale, split payment support
- **Work Sessions** — employee check-in/check-out with automatic session closure on new check-in
- **Customers** — customer management module

### 💳 Subscription & Billing

- Multi-tier subscription model: **Starter, Professional, Enterprise**
- Per-feature limits: max POS, max users, AI queries per month, API access, white-label, predictive analytics
- **Usage tracking** by type (AI queries, users, POS, API calls) with billing period management
- Subscription lifecycle: Trial → Active → Past Due → Canceled/Suspended

### 📁 File Storage

- **Cloudflare R2** (S3-compatible) for image upload, download, and metadata retrieval
- Content-type validation (JPEG, PNG, WebP, GIF)
- Public URL generation with folder-based organization

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    NexoAI API (NestJS)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Core    │  │ Business │  │    AI    │  │Analytics│  │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├────────┤  │
│  │ Auth     │  │ Sales    │  │ Chat     │  │Dashbrd │  │
│  │ Users    │  │ POS      │  │ Insights │  │Reports │  │
│  │ Companies│  │ Inventory│  │Embeddings│  └────────┘  │
│  │ Billing  │  │ Payments │  │ N8N      │              │
│  └──────────┘  │ Work Sess│  └────┬─────┘              │
│                └──────────┘       │                     │
└───────────────────────────────────┼─────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────┐
        │                           │                   │
   ┌────▼────┐              ┌───────▼──────┐    ┌──────▼──────┐
   │PostgreSQL│              │   Firestore  │    │  OpenRouter  │
   │+pgvector │              │(conversation │    │  (Llama 3)   │
   │(entities)│              │  history)    │    │  / Ollama    │
   └──────────┘              └──────────────┘    └─────────────┘
        │
   ┌────▼──────────┐
   │ Cloudflare R2 │
   │ (file storage)│
   └───────────────┘
```

### AI Chat Flow

```
Client
  │
  ▼
POST /api/v1/chat/stream/:conversationId
  │
  ├─ 1. Validate conversation ownership (Firestore)
  ├─ 2. Save user message → Firestore
  ├─ 3. Load last 10 messages as context
  ├─ 4. Stream request → OpenRouter (Llama 3)
  ├─ 5. Forward chunks to client via SSE in real time
  ├─ 6. Save full assistant response → Firestore
  └─ 7. Send { done: true }
```

### Embedding & Archiving Flow (Nightly Cron)

```
03:00 AM → ArchiveConversationsJob
  │
  ├─ 1. Query all active conversations older than 30 days
  ├─ 2. Extract full conversation content
  ├─ 3. Generate embedding via Ollama (nomic-embed-text)
  ├─ 4. Store ConversationEmbedding in PostgreSQL (pgvector)
  └─ 5. Close conversation in Firestore
```

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | NestJS 10.x | Modular backend architecture |
| **Language** | TypeScript 5.x | Type safety across the codebase |
| **Database** | PostgreSQL 14+ + pgvector | Relational data + vector embeddings |
| **ORM** | TypeORM 0.3.x | Entity management + query builder |
| **AI/LLM** | OpenRouter (Llama 3 8B) | LLM streaming chat |
| **Embeddings** | Ollama (nomic-embed-text) | Local embedding generation |
| **Realtime DB** | Firebase Firestore | Conversation history + real-time |
| **File Storage** | Cloudflare R2 | S3-compatible image storage |
| **Auth** | JWT (access + refresh) | Token-based authentication |
| **Validation** | class-validator + class-transformer | DTO validation pipeline |
| **Scheduler** | @nestjs/schedule | Cron jobs for insights + archiving |
| **Security** | Bcrypt + Guards | Password hashing + route protection |

---

## 📁 Project Structure

```
src/
├── ai/
│   ├── chat/               # LLM streaming chat (SSE + Firestore)
│   │   ├── ai.service.ts   # OpenRouter/Ollama streaming integration
│   │   └── chat.controller.ts
│   ├── embeddings/         # Vector embeddings + semantic search
│   │   ├── embeddings.service.ts
│   │   ├── entities/       # ConversationEmbedding (pgvector)
│   │   └── jobs/           # Nightly archive job
│   ├── firestore/          # Firebase Firestore service
│   ├── insights/           # AI insight generation + daily cron
│   └── n8n/                # Workflow automation (in progress)
│
├── analytics/
│   ├── dashboards/         # Dashboard endpoints
│   └── reports/            # Report generation
│
├── business/
│   ├── inventory/
│   │   ├── categories/     # Category CRUD
│   │   └── products/       # Product CRUD + filters + search
│   ├── payment/
│   │   ├── payments/       # Payment creation
│   │   ├── payments-details/
│   │   └── payments-methods/
│   ├── pos/                # Point of sale management
│   ├── sale/
│   │   ├── sales/          # Atomic sale + payment transactions
│   │   └── sales-details/
│   ├── customers/
│   └── work-sessions/      # Employee check-in / check-out
│
├── core/
│   ├── auth/               # JWT auth + refresh token rotation
│   ├── billing/
│   │   ├── suscription/    # Subscription lifecycle
│   │   ├── suscription-plans/   # Starter / Pro / Enterprise
│   │   └── suscription-usage/   # Per-feature usage tracking
│   ├── companies/          # Company management
│   └── users/              # User management + RBAC
│
├── common/
│   ├── decorators/         # @Auth(), @Roles()
│   ├── guard/              # AuthGuard, RolesGuard (hierarchical)
│   ├── filters/            # Global exception filter
│   └── utils/              # Date formatter, hash util, ID generator
│
├── integrations/
│   └── r2/                 # Cloudflare R2 file storage
│
└── config/                 # JWT config, R2 config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ with pgvector extension
- Firebase project (Firestore enabled)
- OpenRouter API key (or local Ollama)

### Install

```bash
git clone https://github.com/kuhaku2031/NexoAI-api.git
cd NexoAI-api
npm install
```

### Environment Variables

```env
# Database
DB_TYPE=postgres
DB_URL=postgresql://user:password@localhost:5432/nexoai

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=900        # 15 minutes in seconds
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=604800    # 7 days in seconds

# AI - LLM
AI_URL=https://openrouter.ai/api/v1/chat/completions
AI_KEY=your_openrouter_key
AI_MODEL=meta-llama/llama-3-8b-instruct

# AI - Embeddings (local Ollama)
OLLAMA_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
FIRESTORE_DB_NAME=(default)

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_key_id
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=your_bucket
R2_PUBLIC_URL=https://your-public-url.r2.dev

# Server
PORT=3001
```

### Run

```bash
# Development
npm run start:dev

# Production
npm run build && npm run start:prod
```

---

## 📡 Key API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register company + owner user |
| POST | `/api/v1/auth/login` | Login → access + refresh tokens |
| POST | `/api/v1/auth/refresh` | Rotate access token |

### AI Chat
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/chat/conversations` | Create conversation | Any |
| GET | `/api/v1/chat/conversations` | List conversations | Any |
| POST | `/api/v1/chat/stream/:id` | **LLM streaming chat (SSE)** | Any |
| GET | `/api/v1/chat/conversations/:id/messages` | Get message history | Any |

### Sales
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/sales` | Create sale + payment (atomic) | Employee+ |
| GET | `/api/v1/sales` | List sales | Employee+ |
| DELETE | `/api/v1/sales/:id` | Remove sale | Manager+ |

### Products
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/products` | List with filters + pagination | Any |
| POST | `/api/v1/products` | Create product | Any |
| POST | `/api/v1/products/search` | Search by name/code | Any |

---

## 🔒 Security Model

```
JWT Access Token (15 min)  ──▶  AuthGuard validates on every request
JWT Refresh Token (7 days) ──▶  POST /auth/refresh → new access token

Role Hierarchy:
  OWNER (3)   ──▶  full access
  MANAGER (2) ──▶  access to own + employee routes  
  EMPLOYEE (1)──▶  access to basic POS operations

Firestore Security:
  Every read/write validates conversation.company_id === req.user.company_id
  No cross-company data leakage possible
```

---

## 🗺 Roadmap

### ✅ Done
- [x] Multi-tenant auth with JWT + RBAC
- [x] Full POS, inventory, sales, payment modules
- [x] LLM streaming chat via SSE (Llama 3 / OpenRouter)
- [x] Firestore conversation persistence
- [x] Vector embeddings + semantic search (pgvector)
- [x] Automated cron jobs (insights + archiving)
- [x] Cloudflare R2 file storage
- [x] Multi-tier subscription billing model

### 🔄 In Progress
- [ ] Python microservice (FastAPI) for data analysis
- [ ] RAG pipeline — retrieval from pgvector into LLM context
- [ ] n8n workflow automation integration
- [ ] AI-generated natural language insights endpoint

### 📋 Planned
- [ ] Swagger/OpenAPI documentation
- [ ] Redis caching for analytics queries
- [ ] WebSocket notifications
- [ ] Docker + CI/CD pipeline

---

## 👤 Author

**Juan Manuel Contreras Zapata** — AI Engineer & Backend Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/juancontrerasz)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kuhaku2031)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:juanmanuelcontreraszapata33@gmail.com)

---

<div align="center">
  <strong>Built with NestJS · TypeScript · Llama 3 · pgvector · Firebase</strong>
</div>
