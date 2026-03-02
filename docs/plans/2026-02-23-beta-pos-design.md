# Diseño Beta - NexoAI POS

**Fecha:** 2026-02-23
**Versión:** 1.0
**Estado:** Aprobado para implementación

---

## Resumen Ejecutivo

Este documento define el alcance y diseño técnico de la versión beta de NexoAI POS - un sistema de punto de venta para negocios físicos con énfasis en simplicidad y velocidad de implementación.

### Principios Guía

1. **MVP enfocado**: Solo funcionalidad esencial para primera venta
2. **Sin dependencias externas críticas**: Las integraciones complejas esperan
3. **Escalable**: Arquitectura que permite agregar features post-beta
4. **Multi-tenant**: Cada empresa aislada desde el inicio

---

## Alcance de la Beta

### Incluido

| Módulo | Feature | Estado |
|--------|---------|--------|
| Auth | Login/registro JWT | ✅ Existente |
| Auth | Roles (OWNER/MANAGER/EMPLOYEE) | ✅ Existente |
| Productos | CRUD completo | ✅ Existente |
| Productos | Imágenes R2 | 🔄 Nuevo |
| Productos | Búsqueda rápida POS | 🔄 Nuevo |
| Ventas | Carrito + atomic transactions | ✅ Existente |
| Ventas | Métodos de pago manual | ✅ Existente |
| Ventas | Descuentos | ✅ Existente |
| POS | Sesiones de trabajo check-in/out | ✅ Existente |
| Dashboard | Ventas del día | 🔄 Nuevo |
| Dashboard | Totales por método de pago | 🔄 Nuevo |
| Clientes | Entidad mínima (opcional en venta) | 🔄 Nuevo |

### Excluido (Post-Beta)

| Feature | Motivo |
|---------|--------|
| Suscripciones SaaS automatizadas | Onboarding manual para beta rápida |
| Pasarela de pagos (MP/Stripe) | Registro manual de pagos suficiente |
| IA/Chat | Módulos existen como stubs |
| Reportes avanzados | Dashboard básico cubre necesidad inmediata |
| Fidelización/Cupones | No bloquea primera venta |
| Devoluciones | Proceso manual post MVP |

---

## Arquitectura

### Flujo de Venta POS

```
Empleado Autenticado
       ↓
POST /work-sessions/check-in (selecciona punto de venta)
       ↓
GET /products/pos-search?q=xxx (busca productos con stock en ese POS)
       ↓
POST /sales (crea venta con productos + método de pago)
       ↓
POST /work-sessions/check-out (cierra turno, ve resumen)
```

### Componentes del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend POS                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Backend                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │ Products │ │  Sales   │ │ WorkSessions │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Uploads  │ │Dashboard │ │ Customers│                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │PostgreSQL│   │Cloudflare│   │  Redis  │
   │(Entities)│   │   R2    │   │ (Cache) │
   └─────────┘   └─────────┘   └─────────┘
```

---

## Modelo de Datos

### Producto (Adiciones)

```typescript
Entity: Product
├── id: string (CUID2)
├── name: string
├── code: string (8-13 digits, único)
├── purchase_price: number
├── selling_price: number
├── stock: number
├── category: Category (relation)
├── company: Company (relation) ← ya existe
├── image_url: string | null ← NUEVO
├── created_at: Date
└── updated_at: Date
```

### Cliente (Mínimo)

```typescript
Entity: Customer
├── id: string (CUID2)
├── name: string
├── phone: string | null
├── email: string | null
├── company: Company (relation)
├── created_at: Date
└── updated_at: Date
```

### Venta (Existente - Sin cambios)

```typescript
Entity: Sale
├── sale_id: string
├── total_amount: number
├── discount: number | null
├── sale_date: Date
├── point_sale: PointSale (relation)
├── user: User (relation) ← quién creó la venta
├── work_session: WorkSession (relation) ← NUEVO
├── customer: Customer | null (relation) ← NUEVO
├── products: JSONB[] ← snapshot de productos
└── payments: Payment[] (relation)
```

---

## Endpoints Nuevos/Modificados

### 1. Búsqueda Rápida POS

```http
GET /products/pos-search?q={query}&point_sale_id={id}
```

**Query Params:**
- `q`: string (búsqueda por nombre o código de barras)
- `point_sale_id`: string (filtra por stock disponible en ese POS)
- `limit`: number (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "prod_xxx",
      "name": "Coca Cola 600ml",
      "code": "7501055300123",
      "selling_price": 18.50,
      "stock": 45,
      "image_url": "https://pub-xxx.r2.dev/comp_xxx/prod_xxx_123.jpg"
    }
  ],
  "total": 150
}
```

### 2. Upload Imagen Producto

```http
POST /uploads/product-image
Content-Type: multipart/form-data
```

**Body:**
- `file`: File (jpg, png, webp, max 5MB)
- `product_id`: string (opcional - si null, se genera nombre temporal)

**Response:**
```json
{
  "image_url": "https://pub-xxx.r2.dev/comp_xxx/temp_xxx_123456.jpg",
  "key": "comp_xxx/temp_xxx_123456.jpg"
}
```

**Nota:** Al actualizar el producto con el `image_url`, el campo queda asociado.

### 3. Dashboard Ventas

```http
GET /dashboard/today?point_sale_id={id}
```

**Response:**
```json
{
  "date": "2026-02-23",
  "point_sale_id": "pos_xxx",
  "summary": {
    "total_sales": 24,
    "total_amount": 4850.00,
    "average_ticket": 202.08
  },
  "by_payment_method": [
    { "method": "CASH", "count": 15, "amount": 2850.00 },
    { "method": "CARD", "count": 9, "amount": 2000.00 }
  ],
  "top_products": [
    { "product_name": "Coca Cola 600ml", "quantity": 32 }
  ]
}
```

