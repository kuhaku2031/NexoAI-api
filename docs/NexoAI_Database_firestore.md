```markdown
# METADATA DEL DOCUMENTO
- [cite_start]**Institución:** FUNDACIÓN UNIVERSITARIA LOS LIBERTADORES [cite: 1]
- [cite_start]**Asignatura/Tema:** Bases de Datos No Estructuradas [cite: 2, 3]
- [cite_start]**Contexto:** en el contexto del proyecto NexoAI [cite: 4, 5]
- [cite_start]**Tipo de Proyecto:** Plataforma de Gestión Empresarial con Inteligencia Artificial [cite: 6]
- [cite_start]**Autor:** Juan Manuel Contreras Zapata [cite: 7, 8, 80]
- [cite_start]**Ubicación y Fecha:** Bogotá D.C., 2025 [cite: 9, 80]

---

# 1. CONTEXTO Y STACK TECNOLÓGICO
[cite_start]NexoAI es una plataforma de gestión empresarial diseñada para pequeñas y medianas empresas en Colombia y Latinoamérica[cite: 10]. [cite_start]Integra en una sola aplicación móvil un sistema POS (Punto de Venta), gestión de inventario, analytics en tiempo real y un asistente de inteligencia artificial basado en Claude AI[cite: 11].

[cite_start]A lo largo de su desarrollo, NexoAI ha adoptado un modelo de datos híbrido: datos estructurados (ventas, productos, usuarios) se persisten en PostgreSQL, mientras que los datos generados por la IA —conversaciones, insights, logs de actividad— presentan características propias de las bases de datos no estructuradas[cite: 12]. [cite_start]Este informe analiza cómo NexoAI utiliza y planifica el uso de bases de datos no estructuradas, qué tecnologías son las más adecuadas y cómo se integrarían con el stack actual (NestJS + React Native + Firebase Firestore)[cite: 13].

---

# 2. ESQUEMA RELACIONAL (POSTGRESQL)
[cite_start]El núcleo transaccional de NexoAI opera sobre PostgreSQL con TypeORM[cite: 14]. [cite_start]Para garantizar la integridad referencial, transacciones ACID y la capacidad de realizar analítica compleja en tiempo real, las entidades se definen bajo un esquema estrictamente normalizado[cite: 15]:

- [cite_start]**Usuarios (Users):** `user_id`, `email`, `password`, `role`, `company_id`[cite: 16].
- [cite_start]**Empresas (Company):** `company_id`, `company_name`, `business_type`, `city`, `country`[cite: 17].
- [cite_start]**Productos (Product):** `id`, `name`, `code`, `purchase_price`, `selling_price`, `stock`, `category`[cite: 18].
- [cite_start]**Ventas (Sale):** `sale_id`, `total_amount`, `discount`, `point_sale_id`, `sale_date`[cite: 19].
- **Detalle de Venta (SaleItem):** `id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `subtotal`. (Entidad crítica para analítica de productos) [cite_start][cite: 20].
- **Métodos de Pago (SalePayment):** `id`, `sale_id`, `payment_method`, `amount`. (Soporta pagos mixtos y conciliación bancaria) [cite_start][cite: 21].
- [cite_start]**Sesiones de trabajo (WorkSession):** `check_in`, `check_out`, `status`, `total_time`[cite: 22].

---

# 3. NATURALEZA DE LOS DATOS NO ESTRUCTURADOS EN NEXOAI
[cite_start]La integración de Claude AI en NexoAI genera tres tipos de datos que no encajan en el modelo relacional clásico[cite: 23]:

1. [cite_start]**Conversaciones del Chat IA:** Cada sesión de chat con el asistente es un hilo de mensajes con timestamps, roles (user/assistant), contexto de negocio y metadata variable[cite: 24, 25]. [cite_start]El esquema cambia según el tipo de consulta (ventas, inventario, tendencias)[cite: 26].
2. [cite_start]**Insights Generados por IA:** Los análisis automáticos que la IA genera sobre el negocio contienen texto libre, arrays de métricas, recomendaciones estructuradas de forma irregular y referencias a períodos de tiempo variables[cite: 27, 28].
3. [cite_start]**Logs de Auditoría y Actividad:** Registros de acciones de usuario, errores de sistema y eventos de la plataforma que varían en estructura según el tipo de evento[cite: 29, 30].

## 3.1. Implementación Temporal Actual (`jsonb`)
[cite_start]La necesidad de manejar datos no estructurados ya es visible en el código actual de NexoAI[cite: 31]. [cite_start]Dos entidades utilizan el tipo `jsonb` de PostgreSQL como solución temporal[cite: 32]:

[cite_start]**Entidad Sale (`sale.entity.ts`):** [cite: 33]
```typescript
[cite_start]@Column({ type: 'jsonb', default: () => "'[]'" }) [cite: 34]
product: any[]; [cite_start]// Snapshot del carrito [cite: 35]
```

[cite_start]**Entidad Payment (`payment.entity.ts`):** [cite: 36]
```typescript
[cite_start]@Column({ type: 'jsonb', default: () => "'[]'" }) [cite: 37]
paymentDetail: any[]; [cite_start]// Métodos de pago [cite: 38]
```
[cite_start]Aunque `jsonb` en PostgreSQL permite almacenar JSON, no es óptimo para consultas frecuentes sobre datos no estructurados a gran escala, ni para las características específicas del módulo de chat IA[cite: 39].

