# NexoAI Mobile - Diseño de Aplicación POS para PyMEs

## 1. Visión General

### 1.1 Propósito

NexoAI Mobile es una aplicación móvil integral diseñada para complementar el backend NestJS existente, ofreciendo una experiencia POS móvil y todo-en-uno para pequeñas y medianas empresas (PyMEs) y startups. La app combina gestión de ventas, inventario, clientes, finanzas, análisis con IA y chat conversacional en un diseño moderno, confiable y fácil de usar.

### 1.2 Objetivos de Diseño

- **Todo-en-uno pero organizado**: Toda la info del negocio en un solo lugar sin saturar
- **Chat con IA integrado**: Assistant conversacional para consultas del negocio
- **Gráficos claros**: Visualizaciones entendibles al instante
- **Datos financieros**: Lo que se ha vendido, ganancias, flujo de caja
- **Confiable**: Respuesta rápida y consistente
- **Glassmorphism Apple**: Elementos translúcidos inspirados en iOS/macOS
- **Flujos suaves**: Animaciones sutiles, tipografía clara

### 1.3 Pilares de Diseño

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXOAI MOBILE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🤖 IA        🏧 Confiable    ⚡ Rápida    🎨 Moderna     │
│  (chat)        (datos seguros) (resp instant) (glass)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitectura de Navegación

### 2.1 Estructura Propuesta: Side Menu + Bottom Bar

Para una app tan completa, propongo una combinación:

- **Side Menu (Drawer)**: Acceso rápido a todas las secciones principales
- **Bottom Tab Bar**: Acceso directo a las 4 secciones más usadas

```
┌─────────────────────────────────────────────────────────┐
│  ☰         NexoAI        👤 Juan        💰 $12,450     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    MAIN CONTENT                        │
│                    (varies by tab)                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│   🏠      💰      🤖      📊      ⚙️                   │
│  Inicio  Ventas  Chat     Analític Ajustes              │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Navegación Completa

```
Drawer Menu ( desde ☰ )
├── 🏠 Inicio (Home)
│   └── Accesos rápidos
├── 💰 Ventas (POS)
│   ├── Nueva venta
│   ├── Historial
│   └── Detalle de venta
├── 📦 Inventario
│   ├── Productos
│   ├── Categorías
│   └── Escáner
├── 👥 Clientes
│   ├── Lista
│   ├── Perfil
│   └── Nuevo cliente
├── 💵 Finanzas
│   ├── Resumen financiero
│   ├── Ingresos
│   ├── Gastos
│   └── Flujo de caja
├── 📊 Análisis (Gráficos)
│   ├── Ventas
│   ├── Productos top
│   └── Tendencias
├── 🤖 Chat IA
│   ├── Nueva conversación
│   └── Historial
├── ⚙️ Ajustes
│   ├── Perfil
│   ├── Empresa
│   ├── Suscripción
│   └── Cerrar sesión
└── 💡 Ayuda
```

### 2.3 Justificación de la Estructura

| Enfoque | Pros | Contras |
|---------|------|---------|
| **Solo Bottom Tabs** | Rápido acceso | +5 tabs = difíciles de tocar |
| **Solo Drawer** | Organizado | Menos accesible a funciones frecuentes |
| **Drawer + 4 Tabs** | Balance ideal | Requiere aprender el drawer |

---

## 2.4 Múltiples Puntos de Venta

### 2.4.1 Concepto

La app debe soportar múltiples puntos de venta (sucursales/locales), permitiendo:
- Cambiar rápidamente entre puntos de venta
- Ver datos filtrados por cada punto
- Asignar ventas a un punto específico
- Gestión de inventario por punto

### 2.4.2 Estructura de Datos por Punto

```
┌─────────────────────────────────────────────────────────┐
│               PUNTOS DE VENTA                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏪 Local Principal (Matriz)                          │
│     - Dirección: Av. Principal 123                       │
│     - Estado: Activo                                   │
│     - Inventario: propio                              │
│                                                         │
│  🏪 Sucursal Centro                                  │
│     - Dirección: Plaza Central 45                      │
│     - Estado: Activo                                   │
│     - Comparte inventario: Sí                         │
│                                                         │
│  🏪 Local Airport                                  │
│     - Dirección: Terminal Aero 2                        │
│     - Estado: Inactivo (cerrado)                      │
│     - Comparte inventario: No                            │
└─────────────────────────────────────────────────────────┘
```

### 2.4.3 Selector de Punto de Venta

```
┌─────────────────────────────────────────────────────┐
│  ◀ Seleccionar punto de venta                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Selecciona el local para esta sesión:               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Local Principal (Matriz)              │   │
│  │     Av. Principal 123                     │   │
│  │     ● Activo                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Sucursal Centro                    │   │
│  │     Plaza Central 45                      │   │
│  │     ○ Activo                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Local Airport                     │   │
│  │     Terminal Aero 2                        │   │
│  │     ○ Cerrado                            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ──Opciones──                                    │
│  [✓] Recordar mi selección                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │           Continuar                        │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 2.4.4 Cambio Rápido de Punto de Venta (Header)

