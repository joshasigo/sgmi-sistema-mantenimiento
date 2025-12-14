# 🏗️ Arquitectura del Software - SGMI
## Sistema de Gestión de Mantenimiento Industrial

**Proyecto:** SGMI - Sistema de Gestión de Mantenimiento Industrial  
**Versión:** 1.0.0  
**Fecha:** Diciembre 2025  
**Arquitectura:** Cliente-Servidor con Capas (Layered Architecture)

---

## 📋 Tabla de Contenido

1. [Visión General de la Arquitectura](#visión-general)
2. [Arquitectura de Capas](#arquitectura-de-capas)
3. [Patrón MVC en el Cliente](#patrón-mvc-cliente)
4. [Arquitectura del Backend](#arquitectura-backend)
5. [Comunicación Cliente-Servidor](#comunicación)
6. [Base de Datos](#base-de-datos)
7. [Diagrama de Arquitectura](#diagrama-arquitectura)

---

## 🎯 Visión General de la Arquitectura

El SGMI implementa una **arquitectura de tres capas** (Three-Tier Architecture) combinada con el patrón **MVC** (Model-View-Controller) en el frontend, optimizada para aplicaciones web modernas.

### Características Principales:

- ✅ **Separación de Responsabilidades**: Cada capa tiene funciones específicas
- ✅ **Escalabilidad**: Permite crecimiento horizontal y vertical
- ✅ **Mantenibilidad**: Código organizado y fácil de mantener
- ✅ **Testabilidad**: Capas independientes facilitan las pruebas
- ✅ **Seguridad**: Múltiples niveles de validación y autenticación

---

## 🏛️ Arquitectura de Capas

### Capa 1: Presentación (Frontend)
**Tecnologías:** React 18.3.1 + TypeScript + Vite

```
📁 src/
├── 📁 components/        # Componentes React (Vista)
│   ├── Dashboard.tsx
│   ├── LoginPage.tsx
│   ├── OrdenesTrabajoSection.tsx
│   ├── UsuariosSection.tsx
│   ├── InventarioSection.tsx
│   ├── ReportesSection.tsx
│   └── ui/               # Componentes reutilizables
├── 📁 services/          # Capa de Servicios (Controlador)
│   ├── api.ts
│   ├── authService.ts
│   ├── ordenService.ts
│   ├── userService.ts
│   └── reporteService.ts
├── 📁 store/             # Estado Global (Modelo)
│   └── authStore.ts      # Zustand store
└── 📁 styles/            # Estilos globales
```

**Responsabilidades:**
- Renderizado de interfaz de usuario
- Gestión del estado local y global
- Validación de entrada del usuario
- Comunicación con la API mediante servicios

### Capa 2: Lógica de Negocio (Backend API)
**Tecnologías:** Node.js + Express + TypeScript

```
📁 backend/src/
├── 📁 controllers/       # Controladores (Lógica de Negocio)
│   ├── authController.ts
│   ├── ordenesController.ts
│   ├── userController.ts
│   ├── inventarioController.ts
│   ├── reportesController.ts
│   └── dashboardController.ts
├── 📁 routes/            # Rutas de API (Enrutamiento)
│   ├── auth.routes.ts
│   ├── orden.routes.ts
│   ├── user.routes.ts
│   └── inventario.routes.ts
├── 📁 middleware/        # Middleware (Validación y Seguridad)
│   ├── authMiddleware.ts
│   ├── roleMiddleware.ts
│   └── errorHandler.ts
├── 📁 config/            # Configuración
│   └── database.ts       # Prisma Client
└── server.ts             # Punto de entrada
```

**Responsabilidades:**
- Procesamiento de solicitudes HTTP
- Validación y autorización
- Ejecución de lógica de negocio
- Comunicación con la base de datos

### Capa 3: Persistencia de Datos
**Tecnologías:** PostgreSQL + Prisma ORM

```
📁 backend/prisma/
├── schema.prisma         # Definición del esquema
├── migrations/           # Historial de migraciones
└── seed.ts              # Datos iniciales
```

**Responsabilidades:**
- Almacenamiento persistente de datos
- Integridad referencial
- Optimización de consultas
- Backup y recuperación

---

## 🎨 Patrón MVC en el Cliente

### Model (Modelo)
**Ubicación:** `src/store/` y `src/services/`

```typescript
// store/authStore.ts - Estado Global
interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (modulo: string, accion: string) => boolean;
}
```

**Responsabilidad:** Gestión del estado de la aplicación

### View (Vista)
**Ubicación:** `src/components/`

```typescript
// components/Dashboard.tsx
export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {activeSection === 'ordenes' && <OrdenesTrabajoSection />}
        {activeSection === 'usuarios' && <UsuariosSection />}
        {/* ... más secciones */}
      </main>
    </div>
  );
}
```

**Responsabilidad:** Renderizado de la interfaz

### Controller (Controlador)
**Ubicación:** `src/services/`

```typescript
// services/ordenService.ts
class OrdenService {
  async getOrdenes(filters?: OrdenFilters): Promise<OrdenTrabajo[]> {
    const response = await api.get('/ordenes', { params: filters });
    return response.data.ordenes;
  }
  
  async createOrden(data: CreateOrdenDTO): Promise<OrdenTrabajo> {
    const response = await api.post('/ordenes', data);
    return response.data.orden;
  }
}
```

**Responsabilidad:** Intermediario entre Vista y Modelo

---

## ⚙️ Arquitectura del Backend

### Patrón de Capas Implementado

#### 1. Capa de Rutas (Routing Layer)
```typescript
// routes/orden.routes.ts
router.post('/', 
  authenticateToken,                    // Middleware de autenticación
  requirePermission('ordenes', 'crear'), // Middleware de autorización
  createOrden                            // Controlador
);
```

#### 2. Capa de Middleware (Middleware Layer)
```typescript
// middleware/authMiddleware.ts
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return next(new AppError('Token no proporcionado', 401));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Token inválido', 403));
  }
};
```

#### 3. Capa de Controladores (Controller Layer)
```typescript
// controllers/ordenesController.ts
export const createOrden = async (req: Request, res: Response) => {
  const { equipo, tipo, prioridad, tecnicoAsignadoId } = req.body;
  
  // Validación
  if (!equipo || !tipo || !prioridad) {
    return res.status(400).json({ message: 'Campos requeridos faltantes' });
  }
  
  // Lógica de negocio
  const orden = await prisma.ordenTrabajo.create({
    data: { equipo, tipo, prioridad, tecnicoAsignadoId, creadoPorId: req.user.userId }
  });
  
  res.status(201).json({ orden });
};
```

#### 4. Capa de Acceso a Datos (Data Access Layer)
```typescript
// Prisma ORM maneja esta capa
const orden = await prisma.ordenTrabajo.findUnique({
  where: { id },
  include: {
    tecnicoAsignado: { select: { nombre: true, email: true } },
    creadoPor: { select: { nombre: true } }
  }
});
```

---

## 🔄 Comunicación Cliente-Servidor

### Flujo de una Solicitud HTTP

```
┌──────────────┐
│   Cliente    │
│   (React)    │
└──────┬───────┘
       │ 1. Evento Usuario
       │ (ej. click en "Crear Orden")
       ↓
┌──────────────────────┐
│ Component            │
│ (OrdenesSection.tsx) │
└──────┬───────────────┘
       │ 2. Llama al servicio
       ↓
┌──────────────────┐
│ Service Layer    │
│ (ordenService)   │
└──────┬───────────┘
       │ 3. HTTP POST /api/ordenes
       │    Authorization: Bearer <token>
       │    Body: { equipo, tipo, prioridad }
       ↓
┌──────────────────────────────┐
│ Backend - Express Server     │
│ Puerto: 3000                 │
└──────┬───────────────────────┘
       │ 4. Middleware Chain
       ↓
┌──────────────────┐
│ authenticateToken│ ← Valida JWT
└──────┬───────────┘
       ↓
┌──────────────────┐
│ requirePermission│ ← Verifica permisos
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Controller       │ ← Procesa lógica
│ createOrden      │
└──────┬───────────┘
       │ 5. Consulta a BD
       ↓
┌──────────────────┐
│ Prisma ORM       │
└──────┬───────────┘
       │ 6. SQL Query
       ↓
┌──────────────────┐
│ PostgreSQL       │
│ (Neon)           │
└──────┬───────────┘
       │ 7. Resultado
       ↑
       │ 8. Response JSON
       │    Status: 201 Created
       │    Body: { orden: {...} }
       │
┌──────────────┐
│   Cliente    │ ← 9. Actualiza UI
└──────────────┘
```

### Protocolo de Comunicación

**Formato:** REST API con JSON  
**Autenticación:** JWT (JSON Web Tokens)  
**Puerto Backend:** 3000  
**Puerto Frontend:** 5173 (desarrollo)

**Headers Estándar:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

---

## 🗄️ Base de Datos

### Diagrama Entidad-Relación (Simplificado)

```
┌─────────────────┐
│      Rol        │
│─────────────────│
│ id (PK)         │
│ nombre          │
│ permisos (JSON) │
└────────┬────────┘
         │ 1:N
         ↓
┌─────────────────┐       ┌──────────────────┐
│    Usuario      │ 1:N   │  OrdenTrabajo    │
│─────────────────│───────│──────────────────│
│ id (PK)         │       │ id (PK)          │
│ nombre          │       │ equipo           │
│ email           │←─────┐│ tipo             │
│ rolId (FK)      │      1│ prioridad        │
│ departamento    │  N:1 ││ estado           │
└─────────────────┘       │ tecnicoAsignadoId│
                          │ creadoPorId (FK) │
                          └──────────────────┘
                                 │ 1:N
                                 ↓
                          ┌──────────────────┐
                          │    Novedad       │
                          │──────────────────│
                          │ id (PK)          │
                          │ ordenTrabajoId   │
                          │ impedimento      │
                          └──────────────────┘

┌──────────────────┐
│ ItemInventario   │
│──────────────────│
│ id (PK)          │
│ nombre           │
│ codigo           │
│ cantidad         │
│ stockMinimo      │
└──────────────────┘
```

### Tecnologías de Persistencia

**ORM:** Prisma  
**Base de Datos:** PostgreSQL (Neon Serverless)  
**Migraciones:** Prisma Migrate  
**Conexión:** Connection Pooling

---

## 📊 Diagrama de Arquitectura General

```
┌───────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                     │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Capa de Presentación                     │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │    │
│  │  │ Components │  │   Store    │  │  Services  │     │    │
│  │  │   (React)  │  │  (Zustand) │  │   (API)    │     │    │
│  │  └────────────┘  └────────────┘  └────────────┘     │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────┬──────────────────────────────────────┘
                         │ HTTP/HTTPS (REST API)
                         │ JSON
                         ↓
┌───────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Node.js + Express)                │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Capa de Aplicación                       │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │    │
│  │  │   Routes   │→ │ Middleware │→ │Controllers │     │    │
│  │  └────────────┘  └────────────┘  └────────────┘     │    │
│  └──────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │           Capa de Lógica de Negocio                   │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │    │
│  │  │Validación  │  │Autenticación│ │ Autorización│    │    │
│  │  └────────────┘  └────────────┘  └────────────┘     │    │
│  └──────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │          Capa de Acceso a Datos                       │    │
│  │  ┌────────────────────────────────────────────┐      │    │
│  │  │         Prisma ORM                         │      │    │
│  │  └────────────────────────────────────────────┘      │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────┬──────────────────────────────────────┘
                         │ SQL Queries
                         ↓
┌───────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                               │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              PostgreSQL (Neon)                        │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │    │
│  │  │Usuarios│ │Ordenes │ │Inventar│ │Reportes│        │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎯 Ventajas de Esta Arquitectura

### 1. **Separación de Responsabilidades**
- Frontend y Backend completamente desacoplados
- Facilita el trabajo en equipo
- Permite reutilización de código

### 2. **Escalabilidad**
- Frontend puede desplegarse en CDN
- Backend puede escalar horizontalmente
- Base de datos serverless auto-escalable

### 3. **Mantenibilidad**
- Código organizado por capas
- Fácil localización de errores
- Actualizaciones independientes

### 4. **Seguridad**
- Múltiples capas de validación
- Autenticación centralizada
- Autorización basada en roles

### 5. **Testabilidad**
- Cada capa puede probarse independientemente
- Mocking simplificado
- Pruebas de integración facilitadas

---

## 📚 Referencias

- [React Architecture Best Practices](https://react.dev/learn/thinking-in-react)
- [Express.js Layered Architecture](https://expressjs.com/en/guide/routing.html)
- [Prisma Architecture](https://www.prisma.io/docs/concepts/overview/what-is-prisma)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Documento elaborado por:** Equipo de Desarrollo SGMI  
**Última actualización:** Diciembre 2025
