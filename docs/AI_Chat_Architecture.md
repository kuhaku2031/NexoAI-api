# Arquitectura del Chat IA - NexoAI

Documentación técnica sobre la implementación del módulo de chat con Firestore, seguridad, límites de mensajes y memoria semántica.

---

## 1. Resumen de Componentes

| Componente | Tecnología | Descripción |
|------------|-----------|-------------|
| Chat activo | Firebase Firestore | Almacena conversaciones y mensajes en tiempo real |
| Memoria semántica | PostgreSQL + pgvector | Embeddings para búsqueda de conversaciones antiguas |
| IA | Groq (Ollama para embeddings) | Procesamiento de mensajes |
| Automatización | NestJS Schedule | Jobs cron para archivado e insights |

---

## 2. Seguridad - Validación de Propiedad

### Problema
Un usuario podía acceder a conversaciones de otras empresas manipulando el `conversationId` en la URL.

### Solución
Se implementó validación cruzada en `FirestoreService` que verifica que la conversación pertenece a la company del usuario antes de cualquier operación.

### Métodos Agregados

```typescript
// Valida que la conversación pertenece a la company
async validateConversationOwner(companyId: string, conversationId: string): Promise<boolean>

// Guarda mensaje con validación
async saveMessageWithValidation(saveMessageFirestoreDto: SaveMessageFirestoreDto)

// Obtiene mensajes con validación
async getMessagesWithValidation(companyId: string, conversationId: string): Promise<FirestoreMessage[]>

// Cierra conversación con validación
async closeConversation(companyId: string, conversationId: string)
```

### Flujo de Seguridad

```
1. Usuario hace request con JWT token
2. AuthGuard extrae company_id del token
3. Endpoint recibe conversationId de la URL
4. FirestoreService.validateConversationOwner() consulta Firestore
5. Si la conversación existe y pertenece a la company → continua
6. Si no existe → NotFoundException
7. Si pertenece a otra company → ForbiddenException
```

---

## 3. Límite de Mensajes (10 mensajes)

### Problema
Sin límite, cargar todos los mensajes puede exceder el context window del modelo de IA.

### Solución
Nuevo método `getMessagesWithLimit()` que retorna los últimos 10 mensajes.

### Implementación

```typescript
async getMessagesWithLimit(
  companyId: string,
  conversationId: string,
  limit: number = 10,
): Promise<FirestoreMessage[]> {
  const snapshot = await this.db
    .collection('companies')
    .doc(companyId)
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  const messages = snapshot.docs.map((doc) => ({
    role: doc.data().role,
    content: doc.data().content,
    timestamp: doc.data().timestamp,
  }));

  return messages.reverse();
}
```

### Uso en el Controller

```typescript
// Chat Controller - Endpoint de streaming
const history = await this.firestoreService.getMessagesWithLimit(
  company_id,
  conversationId,
  10,  // Límite de 10 mensajes
);
```

---

## 4. Memoria Semántica (pgvector)

### Propósito
Permitir que el asistente de IA "recuerde" información de conversaciones de meses anteriores mediante búsqueda semántica.

### Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Firestore      │───▶│ Job (Cron)       │───▶│  PostgreSQL     │
│  (Chat activo)  │    │ (30 días)        │    │  (pgvector)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                      │
                                                      ▼
                                              ┌─────────────────┐
                                              │  Tabla:         │
                                              │  conversation   │
                                              │  _embeddings    │
                                              └─────────────────┘
```

### Entidad - ConversationEmbedding

```typescript
@Entity('conversation_embeddings')
export class ConversationEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column()
  conversation_id: string;

  @Column('text')
  content: string;

  @Column('float', { array: true, default: '{}' })
  embedding: number[];

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  summary: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
```

### EmbeddingsService

```typescript
// Genera embedding usando Ollama
async generateEmbedding(text: string): Promise<number[]>

// Almacena embedding en PostgreSQL
async storeEmbedding(data: {
  companyId: string;
  conversationId: string;
  content: string;
  userId?: string;
  summary?: string;
}): Promise<ConversationEmbedding>

// Búsqueda semántica por similitud
async semanticSearch(
  companyId: string,
  query: string,
  limit: number = 5,
): Promise<ConversationEmbedding[]>

// Archiva conversaciones mayores a 30 días
async archiveOldConversations(daysOld: number = 30): Promise<number>
```

### Configuración Requerida

1. **Habilitar extensión en PostgreSQL:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

2. **Ollama corriendo localmente:**
```bash
# Instalar modelo de embeddings
ollama pull nomic-embed-text