```
┌─────────────────────────────────────────────────────┐
│  ☰   NexoAI         🏪 Principal ⌄    👤       │
├────────────────────────────────��────────────────────┤
│                                                     │
│  Al tocar el selector (abre Bottom Sheet):           │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Cambiar punto de venta              │   │
│  ├─────────────────────────────────────────────┤   │
│  │  🏪 Local Principal          ● (actual)  │   │
│  │     Av. Principal 123                  │   │
│  ├─────────────────────────────────────────────┤   │
│  │  🏪 Sucursal Centro              ○         │   │
│  │     Plaza Central 45                      │   │
│  ├─────────────────────────────────────────────┤   │
│  │  🏪 Local Airport             ○ (cerrado) │   │
│  │     Terminal Aero 2                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 + Gestionar puntos de venta       │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 2.4.5 Dashboard Filtrado por Punto

Cada pantalla muestra los datos relevantes al punto de venta seleccionado:

```
┌─────────────────────────────────────────────────────┐
│  ☰   NexoAI         🏪 Local Principal ⌄   👤       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Navbar muestra punto actual]                      │
│                                                     │
│  Dashboard de Local Principal:                      │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐                     │
│  │ $12,450   │  │   +15%    │                     │
│  │  Hoy      │  │ vs ayer   │                     │
│  └─────────────┘  └─────────────┘                     │
│  ┌─────────────┐  ┌─────────────┐                     │
│  │   145     │  │ $89,200  │                     │
│  │ Ventas    │  │ Mes      │                     │
│  └─────────────┘  └─────────────┘                     │
│                                                     │
│  ── Comparativa por punto (todos) ──                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ Local Principal   $12,450 (55%)  ████████│   │
│  ├────���─��──────────────────────────────────────┤   │
│  │ Sucursal Centro $5,200 (30%)   ████  │   │
│  ├─────────────────────────────────────────────┤   │
│  │ Local Airport  $2,150 (15%)   ██     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Ver consolidación] [Cambiar punto]               │
└─────────────────────────────────────────────────────┘
```

### 2.4.6 Inventario por Punto

```
┌─────────────────────────────────────────────────────┐
│  ☰          Inventario                   🏪 Cambiar│
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Inventario: Local Principal]                    │
│                                                     │
│  Ver por: [Punto selected ▼]  [Todos ▼]           │
│                                                     │
│  Stock en Local Principal:                          │
│                                                     │
│  🥐 Concha chocolate                             │
│  ┌─────────────────────────────────────────────┐   │
│  │ Stock: 45 │ Min: 10 │ Estado: OK │ █████  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  🥐 Concha neurilla                               │
│  ┌─────────────────────────────────────────────┐   │
│  │ Stock: 3  │ Min: 10 │ Estado: ⚠️ │ ██    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ── Ver en otros puntos ──                         │
│  ┌─────────────────────────────────────────────┐   │
│  │   Ver stock en Sucursal Centro              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ── Transferir ──                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │   ↔ Transferir entre puntos              │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 2.4.7 Transferencia de Inventario

```
┌─────────────────────────────────────────────────���─���─┐
│  ◀ Transferir inventario                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  De:                                               │
│  ┌─────────────── Local Principal ────────┐           │
│  └──────────────────────────────────────┘          │
│                                                     │
│  A:                                                 │
│  ┌─────────────── Sucursal Centro ──────┐             │
│  └────────────────────────────────────┘            │
│                                                     │
│  Producto:                                           │
│  ┌─────────────────────────────────────┐           │
│  │ 🥐 Concha chocolate (45 disponibles)│           │
│  └─────────────────────��───────────────┘           │
│                                                     │
│  Cantidad:                                          │
│  ┌─────────────────────────────────────┐           │
│  │         [-]  10  [+]              │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Nota:                                             │
│  ┌─────────────────────────────────────┐           │
│  │ Reposición de inventario           │           │
│  └─────────────────────────────────────┘           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │        ✓ Confirmar transferencia         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Resumen:                                          │
│  Local Principal: 45 → 35 (-10)                   │
│  Sucursal Centro: 23 → 33 (+10)                     │
└─────────────────────────────────────────────────────┘
```

### 2.4.8 Configuración de Puntos

```
┌─────────────────────────────────────────────────────┐
│  ◀ Puntos de venta                  [+ Nuevo]          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Local Principal (Matriz)              │   │
│  │     Av. Principal 123                     │   │
│  │     ● Activo              [✏️] [🗑️]      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Sucursal Centro                    │   │
│  │     Plaza Central 45                      │   │
│  │     ● Activo              [✏️] [🗑️]      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🏪 Local Airport                     │   │
│  │     Terminal Aero 2                        │   │
│  │     ○ Inactivo            [✏️]            │   │
│  └─────────────────���─���─────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.4.9 Editar Punto

```
┌─────────────────────────────────────────────────────┐
│  ◀ Editar punto de venta              Guardar          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Nombre del punto                                   │
│  ┌─────────────────────────────────────┐           │
│  │ Local Principal (Matriz)           │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Dirección                                         │
│  ┌─────────────────────────────────────┐           │
│  │ Av. Principal 123                   │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Estado                                             │
│  ┌─────────────────────────────────────┐           │
│  │  ● Activo                         │           │
│  │  ○ Inactivo (cerrado)              │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Inventario                                         │
│  ┌─────────────────────────────────────┐           │
│  │  ○ Inventario propio              │           │
│  │  ○ Comparte inventario (global)  │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Color distintivo                                    │
│  [🔵] [🟢] [🟠] [🟣] [⚫]                          │
│                                                     │
│  ── Configuración POS ──                            │
│  [✓] Impresión automática                          │
│  [✓] Notificaciones en tiempo real                │
│  [ ] Modal de selección al iniciar                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.4.10 Lógica de Filtrado por Punto