### 4. Clientes (CRUD Mínimo)

```http
POST   /customers           # Crear cliente
GET    /customers           # Listar por company
GET    /customers/:id      # Obtener uno
PATCH  /customers/:id      # Actualizar
```

**Request (POST):**
```json
{
  "name": "Juan Pérez",
  "phone": "5512345678",
  "email": "juan@email.com"
}
```

### 5. Modificación Venta Existente

```http
POST /sales
```

**Request (adiciones opcionales):**
```json
{
  "point_sale_id": "pos_xxx",
  "customer_id": "cust_xxx",      // ← NUEVO, opcional
  "products": [...],
  "payments": [...],
  "discount": 50.00
}
```

---

## Configuración Cloudflare R2

### Variables de Entorno

```bash
# R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=nexoai-products
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### Estructura de Carpetas

```
bucket: nexoai-products
├── {company_id}/
│   ├── {product_id}_{timestamp}.jpg
│   └── temp_{uuid}_{timestamp}.jpg  # subidas sin product_id asignado
```

### Política de CORS (en R2)

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

**Nota:** Para producción, restringir `AllowedOrigins` al dominio del frontend.

---

## Flujos Detallados

### 1. Primera Venta (Empleado)

```
1. Empleado llega a su turno
2. Login con credenciales → Recibe JWT
3. POST /work-sessions/check-in
   - Selecciona punto de venta "Caja Principal"
   - Sistema crea sesión activa

4. Cliente llega con productos
5. Empleado busca en el POS:
   - GET /products/pos-search?q=coca
   - Ve foto + precio + stock

6. Agrega al carrito (frontend)
7. Confirma venta:
   - POST /sales
   - Valida stock disponible
   - Registra método de pago
   - Asocia a sesión de trabajo

8. Cierra turno:
   - POST /work-sessions/check-out
   - Ve resumen: ventas totales, efectivo, tarjeta
```

### 2. Configuración Inicial (Dueño)

```
1. Registro en plataforma
   - POST /auth/register
   - Crea company + user OWNER

2. Configura punto de venta
   - POST /point-sales
   - Agrega nombre, dirección

3. Agrega productos
   - POST /products
   - Opcional: POST /uploads/product-image
   - Actualiza product.image_url

4. Crea empleados
   - POST /users
   - Asigna rol EMPLOYEE
   - Asocia a company

5. Listo para vender
```

---

## Seguridad

### Guard Implementados

1. **AuthGuard** (ya existe): Valida JWT
2. **RolesGuard** (ya existe): Valida permisos jerárquicos
3. **CompanyGuard** (ya existe): Aísla datos por empresa

### Adiciones para Beta

4. **WorkSessionGuard**: Verifica que empleado tenga sesión activa al crear venta
   - Opcional para beta (puede agregarse después)
   - Alternativa: Frontend controla check-in obligatorio

---

## Tareas de Implementación

### Prioridad 1 (Bloquea Beta)

- [ ] Agregar `image_url` a entidad Product
- [ ] Crear módulo Uploads (R2 integration)
- [ ] Crear endpoint `GET /products/pos-search`
- [ ] Crear entidad Customer mínima
- [ ] Agregar relación Customer ↔ Sale
- [ ] Crear módulo Dashboard con endpoint `today`
- [ ] Frontend POS básico (fuera de scope de este doc)

### Prioridad 2 (Mejora UX)

- [ ] Validación de stock en tiempo real
- [ ] Optimización queries dashboard
- [ ] Cache Redis para productos frecuentes
- [ ] Batch upload de imágenes

### Post-Beta

- [ ] Integración MercadoPago suscripciones
- [ ] Webhook MP para pagos en POS
- [ ] Módulo de reportes avanzados
- [ ] Sistema de cupones/descuentos
- [ ] Devoluciones y notas de crédito

---

## Consideraciones Técnicas

### Rendimiento

- **Índices necesarios:**
  - `product.code` (búsqueda rápida POS)
  - `product.company_id + product.name` (búsqueda texto)
  - `sale.sale_date` (dashboard queries)
  - `sale.point_sale_id + sale_date` (dashboard por POS)

- **Paginación:**
  - Búsqueda POS: 20 items por request
  - Dashboard top products: 10 items

### Límites R2

- Tamaño máximo archivo: 5MB (validar antes de upload)
- Formatos permitidos: jpg, jpeg, png, webp
- Resolución recomendada: 800x800px (thumbnails responsabilidad del frontend)

---

## Próximos Pasos

1. **Implementar módulo de uploads R2**
2. **Modificar búsqueda de productos para POS**
3. **Crear entidad Customer y relación**
4. **Desarrollar dashboard básico**
5. **Testing de flujo completo**
6. **Deploy a staging**

---

## Decisiones Tomadas

| Decisión | Alternativa | Razón |
|----------|-------------|-------|
| R2 vs S3 | AWS S3 | Costo salida de datos menor |
| URLs públicas vs signed | Signed URLs | Simplicidad beta, migrable después |
| Pago manual vs MP | MP integrado | No bloquea lanzamiento |
| Suscripción post-beta | Integración desde inicio | Foco en core POS |
| Customer opcional | Cliente obligatorio | Agiliza venta rápida |

---

## Documentación Relacionada

- `AGENTS.md` - Configuración de agentes
- `PRD.md` - Producto completo (features futuros)
- Código fuente: `/src/business/`, `/src/core/`

---

**Autor:** Claude Code
**Revisión:** 2026-02-23
**Estado:** Listo para implementación
