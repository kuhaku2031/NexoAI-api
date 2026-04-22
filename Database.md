# Contexto: Módulo de Chat IA con SSE para NexoAI

## Stack técnico
- **Backend**: NestJS + TypeScript
- **Base de datos principal**: PostgreSQL + TypeORM
- **Base de datos de chat**: Firebase Firestore (ya configurado como módulo global en `src/database/firestore/`)
- **IA**: Claude API (Anthropic SDK)
- **Auth**: JWT ya implementado, guards `AuthGuard` y `RolesGuard` ya existen

---

## Lo que ya existe

### FirestoreService — métodos disponibles
```typescript
createConversation(companyId: string): Promise<string>
getConversations(companyId: string): Promise<any[]>
saveMessage(companyId, conversationId, { role, content }): Promise<void>
getMessages(companyId, conversationId): Promise<{ role, content }[]>
```

### JWT payload decodificado
```typescript
{
  company_id: string,
  email: string,
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE'
}
```

### Cómo se aplica el guard de auth
```typescript
@Auth(UserRole.EMPLOYEE) // EMPLOYEE es mínimo, MANAGER y OWNER también pasan
```

### Referencia de módulo existente
`sales.module.ts` tiene exactamente la misma estructura de `JwtModule` + `RolesGuard` que necesita el chat module. Usarlo como referencia directa.

---

## Lo que se necesita implementar

### Archivos a crear/reemplazar
```
src/ai/chat/
├── chat.controller.ts     ← reemplazar completamente
├── chat.service.ts        ← reemplazar completamente
├── chat.module.ts         ← actualizar imports
└── dto/
    └── create-chat.dto.ts ← reemplazar
```

---

### DTO de entrada
```typescript
// src/ai/chat/dto/create-chat.dto.ts
{
  message: string           // mensaje del usuario, requerido
  conversation_id?: string  // opcional, null si es conversación nueva
}
```

---

### Endpoints requeridos

| Método | Ruta | Descripción | Auth mínimo |
|--------|------|-------------|-------------|
| `POST` | `/ai/chat/stream` | Envía mensaje, recibe respuesta Claude via SSE | EMPLOYEE |
| `GET` | `/ai/chat/conversations` | Lista conversaciones del company del usuario | EMPLOYEE |
| `GET` | `/ai/chat/conversations/:id/messages` | Historial de mensajes de una conversación | EMPLOYEE |

---

### Lógica del endpoint principal POST /ai/chat/stream

```
1. Recibir { message, conversation_id? } del body
   Extraer company_id de req.user.company_id (JWT) — NUNCA del body

2. Si conversation_id viene en el body → usar esa conversación
   Si no viene → crear nueva con firestoreService.createConversation(companyId)

3. Obtener historial con firestoreService.getMessages(companyId, conversationId)

4. Construir system prompt con contexto del negocio:
   - Incluir company_id
   - Placeholder de datos por ahora (después se conectará a PostgreSQL)
   - Indicar que responda en español

5. Llamar a Claude API con streaming:
   - Modelo: claude-sonnet-4-20250514
   - max_tokens: 1024
   - Pasar historial como messages[]
   - Pasar system prompt

6. Por cada token que llega de Claude → enviar al cliente via SSE:
   data: { "token": "texto" }

7. Cuando el stream termina → DOS escrituras en Firestore (nunca por token):
   - saveMessage(companyId, conversationId, { role: 'user', content: message })
   - saveMessage(companyId, conversationId, { role: 'assistant', content: fullResponse })

8. Enviar señal de fin:
   data: { "done": true, "conversation_id": "conv_xxx" }
```

---

### Reglas técnicas del SSE en NestJS

- El decorator `@Sse()` convierte el endpoint en Server-Sent Events
- El return type debe ser `Observable<MessageEvent>`
- `Observable` viene de `rxjs`
- Claude streaming se hace con `anthropic.messages.stream()` iterado con `for await`
- La escritura a Firestore ocurre **una sola vez al final** del stream, nunca por token

---

### Dependencia a instalar
```bash
npm install @anthropic-ai/sdk
```

### Variable de entorno necesaria
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

---

## Lo que NO se implementa ahora
- Integración real de datos PostgreSQL en el system prompt (placeholder es suficiente)
- WebSockets (SSE cubre el caso de uso)
- N8N
- Tests