| Sección | Datos mostrados |
|---------|-----------------|
| Dashboard |-ventas del punto vs total |
| Ventas | Solo ventas del punto |
| Inventario | Stock del punto o consolidado |
| Clientes | Clientes atendidos en punto |
| Finanzas | Ingresos/gastos del punto |
| Análisis | Gráficos del punto o consolidación |

### 2.4.11 Consideraciones Técnicas

```typescript
// Estado global del punto seleccionado
const usePointOfSaleStore = create((set) => ({
  selectedPointId: 'local-principal',
  setSelectedPoint: (pointId) => set({ selectedPointId: pointId }),
}));

// Query con filtro por punto
const salesQuery = useQuery(['sales', pointId], () => 
  fetchSales({ pointId }), { enabled: !!pointId }
);

// Header dinámico
<Header>
  <PointSelector current={point.name} onChange={setPoint} />
</Header>
```

**Tabs seleccionados (uso frecuente)**:
1. 🏠 **Inicio** - Dashboard principal
2. 💰 **Ventas** - POS rápido
3. 🤖 **Chat IA** - Asistente conversacional
4. 📊 **Análisis** - Gráficos y métricas

---

## 3. Diseño Visual

### 3.1 Paleta de Colores

| Propósito | Color | Hex | Uso |
|----------|-------|-----|-----|
| Primario | Deep Indigo | `#4F46E5` | Botones, acentos principales |
| Primario Oscuro | Indigo | `#4338CA` | Estados activo |
| Secundario | Slate | `#64748B` | Texto secundario |
| Fondo | Off-White | `#F8FAFC` | Fondo general |
| Fondo Card | White | `#FFFFFF` | Tarjetas |
| Éxito | Emerald | `#10B981` | Ventas exitosas, positivo |
| Advertencia | Amber | `#F59E0B` | Alertas, stock bajo |
| Error | Rose | `#F43F5E` | Errores, negativo |
| IA | Violet | `#8B5CF6` | Chat y features de IA |
| Money | Green | `#22C55E` | Ingresos, ganancias |

### 3.2 Tipografía

| Elemento | Fuente | Tamaño | Peso |
|----------|--------|--------|------|
| Display | SF Pro Display | 34px | Bold |
| Title Large | SF Pro Display | 28px | Semibold |
| Title | SF Pro Display | 22px | Semibold |
| Headline | SF Pro Text | 17px | Semibold |
| Body | SF Pro Text | 17px | Regular |
| Callout | SF Pro Text | 16px | Regular |
| Subhead | SF Pro Text | 15px | Regular |
| Footnote | SF Pro Text | 13px | Regular |
| Caption | SF Pro Text | 12px | Regular |

### 3.3 Glassmorphism - Especificaciones Detalladas

#### 🎨 Glass Card Principal

```css
.glass-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
}
```

#### 🎨 Glass Card Oscuro (para modo oscuro)

