# 🔥 Postman Collection - NexoAI Chat API

## Configuración Inicial

### Variables de Entorno
```json
{
  "baseUrl": "http://localhost:3001/api/v1",
  "email": "admin@miempresa.com",
  "password": "Password123!"
}
```

---

## 1. 🔐 Autenticación

### 1.1 Registrar Usuario (Crear Company + Usuario)
```http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "admin@miempresa.com",
  "password": "Password123!",
  "owner_name": "Juan",
  "owner_lastname": "Pérez",
  "phone_number": "+1234567890"
}
```
**Expected Response (201):**
```json
{
  "user_id": "usr_...",
  "company_id": "comp_...",
  "email": "admin@miempresa.com",
  "first_name": "Juan",
  "role": "OWNER"
}
```

### 1.2 Login (Obtener Tokens)
```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "admin@miempresa.com",
  "password": "Password123!"
}
```
**Expected Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "company_id": "comp_abc123",
    "email": "admin@miempresa.com",
    "role": "OWNER",
    "first_name": "Juan",
    "last_name": "Pérez"
  }
}
```

> ⚠️ **COPIAR** `access_token` a la variable `accessToken`

---

## 2. 💬 Chat - Flujo Completo

### 2.1 Iniciar Chat (Crear Conversación + Primer Mensaje)
```http
POST {{baseUrl}}/chat/start
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "content": "Hola,muéstrame las ventas de hoy"
}
```
**Expected Response (201):**
```json
{
  "conversationId": "Abc123xyz..."
}
```

> ⚠️ **COPIAR** `conversationId` a la variable `conversationId`

### 2.2 Enviar Mensaje a Conversación Existente
```http
POST {{baseUrl}}/chat/conversations/{{conversationId}}/messages
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "content": "¿Cuáles fueron los productos más vendidos?"
}
```
**Expected Response (201):**
```json
{
  "conversationId": "Abc123xyz...",
  "userMessage": "¿Cuáles fueron los productos más vendidos?",
  "saved": true
}
```

### 2.3 Obtener Historial de Mensajes
```http
GET {{baseUrl}}/chat/conversations/{{conversationId}}/messages
Authorization: Bearer {{accessToken}}
```
**Expected Response (200):**
```json
[
  {
    "role": "user",
    "content": "Hola, muéstrame las ventas de hoy"
  },
  {
    "role": "assistant",
    "content": "Entendido. Hoy has tenido $1,250 en ventas."
  }
]
```

### 2.4 Listar Conversaciones
```http
GET {{baseUrl}}/chat/conversations
Authorization: Bearer {{accessToken}}
```
**Expected Response (200):**
```json
[
  {
    "id": "Abc123xyz...",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 2.5 Crear Nueva Conversación Vacía
```http
POST {{baseUrl}}/chat/conversations
Authorization: Bearer {{accessToken}}
```
**Expected Response (201):**
```json
{
  "conversationId": "NewConvId..."
}
```

### 2.6 Continuar Conversación
```http
POST {{baseUrl}}/chat/continue/{{conversationId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "content": "Dame más detalles de ese producto"
}
```
**Expected Response (201):**
```json
{
  "conversationId": "Abc123xyz...",
  "messages": [
    { "role": "user", "content": "Hola" },
    { "role": "user", "content": "Dame más detalles" }
  ]
}
```

### 2.7 Cerrar Conversación (Solo OWNER/MANAGER)
```http
POST {{baseUrl}}/chat/close/{{conversationId}}
Authorization: Bearer {{accessToken}}
```
**Expected Response (201):**
```json
{
  "conversationId": "Abc123xyz...",
  "status": "closed"
}
```

---

## 3. 🤖 AI - Service Account (Para IA Externa)

### 3.1 Generar Token para IA
```http
POST {{baseUrl}}/chat/service-account
Authorization: Bearer {{accessToken}}
```
**Expected Response (201):**
```json
{
  "service_account_token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "ai_assistant"
}
```

> ⚠️ **COPIAR** `service_account_token` a la variable `aiToken`

### 3.2 Streaming SSE (Respuesta de IA)
```http
POST {{baseUrl}}/chat/stream/{{conversationId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "conversationId": "{{conversationId}}",
  "message": "¿Cuál es el ingreso total del mes?"
}
```
**Nota:** Usar **Accept: text/event-stream** en headers para SSE real

**Expected Response (200):**
```
data: {"content": "Entendido. "}
data: {"content": "Déjame analizar "}
data: {"content": "tus datos... "}
data: {"done": true, "fullResponse": "..."}
```

---

## 4. 🧪 Casos de Error

### 4.1 Sin Token (401)
```http
POST {{baseUrl}}/chat/start
Content-Type: application/json

{ "content": "test" }
```
**Expected:** `401 Unauthorized`

### 4.2 Token Inválido (401)
```http
POST {{baseUrl}}/chat/start
Authorization: Bearer token_invalido
Content-Type: application/json

{ "content": "test" }
```
**Expected:** `401 Unauthorized`

### 4.3 Content Vacío (400)
```http
POST {{baseUrl}}/chat/start
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{}
```
**Expected:** `400 Bad Request` - "content should not be empty"

### 4.4 Content Muy Largo (>1000 chars) (400)
```http
POST {{baseUrl}}/chat/start
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "content": "a... (más de 1000 caracteres)"
}
```
**Expected:** `400 Bad Request`

---

## 5. 📱 Flujo Completo de Prueba

```
1. POST /auth/login              → obtener access_token
2. POST /chat/start             → crear conv + mensaje  → obtener conversationId
3. POST /chat/conversations/:id → enviar mensaje
4. GET /chat/conversations/:id  → ver historial
5. POST /chat/service-account  → obtener token para IA
6. POST /chat/stream/:id       → probar streaming
7. POST /chat/close/:id        → cerrar conversación
```

---

## 🗂️ Estructura Firestore Resultante

```text
companies/
  └── {company_id}/
      └── conversations/
          └── {conversationId}/
              ├── created_at: timestamp
              ├── status: "active" | "closed"
              └── messages/
                  └── {message_id}/
                      ├── role: "user" | "assistant"
                      ├── content: string
                      └── timestamp: timestamp
```