---

# 4. ARQUITECTURA MULTI-CLOUD HÍBRIDA
[cite_start]Para el ecosistema NexoAI, se implementa una arquitectura Multi-Cloud Híbrida que separa las responsabilidades de persistencia según la naturaleza del dato[cite: 40]:

| [cite_start]Componente [cite: 41] | [cite_start]Tecnología [cite: 42] | [cite_start]Responsabilidad [cite: 43] |
| :--- | :--- | :--- |
| [cite_start]**Núcleo Transaccional** [cite: 44] | [cite_start]PostgreSQL [cite: 45] | SSoT (Única fuente de verdad). [cite_start]Ventas, Inventario, Contabilidad. [cite: 46] |
| [cite_start]**Capa de Interacción IA** [cite: 47] | [cite_start]Firebase Firestore [cite: 48] | [cite_start]Gestión de estados de chat en tiempo real, alertas e insights efímeros. [cite: 49] |
| [cite_start]**Almacenamiento de Objetos** [cite: 50] | [cite_start]Cloudflare R2 [cite: 51] | [cite_start]Persistencia de activos binarios (imágenes de productos) y logs históricos. [cite: 52] |
| [cite_start]**Automatización** [cite: 53] [cite_start]| n8n [cite: 54] | [cite_start]Orquestación asíncrona de reportes y entrenamiento de modelos IA. [cite: 55] |

---

# 5. IMPLEMENTACIÓN Y ESQUEMA DE FIREBASE FIRESTORE
[cite_start]Firebase Firestore es la solución elegida para los módulos de interacción de NexoAI, bajo las siguientes premisas de optimización[cite: 56]:

- [cite_start]**Esquema flexible:** Adaptación inmediata a los cambios en el formato de mensajes y metadatos de Claude AI[cite: 57].
- [cite_start]**Persistencia de Estados:** Almacenamiento eficiente de sesiones activas y estados de chat efímeros[cite: 58].
- [cite_start]**Optimización de Costos y Tráfico:** Para proteger los límites de lectura/escritura (tier gratuito de 50K), NexoAI no utilizará Firestore para el streaming de tokens de la IA[cite: 59]. [cite_start]El flujo "palabra a palabra" se gestionará mediante Server-Sent Events (SSE) en NestJS, realizando una única escritura final en Firestore cuando la respuesta sea completada[cite: 60].
- [cite_start]**Aislamiento Multi-tenant:** Uso de subcolecciones por empresa con reglas de seguridad granulares[cite: 61]. [cite_start]Aislamiento multi-tenant nativo[cite: 62].

## 5.1. Estructura de Colecciones
- [cite_start]**Contenedor:** `/companies/{company_id}/` (Contenedor de sesiones de chat individuales)[cite: 63, 64].
- [cite_start]**Conversaciones:** `/companies/{company_id}/conversations/{conversation_id}`[cite: 65].
  - [cite_start]Metadata: `user_id`, `created_at`, `status`[cite: 66].
  - [cite_start]Cada interacción es un documento independiente, permitiendo hilos infinitos y consultas paginadas[cite: 67].
- [cite_start]**Mensajes:** `/companies/{company_id}/conversations/{conversation_id}/messages/{message_id}`[cite: 68].
  - Campos: `role`: 'user' | [cite_start]'assistant'[cite: 69].
  - [cite_start]Campos: `content`: string[cite: 70].
  - [cite_start]Campos: `timestamp`: serverTimestamp[cite: 71].
  - [cite_start]Campos: `tokens_used`: number[cite: 72].

---

# 6. CICLO DE VIDA DE DATOS Y MEMORIA SEMÁNTICA
[cite_start]Para optimizar el rendimiento y los costos en el contexto de las PYMES latinoamericanas, NexoAI implementa un ciclo de vida de datos inteligente[cite: 73]:

- [cite_start]**Imágenes de Productos:** Almacenamiento en Cloudflare R2 (compatible con S3)[cite: 74]. [cite_start]PostgreSQL solo persiste la URL pública, eliminando costos de transferencia de datos (egress)[cite: 75].
- [cite_start]**Memoria Semántica de Largo Plazo (pgvector):** En lugar de un archivado pasivo en archivos JSON, las conversaciones con antigüedad mayor a 30 días serán procesadas mediante modelos de embeddings y almacenadas en PostgreSQL utilizando la extensión pgvector[cite: 76].
- [cite_start]**Beneficio Estratégico:** Esta arquitectura permite que el asistente de IA realice búsquedas semánticas sobre el historial del negocio de meses anteriores, manteniendo la utilidad de los datos sin saturar la base de datos operativa de Firestore[cite: 77].

---

# 7. CONCLUSIÓN ARQUITECTÓNICA
[cite_start]La evolución de una estructura basada puramente en `jsonb` hacia una arquitectura híbrida con PostgreSQL (Relacional + Vectorial), Firebase (Persistencia de Interacción) y Cloudflare R2 (Objetos) posiciona a NexoAI como una plataforma de alto rendimiento[cite: 78]. [cite_start]Esta separación de responsabilidades garantiza que el rendimiento del punto de venta (POS) sea independiente de la carga computacional de la Inteligencia Artificial, asegurando estabilidad y fluidez para el usuario final[cite: 79].
```