```css
.glass-card-dark {
  background: rgba(30, 30, 30, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### 🎨 Glass Elevated (modals, sheets)

```css
.glass-elevated {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(200%);
  border-radius: 28px 28px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

#### 🎨 Gradient Header

```css
.header-gradient {
  background: linear-gradient(
    135deg,
    #4F46E5 0%,
    #7C3AED 50%,
    #8B5CF6 100%
  );
}
```

#### 🎨 Animated Gradient (para destacar)

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(
    -45deg,
    #4F46E5, #8B5CF6, #06B6D4, #4F46E5
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

### 3.4 Iconos y Elementos Visuales

```
SF Symbols / Lucide Icons 推荐:

🏠 home          💰 zap          🤖 robot       📊 bar-chart
📦 package       👥 users       💵 dollar-sign  ⚙️ settings
🔔 bell          🔍 search      ➕ plus       ✏️ edit
🗑️ trash         📤 share      📥 download   🖨️ printer
📷 camera       📷 scan       ✉️ mail       📱 phone
📅 calendar      ⏰ clock       ✅ check       ⚠️ alert
🔗 link          🔐 lock       👁️ eye        👁️ eye-off
📊 chart-line   📈 trending-up 📉 trending-down
💳 credit-card  📱 smartphone  🏪 store
```

### 3.5 Componentes UI Detallados

#### 🔘 Botón Principal (Primary Button)

```
┌─────────────────────────────────────────────┐
│                                             │
│              Continuar                       │
│                                             │
└─────────────────────────────────────────────┘

Specs:
- Height: 56px
- Border-radius: 16px
- Background: #4F46E5 (gradient opcional)
- Font: 17px, Semibold, White
- Shadow: 0 4px 16px rgba(79, 70, 229, 0.3)
- Press: scale(0.98), opacity(0.9)
- Loading: spinner center
- Disabled: opacity(0.5)
```

#### 🔘 Botón Secundario

```
┌─────────────────────────────────────────────┐
│                                             │
│              Cancelar                        │
│                                             │
└─────────────────────────────────────────────┘

Specs:
- Height: 56px
- Border-radius: 16px
- Background: rgba(0, 0, 0, 0.04)
- Border: 1px solid rgba(0, 0, 0, 0.1)
- Font: 17px, Semibold, #64748B
```

#### 🔘 Botón IA (Special)

```
┌─────────────────────────────────────────────┐
│                                             │
│        🤖    Preguntar a IA    🤖           │
│                                             │
└─────────────────────────────────────────────┘

Specs:
- Height: 56px
- Border-radius: 16px
- Background: linear-gradient(135deg, #8B5CF6, #A855F7)
- Font: 17px, Semibold, White
- Icon: robot animate(pulse)
```

#### 🃏 Metric Card

```
┌──────────────────────┐
│  Ventas de hoy        │
│                      │
│     $12,450          │
│                      │
│  ↑ 15% vs ayer      │
└──────────────────────┘

Specs:
- Width: (screen - 48px) / 2
- Height: auto (120px)
- Border-radius: 20px
- Background: glass card
- Value: 28px, Bold
- Label: 13px, Secondary
- Trend: 12px, Green/Red + icon
```

#### 📊 Mini Chart Card

```
┌──────────────────────┐
│  Esta semana        │
│            ┌─────┐  │
│            │█████│  │
│            │███ █│  │
│            │█ ███│  │
│            └─────┘  │
│       $89,200       │
└──────────────────────┘
```

---

## 4. Módulos Detallados

### 4.1 🏠 Dashboard (Inicio)

#### Pantalla Principal

```
┌─────────────────────────────────────────────────────┐
│  ☰          NexoAI                   💰 $1,250 👤 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │  💰 Ventas     │  │  📊 Análisis   │          │
│  │    $12,450     │  │    +23%        │          │
│  │    Hoy         │  │    esta sem    │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │  🧾 Tickets    │  │  👥 Clientes   │          │
│  │      145       │  │      +8 new     │          │
│  │    hoy         │  │    este mes   │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  ┌─────────────────────���───────────────────────┐   │
│  │            💵 Ganancias del mes             │   │
│  │                  $28,450                     │   │
│  │              ↑ 12% vs mes anterior          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─── Actividad reciente ───                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 💰 Venta #1234       $250.00      10:30  ✓ │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 👤 María García      cliente nuevo  10:15│   │
│  ├─────────────────────────────────────────────┤   │
│  │ ⚠️ Stock bajo: Concha         5 بقية    09:45│   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🤖 Insight IA: VentaFri ↑ 45%           09:00│   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          ➕ Nueva venta rápida              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Acciones Rápidas del Header

```
Header: [☰] [NexoAI] [Badge 2] [Saldo: $1,250] [👤]

Al tocar saldo → Panel rápido: ver breakdown
Al tocar notificaciones → Lista de alerts
Al tocar perfil → Quick actions
```

### 4.2 💰 Módulo de Ventas (POS)

#### 4.2.1 Nueva Venta

```
┌─────────────────────────────────────────────────────┐
│  ◀ Nueva venta                     🛒 3    $145.00 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🔍 Buscar producto o código de barras...   │   │
│  │                            📷 Escanear     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  💡 Voz: "Agrega 2 conchas"               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Categorías:  [Panadería] [Bebidas] [Todos] [Favoritos]│
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │   🥐      │ │   🥐      │ │   🥐      │     │
│  │  Concha   │ │ Concha    │ │  Cuerno   │     │
│  │ $25.00   │ │ neurilla │ │  grande   │     │
│  │ Stock:45 │ │ $20.00  │ │  $30.00   │     │
│  │  [+]     │ │ Stock:23│ │  Stock:12 │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐                     │
│  │   🍞      │ │   ☕      │                     │
│  │  Bolillo  │ │  Café    │                     │
│  │  $18.00  │ │  $15.00  │                     │
│  │ Stock:30  │ │ Stock:50  │                     │
│  └─────────────┘ └─────────────┘                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │   Ver carrito (3)         Subtotal: $145.00│   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 4.2.2 Carrito

```
┌─────────────────────────────────────────────────────┐
│  ◀ Carrito                         🗑️ Vaciar todo │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ┌────┐  Concha chocolate                    │   │
│  │ │🥐 │  $25.00 × 2                    │   │
│  │ └────┘              $50.00            │   │
│  │              [- 2 +]  [✏️ edit]        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ┌────┐  Cuerno grande                     │   │
│  │ │🥐 │  $30.00 × 1                    │   │
│  │ └────┘              $30.00            │   │
│  │              [- 1 +]  [✏️ edit]        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ┌────┐  Café americano                  │   │
│  │ │☕ │  $15.00 × 2                    │   │
│  │ └────┘              $30.00            │   │
│  │              [- 2 +]  [✏️ edit]        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  ┌─ Aplicar descuento ─────────┐           │   │
│  │  │ [%] Porcentaje  [$] Monto  │           │   │
│  │  └──────────────────────────┘│           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  └─ Agregar cliente ─────────────────┐     │   │
│  │  │ 👤  Buscar cliente...        [+] │     │   │
│  │  └──────────────────────────────┘│     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Subtotal:          $110.00                         │
│  Descuento:         -$0.00                         │
│  ─────────────────────────────────                 │
│  TOTAL:            $110.00 (incluye IVA)           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │         💳 Completar venta                │   │
│  │              $110.00                     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 4.2.3 Métodos de Pago

```
┌─────────────────────────────────────────────────────┐
│  ◀ Método de pago                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TOTAL: $110.00                                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  💵          Efectivo                     │   │
│  │                                   ○      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  💳          Débito / Crédito              │   │
│  │                                   ○      │   │
│  │        ──────────────────────               │   │
│  │        Terminal conectada                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📱          Transferencia (SINPE)        │   │
│  │                                   ○      │   │
│  │        ──────────────────────               │   │
│  │        📱 555-123-4567                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📋          Mixto (efectivo + tarjeta)    │   │
│  │                                   ○      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │         ✅ Completar venta                │   │
│  │              $110.00                     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 4.2.4 Venta Exitosa

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│              ✨  🎉  ¡Venta exitosa!  🎉  ✨     │
│                                                     │
│                   ╭─────────────╮                    │
│                   │     $      │                    │
│                   │   110.00   │                    │
│                   ╰─────────────╯                    │
│                                                     │
│            ─────────────────────────                │
│            Folio: #1234  •  10:30 AM              │
│            Local: Principal                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │        📧 Enviar ticket por WhatsApp        │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │        📧 Enviar ticket por email          │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │        🖨️ Imprimir ticket              │   │
│  └─────────────────────────────────────────────┘   │
│  ┌────────────────────────────��─��──────────────┐   │
│  │        ➕ Nueva venta                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 4.2.5 Historial de Ventas

```
┌─────────────────────────────────────────────────────┐
│  ☰          Historial          🔍 Buscar           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Filtrar: [Este mes ▼]  [Todas ▼]  [+Filtros]       │
│                                                     │
│  ▼ Hoy - Martes 12 de Marzo                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ #1234 │ $110.00 │ 💳 Débito │ 10:30 │  ✓   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ #1233 │ $250.00 │ 💵 Efectivo│ 09:15 │  ✓   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ #1232 │ $ 45.00 │ 📱 SINPE  │ 08:45 │  ✓   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ▼ Ayer - Lunes 11 de Marzo                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ #1231 │ $320.00 │ 💳 Débito │ 19:30 │  ✓   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ #1230 │ $ 95.00 │ 💵 Efectivo│ 18:00 │  ✓   │   │
│  ├─────────────────────────────────────────────┤   │
│  │ #1229 │ $180.00 │ 📱 SINPE  │ 14:20 │  ✓   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Total hoy: $405.00 (3 ventas)              [↓ 12%] │
└─────────────────────────────────────────────────────┘
```

### 4.3 🤖 Módulo de Chat IA

#### 4.3.1 Chat Principal

```
┌─────────────────────────────────────────────────────┐
│  ◀ Asistente IA                        📊 Insights│
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────���─���─────────────────────────────┐   │
│  │  🤖 NexoAI                              │   │
│  │                                           │   │
│  │  ¡Hola! Soy tu asistente IA.              │   │
│  │  Puedo ayudarte con:                      │   │
│  │  • Análisis de ventas                    │   │
│  │  • Recomendaciones de inventario         │   │
│  │  • Insights sobre tus clientes            │   │
│  │  • Pronósticos y tendencias               │   │
│  │                                           │   │
│  │  ¿Qué te gustaría saber?                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  👤 Tú                                10:32  │   │
│  │                                           │   │
│  │  ¿Cómo vão las ventas está semana?         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🤖 NexoAI                            10:32  │   │
│  │                                           │   │
│  │  📊 Tus ventas esta semana:               │   │
│  │                                           │   │
│  │  • Total: $8,450 (+23% vs semana ant)    │   │
│  │  • Tickets: 156 (+12 vs semana ant)       │   │
│  │  • Ticket promedio: $54.17              │   │
│  │                                           │   │
│  │  📈 Lo mejor:                            │   │
│  │  • Concha chocolate: 45% de ventas        │   │
│  │  • Jueves y viernes: días peak           │   │
│  │                                           │   │
│  │  💡 Sugerencia: Considera aumentar       │   │
│  │  stock de panes双 para el fin de sem     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  👤 Tú                                10:35  │   │
│  │                                           │   │
│  │  ¿Qué productos tengo que reponer?        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  🤖 NexoAI                            10:35  │   │
│  │                                           │   │
│  │  ⚠️ Productos con stock bajo (<10):       │   │
│  │                                           │   │
│  │  1. 🥐 Concha neurilla - Solo 3 unidades  │   │
│  │  2. 🥐 Cuerno grande - Solo 5 unidades   │   │
│  │  3. ☕ Cappuccino - Solo 8 unidades      │   │
│  │  4. 🥤 Refresco cola - Solo 12 uni     │   │
│  │                                           │   │
│  │  📦 Recomiendo reponer:                    │   │
│  │  • Concha neurilla: +50 unidades         │   │
│  │  • Cuerno grande: +30 unidades         │   │
│  │                                           │   │
│  │  [Crear orden de compra]                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  Escribe tu pregunta...         🤖 🎤 📷  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 4.3.2 Quick Actions (Sugerencias)

```
┌─────────────────────────────────────────────────────┐
│  💡 Preguntas sugeridas                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐ ┌──────────────┐               │
│  │ 📊 Ventas   │ │ 📦 Stock    │               │
│  │ del mes     │ │ bajo        │               │
│  └──────────────┘ └──────────────┘               │
│                                                     │
│  ┌──────────────┐ ┌──────────────┐               │
│  │ 👥 Clientes │ │ 📈 Predic- │               │
│  │ top        │ │ ciones     │               │
│  └──────────────┘ └──────────────┘               │
│                                                     │
│  ┌──────────────┐ ┌──────────────┐               │
│  │ 💵 Finanzas │ │ 📅 Qué día   │               │
│  │ del mes     │ │ peak?        │               │
│  └──────────────┘ └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

#### 4.3.3 Conversaciones Previas

```
┌─────────────────────────────────────────────────────┐
│  ◀ Mis conversaciones                     ➕ Nueva      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📊 Resumen de ventas semanal              │   │
│  │  Última: hace 2 días                       │   │
│  │  Preview: "Tus ventas esta semana..."     │   │
��  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📦 Productos a reponer                  │   │
│  │  Última: hace 3 días                     │   │
│  │  Preview: "Productos con stock bajo..."  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  👥 Clientes frecuentes                   │   │
│  │  Última: hace 1 semana                   │   │
│  │  Preview: "¿Quiénes son mis mejores..."   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  💵 Ganancias del mes                      │   │
│  │  Última: hace 1 semana                    │   │
│  │  Preview: "¿Cuál fue mi ganancia..."    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.4 📊 Módulo de Análisis (Gráficos)

#### 4.4.1 Dashboard de Análisis

```
┌─────────────────────────────────────────────────────┐
│  ☰          Análisis                 📅 Este mes │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Resumen General                                    │
│  ┌───────────────┐ ┌───────────────┐               │
│  │ $89,200      │ │   +23%       │               │
│  │ Ingresos    │ │  vs mes ant  │               │
│  └───────────────┘ └───────────────┘               │
│  ┌───────────────┐ ┌───────────────┐               │
│  │ $28,450      │ │    156       │               │
│  │ Ganancia    │ │  Tickets     │               │
│  └───────────────┘ └───────────────┘               │
│                                                     │
│  ──Ingresos por día──                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  📈  │        █                             │   │
│  │  ██ │       ███                            │   │
│  │  ██ │████  █████                           │   │
│  │  ██ │████ ██████                          │   │
│  │─────│─────│─────│─────│─────│─────│─────    │   │
│  │ L  │ M  │ X  │ J  │ V  │ S  │ D           │   │
│  │        ▓▓ $3,450 ▓▓ $5,200 ▓▓ $8,900     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ──Por método de pago──                            │
│  ┌─────────────────────────────────────────────┐   │
│  │  💵 Efectivo     ████████████░░░░  45%     │   │
│  │  💳 Débito      ████████░░░░░░░░  30%     │   │
│  │  📱 SINPE      █████░░░░░░░░░░░░  15%     │   │
│  │  💳 Crédito    ████░░░░░░░░░░░░░  10%     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ──Productos más vendidos──                       │
│  1. 🥐 Concha chocolate     345u    $8,625       │
│  2. 🥐 Concha neurilla      280u    $5,600       │
│  3. 🥐 Cuerno grande        198u    $5,940       │
│  4. ☕ Café americano       156u    $2,340       │
│                                                     │
│  ──Por categoría──                                │
│  Panadería    █████████████████████████░░  68%      │
│  Bebidas     ██████████░░░░░░░░░░░░░░░  32%      │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │        🤖 Ver análisis con IA             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 4.4.2 Gráficos de Tendencias

```
┌─────────────────────────────────────────────────────┐
│  ◀ Tendencias                    [Ventas ▼] [30D] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │     █████                                    │   │
│  │   █████     ███                             │   │
│  │ █████     █████   ███                        │   │
│  │█████████████████████████  ← Tendencia real   │   │
│  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │   │
│  │ ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │   │
│  │           Predicción IA                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Predicción próxima semana:                        │
│  ↑ 18% esperado ($10,500 approx)                   │
│                                                     │
│  ──Por hora del día──                              │
│  ┌─────────────────────────────────               │
│  │  6-9  │  9-12 │ 12-14 │ 14-18 │ 18-21 │       │
│  │  ██  │ ████ │ █████ │ ████  │  ██  │       │
│  │  12% │  28% │  35%  │  18%  │  7%   │       │
│  └─────────────────────────────────               │
│                                                     │
│  ──Comparativa──                                   │
│  Esta semana vs semana anterior: +23%             │
│  Esta semana vs mes anterior: +12%                 │
│  Esta semana vs mismo día mes ant: +8%             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.5 💵 Módulo de Finanzas

#### 4.5.1 Resumen Financiero

```
┌─────────────────────────────────────────────────────┐
│  ☰          Finanzas                  📅 Este mes │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           Situación financiera               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌───────────────┐ ┌───────────────┐               │
│  │  📈 $89,200 │ │  📉 $60,750 │               │
│  │  Ingresos   │ │  Gastos     │               │
│  └───────────────┘ └───────────────┘               │
│                                                     │
│  ═══════════════════════════════════               │
│  │   💵 Ganancia neta: $28,450 (31.9%)        │   │
│  ═══════════════════════════════════               │
│                                                     │
│  Flujo de caja disponible:                           │
│  ┌─────────────────────────────────────────────┐   │
│  │  💰 Cuenta principal              $45,320   │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  💰 Cuenta secundaria            $3,200   │   │
│  └──────────────────��─��────────────────────────┘   │
│                                                     │
│  ──Por categoría de gasto──                       │
│  ┌─────────────────────────────────────────────┐   │
│  │  🧾 Materia prima        ████████████ 45%  │   │
│  │  ⚡ Servicios (luz, agua) ██████░░░░ 20% │   │
│  │  👥 Nómina               █████░░░░░░ 25%  │   │
│  │  📦 Otros               ██░░░░░░░░░ 10%  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ──Próximos pagos──                               │
│  ┌─────────────────────────────────────────────┐   │
│  │  ⚡ Servicio luz        $2,500   15/03     │   │
│  ├─────────────────────────────────────────────┤   │
│  │  🏠 Alquiler         $8,000   20/03     │   │
│  ├─────────────────────────────────────────────┤   │
│  │  👥 Nómina           $15,000  25/03     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [+ Registrar ingreso]  [+ Registrar gasto]      │
└─────────────────────────────────────────────────────┘
```

#### 4.5.2 Detalle de Ingresos

```
┌─────────────────────────────────────────────────────┐
│  ◀ Ingresos                       [+ Nuevo]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Filtrar: [Este mes ▼]  [Todos ▼]  [$8,450 ↓ 12%]  │
│                                                     │
│ Hoy - Martes 12                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Venta #1234        $110.00    Débito      10:30│   │
│ ├─────────────────────────────────────────────┤   │
│ │ Venta #1233        $250.00  Efectivo      09:15│   │
│ ├─────────────────────────────────────────────┤   │
│ │ Venta #1232        $ 45.00    SINPE      08:45│   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│Lun 11                                               │
│ ┌─────────────────────────────────────────────┐   │
│ │ Venta #1231        $320.00    Débito      19:30│   │
│ ├─────────────────────────────────────────────┤   │
│ │ Venta #1230        $ 95.00  Efectivo      18:00│   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Total: $8,450.00                                    │
└─────────────────────────────────────────────────────┘
```

### 4.6 📦 Inventario

#### Lista de Productos

```
┌─────────────────────────────────────────────────────┐
│  ☰          Inventario               [+ Agregar]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔍 Buscar por nombre o código                      │
│                                                     │
│  Filtrar: [Todos ▼]  [Stock: Todos ▼]              │
│                                                     │
│ ──Panadería──                                       │
│ ┌─────────────────────────────────────────────┐     │
│ │ 🥐 Concha chocolate                    │     │
│ │ Code: 1001 │ Stock: 45 │ $25.00 │ ████  │     │
│ ├─────────────────────────────────────────────┤     │
│ │ 🥐 Concha neurilla                     │     │
│ │ Code: 1002 │ Stock: 3⚠️ │ $20.00 │ ██   │     │
│ ├─────────────────────────────────────────────┤     │
│ │ 🥐 Cuerno grande                      │     │
│ │ Code: 1003 │ Stock: 5⚠️ │ $30.00 │ ██   │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ──Bebidas──                                         │
│ ┌─────────────────────────────────────────────┐     │
│ │ ☕ Café americano                       │     │
│ │ Code: 2001 │ Stock: 50 │ $15.00 │ █████ │     │
│ ├─────────────────────────────────────────────┤     │
│ │ ☕ Cappuccino                           │     │
│ │ Code: 2002 │ Stock: 8⚠️ │ $25.00 │ ██   │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ──Leyenda:                                         │
│ ████ Stock ok (>20)  ██ Stock bajo (<10)           │
│ ⚠️ Requiere atención                                │
└─────────────────────────────────────────────────────┘
```

### 4.7 👥 Clientes

#### Lista de Clientes

```
┌─────────────────────────────────────────────────────┐
│  ☰          Clientes                 [+ Nuevo]      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔍 Buscar cliente...                               │
│                                                     │
│ ──Recientes──                                      │
│ ┌─────────────────────────────────────────────┐     │
│ │ 👤 María García                            │     │
│ │     ****7890 │ Útlima: hace 2 días        │     │
│ │     Total: $4,589 • 28 compras            │     │
│ ├─────────────────────────────────────────────┤     │
│ │ 👤 Carlos López                           │     │
│ │     ****3456 │ Útlima: hace 5 días        │     │
│ │     Total: $2,340 • 15 compras            │     │
│ └─────────────────────────────────────────────┘     │
│                                                     │
│ ──Todos (45 clientes)                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.8 ⚙️ Ajustes

```
┌─────────────────────────────────────────────────────┐
│  ☰          Ajustes                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│           👤                                      │
│        Juan Pérez                                 │
│        Owner • Premium                            │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🏪 Mi empresa                                    │
│  └ Panadería Don Juan        💳 Suscripción        │
│                                                     │
│  📍 Punto de venta                                 │
│  └ Local Principal        👥 Miembros (3)         │
│                                                     │
│  💳 Métodos de pago                               │
│  └ Efectivo, Débito, SINPE                        │
│                                                     │
│  🔔 Notificaciones                               │
│  │ ├─ Stock bajo              [●]              │   │
│  │ ├─ Nuevas ventas           [●]              │   │
│  │ └─ Insights IA             [○]              │   │
│                                                     │
│  🎨 Apariencia                                    │
│  │ ├─ Tema                      [Sistema ▼]    │   │
│  │ └─ Tamaño de texto          [Normal ▼]      │   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ❓ Ayuda y soporte                               │
│                                                     │
│  📄 Términos y privacidad                        │
│                                                     │
│  🚪 Cerrar sesión                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. Navegación por Drawer Completo

### 5.1 Estructura del Drawer

```
┌────────────────────────────────────────────────────┐
│  ═════════════════════════════════════════            │
│  │                                              │
│  │          👤 Juan Pérez                       │
│  │     Panadería Don Juan                        │
│  │        Premium Plan                         │
│  │                                              │
│  ═════════════════════════════════════════            │
│                                                     │
│  🏠 Inicio                                        │
│  💰 Ventas                                        │
│  📦 Inventario                                    │
│  👥 Clientes                                      │
│  💵 Finances                                      │
│  📊 Análisis                                      │
│  🤖 Chat IA                                      │
│                                                     │
│  ═════════════════════════════════════════            │
│                                                     │
│  ⚙️ Ajustes                                       │
│  ❓ Ayuda                                         │
│                                                     │
│  ═════════════════════════════════════════            │
│                                                     │
│  Plan: Premium • Vence: 15/04/2026              │
└────────────────────────────────────────────────────┘

Specs:
- Width: 280px (80% of screen, max 320px)
- Background: Glass card with heavy blur
- Header: User info + company
- Items: Icon(24px) + Label
- Active item: Background highlight
- Animation: Slide from left (300ms)
```

### 5.2 Header con Saldo

```
┌────────────────────────────────────────────────────┐
│  ☰   NexoAI        🔔(3)   💰$1,250    👤       │
└────────────────────────────────────────────────────┘

Al tocar saldo → Ver breakdown rápido
Al tocar 🔔 → Ver notifications full
Al tocar 👤 → Profile quick actions
```

---

## 6. Especificaciones Técnicas

### 6.1 Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | React Native 0.76+ |
| Language | TypeScript |
| State | Zustand |
| Navigation | React Navigation v7 (Drawer + Bottom Tabs) |
| HTTP | Axios + React Query |
| Animations | Reanimated 3 + Moti |
| Charts | Victory Native |
| UI | Tamagui (Expo) / React Native Skia |
| Storage | MMKV |
| Voice | Expo Speech |
| Icons | Phosphor Icons |

### 6.2 API Integration

```
Base: https://api.nexoai.com/api/v1

Auth:
- POST /auth/login
- POST /auth/refresh
- GET /auth/me

Sales:
- POST /sales
- GET /sales
- GET /sales/:id

Products:
- GET /products
- POST /products
- PUT /products/:id

Categories:
- GET /categories
- POST /categories

Customers:
- GET /customers
- POST /customers
- GET /customers/:id

Finance:
- GET /finance/summary
- GET /finance/incomes
- GET /finance/expenses

Analytics:
- GET /analytics/dashboard
- GET /analytics/sales
- GET /analytics/trends
- GET /analytics/top-products

AI:
- POST /ai/chat
- GET /ai/insights
```

### 6.3 Auth Flow

```
1. Splash screen
2. Check token in MMKV
3. If no token → Login screen
4. If token → Validate → Home
5. On token expire → Auto refresh
```

---

## 7. Animaciones y Micro-interacciones

### 7.1 Transiciones

| De | A | Animación |
|----|---|----------|
| Tab | Screen | Fade + slide up (300ms) |
| List | Detail | Shared element |
| Button | Card | Scale (spring) |
| Modal | Full | Slide up (physics) |
| Drawer | Content | Slide right (250ms) |

### 7.2 Micro-interacciones

- **Nueva venta**: +1 badge animation
- **Producto agregado**: Bounce effect
- **Venta exitosa**: Confetti + checkmark draw
- **Stock bajo**: Subtle pulse
- **Chat IA typing**: 3 dots bounce
- **Button press**: Scale 0.98
- **Card tap**: Lift + shadow increase

### 7.3 Skeleton Loading

```tsx
<Skeleton width={120} height={24} borderRadius={12} />
<Skeleton width="100%" height={80} borderRadius={16} />
```

---

## 8. Modo Oscuro (Opcional)

```css
/* Dark mode tokens */
--bg-primary: #0A0A0A
--bg-secondary: #1A1A1A
--bg-card: rgba(30, 30, 30, 0.8)
--text-primary: #FFFFFF
--text-secondary: #A1A1AA
--accent-primary: #6366F1
--accent-success: #22C55E
--accent-warning: #F59E0B
--accent-error: #F43F5E
```

---

## 9. Resumen de Funcionalidades

### Core POS
- [x] Nueva venta con escaneo
- [x] Carrito persistente
- [x] Múltiples métodos de pago
- [x] Historial de ventas
- [x] Tickets impresos/email/WhatsApp

### Inventario
- [x] CRUD productos
- [x] Control de stock
- [x] Alertas de stock bajo
- [x] Categorías

### Clientes
- [x] Registro de clientes
- [x] Historial de compras
- [x] Datos de contacto

### Finanzas
- [x] Resumen de ingresos
- [x] Registro de gastos
- [x] Flujo de caja
- [x] Ganancias neta

### Análisis
- [x] Gráficos de ventas
- [x] Tendencias
- [x] Productos top
- [x] Métodos de pago

### IA
- [x] Chat conversacional
- [x] Insights automáticos
- [x] Predicciones
- [x] Recomendaciones

### Diseño
- [x] Glassmorphism
- [x] Apple-like UI
- [x] Animaciones fluidas
- [x] Drawer + Tabs navigation

### Extras (futuro)
- [ ] Widgets (iOS/Android)
- [ ] Modo offline
- [ ] Multi-sucursal
- [ ] Integración con terminal
- [ ] WhatsApp Business API
- [ ] Programa de puntos
- [ ] Pedidos anticipados

---

## 10. Conclusión

Este diseño expandido incluye:

1. **Drawer + 4 Bottom Tabs** - Navegación balanceada
2. **Chat IA** - Asistente conversacional Integrado
3. **Módulo Financiero** - Ingresos, gastos, flujo de caja
4. **Análisis Gráfico** - Visualizaciones completas
5. **Glassmorphism avanzado** - Efectos translúcidos múltiples
6. **Flujos completos** - Todas las pantallas detalladas

La estructura permite que el usuario tenga acceso rápido a las funciones más usadas (home, ventas, chat IA, análisis) mientras mantiene otras secciones organizadas en el drawer (inventario, clientes, finanzas, ajustes).