# Verificar que esté corriendo
ollama list
```

3. **Variables de entorno:**
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text
```

---

## 5. Jobs Cron

### ArchiveConversationsJob

- **Frecuencia**: Diariamente a las 3:00 AM
- **Función**: Archiva conversaciones mayores a 30 días
- **Proceso**:
  1. Busca conversaciones activas >30 días en Firestore
  2. Obtiene contenido completo de cada conversación
  3. Genera embedding usando Ollama
  4. Guarda en PostgreSQL (tabla `conversation_embeddings`)
  5. Cierra la conversación en Firestore (status: 'closed')

### GenerateInsightsJob

- **Frecuencia**: Diariamente a las 8:00 AM
- **Función**: Genera insights básicos para cada empresa
- **Proceso**:
  1. Itera sobre todas las empresas
  2. Identifica productos con stock bajo (<10 unidades)
  3. Cuenta ventas del día
  4. Genera logs de insights

---

## 6. Endpoints y Ejemplos

### Endpoints del Chat

#### 1. Crear Conversación

```http
POST /api/v1/chat/conversations
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "ok": true,
  "conversationId": "abc123xyz",
  "message": "Conversación creada en companies/company_123/conversations/abc123xyz"
}
```

#### 2. Listar Conversaciones

```http
GET /api/v1/chat/conversations
Authorization: Bearer <JWT>
```

**Response:**
```json
[
  {
    "id": "abc123xyz",
    "created_at": "2025-05-01T10:00:00Z",
    "status": "active"
  },
  {
    "id": "def456uvw",
    "created_at": "2025-04-28T15:30:00Z",
    "status": "closed"
  }
]
```

#### 3. Enviar Mensaje (Streaming SSE)

```http
POST /api/v1/chat/stream/:conversationId
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Request:**
```json
{
  "message": "Cuáles fueron mis ventas de hoy?"
}
```

**Response (SSE):**
```javascript
data: {"content": "Hoy "}
data: {"content": "has tenido "}
data: {"content": "25 ventas "}
data: {"content": "por un total de $1,250,000"}
data: {"done": true}
```

#### 4. Obtener Mensajes

```http
GET /api/v1/chat/conversations/:conversationId/messages
Authorization: Bearer <JWT>
```

**Response:**
```json
[
  {
    "role": "user",
    "content": "Cuáles fueron mis ventas de hoy?",
    "timestamp": "2025-05-03T10:00:00Z"
  },
  {
    "role": "assistant",
    "content": "Hoy has tenido 25 ventas por un total de $1,250,000",
    "timestamp": "2025-05-03T10:00:01Z"
  }
]
```

#### 5. Cerrar Conversación

```http
POST /api/v1/chat/close/:conversationId
Authorization: Bearer <JWT> (Solo OWNER o MANAGER)
```

**Response:**
```json
{
  "ok": true,
  "conversationId": "abc123xyz",
  "status": "closed"
}
```

---

## 7. Estructura de Datos en Firestore

```
companies/
└── {company_id}/
    └── conversations/
        └── {conversation_id}/
            ├── created_at: timestamp
            ├── status: "active" | "closed"
            ├── closed_at: timestamp (opcional)
            └── messages/
                └── {message_id}/
                    ├── role: "user" | "assistant"
                    ├── content: string
                    └── timestamp: serverTimestamp
```

---

## 8. Variables de Entorno

```env
# Firestore
FIREBASE_PROJECT_ID=abiding-set-401404
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...

# IA - Chat
AI_URL=https://api.groq.com/openai/v1/chat/completions
AI_KEY=gsk_...
AI_MODEL=llama-3.1-8b-instant

# IA - Embeddings (Ollama local)
OLLAMA_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text
```

---

## 9. Notas Importantes

1. **Seguridad**: Todos los endpoints de chat validan que la conversación pertenezca a la company del usuario autenticado.

2. **Límite de mensajes**: El historial enviado a la IA se limita a los últimos 10 mensajes para evitar exceder el context window.

3. **pgvector**: Requiere que la extensión `vector` esté habilitada en PostgreSQL y que Ollama esté corriendo con el modelo `nomic-embed-text`.

4. **Cron jobs**: Los jobs de archivado e insights están configurados pero requieren que la aplicación esté corriendo continuamente.

5. **SSE**: El endpoint de streaming usa Server-Sent Events para mostrar la respuesta de la IA en tiempo real.