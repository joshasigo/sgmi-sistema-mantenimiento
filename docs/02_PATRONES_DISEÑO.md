# 🎨 Patrones de Diseño - SGMI
## Sistema de Gestión de Mantenimiento Industrial

**Proyecto:** SGMI  
**Fecha:** Diciembre 2025

---

## 📋 Tabla de Contenido

1. [Singleton Pattern](#singleton-pattern)
2. [Factory Pattern](#factory-pattern)
3. [Observer Pattern](#observer-pattern)
4. [Repository Pattern](#repository-pattern)
5. [Middleware Pattern](#middleware-pattern)
6. [Service Layer Pattern](#service-layer-pattern)
7. [DTO Pattern](#dto-pattern)

---

## 1️⃣ Singleton Pattern

### Descripción
Garantiza que una clase tenga **una única instancia** y proporciona un punto de acceso global a ella.

### Implementación en SGMI

#### Prisma Client (Backend)
```typescript
// backend/src/config/database.ts

import { PrismaClient } from '@prisma/client';

// Singleton: Una sola instancia de Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Exportamos la única instancia
export default prisma;
```

**Uso en controladores:**
```typescript
// controllers/userController.ts
import prisma from '../config/database';

export const getUsers = async (req: Request, res: Response) => {
  // Siempre usa la misma instancia de Prisma
  const usuarios = await prisma.usuario.findMany();
  res.json({ users: usuarios });
};
```

#### Auth Store (Frontend)
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Singleton: Store único global
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      login: async (email, password) => {
        const response = await authService.login(email, password);
        set({ user: response.user, token: response.token });
      },
      
      logout: () => {
        set({ user: null, token: null });
      }
    }),
    { name: 'auth-storage' }
  )
);
```

### Ventajas
✅ **Única conexión a BD** - Evita conexiones múltiples  
✅ **Estado global consistente** - Un único punto de verdad  
✅ **Eficiencia de recursos** - No duplica instancias

---

## 2️⃣ Factory Pattern

### Descripción
Proporciona una interfaz para crear objetos sin especificar sus clases concretas.

### Implementación en SGMI

#### Service Factory (Frontend)
```typescript
// src/services/api.ts

import axios, { AxiosInstance } from 'axios';

// Factory para crear instancias de API
class ApiFactory {
  private static instance: AxiosInstance;
  
  static createApiClient(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Interceptor para agregar token
      this.instance.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });
    }
    
    return this.instance;
  }
}

export const api = ApiFactory.createApiClient();
```

#### Error Handler Factory (Backend)
```typescript
// backend/src/middleware/errorHandler.ts

// Factory para crear diferentes tipos de errores
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  // Factory methods
  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }
  
  static unauthorized(message: string): AppError {
    return new AppError(message, 401);
  }
  
  static forbidden(message: string): AppError {
    return new AppError(message, 403);
  }
  
  static notFound(message: string): AppError {
    return new AppError(message, 404);
  }
}

// Uso
throw AppError.unauthorized('Token inválido');
throw AppError.notFound('Usuario no encontrado');
```

### Ventajas
✅ **Encapsulación** - Lógica de creación centralizada  
✅ **Flexibilidad** - Fácil cambiar implementaciones  
✅ **Reutilización** - Código DRY

---

## 3️⃣ Observer Pattern

### Descripción
Define una dependencia uno-a-muchos donde cuando un objeto cambia de estado, todos sus dependientes son notificados.

### Implementación en SGMI

#### State Management con Zustand (Frontend)
```typescript
// src/store/authStore.ts

// Observable: El store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  
  // Los observers se suscriben automáticamente
  login: async (email, password) => {
    const response = await authService.login(email, password);
    
    // Notifica a todos los observers
    set({ 
      user: response.user, 
      token: response.token,
      isAuthenticated: true 
    });
  },
  
  logout: () => {
    // Notifica a todos los observers del cambio
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
```

**Componentes que observan:**
```typescript
// components/Header.tsx - Observer 1
function Header() {
  // Se suscribe al store
  const { user, logout } = useAuthStore();
  
  return (
    <div>
      <span>Bienvenido, {user?.nombre}</span>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

// components/Dashboard.tsx - Observer 2
function Dashboard() {
  // También se suscribe al mismo store
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Dashboard Content</div>;
}
```

#### Event Emitters (Backend)
```typescript
// backend/src/controllers/ordenesController.ts

import { EventEmitter } from 'events';

class OrdenEventEmitter extends EventEmitter {}
const ordenEvents = new OrdenEventEmitter();

// Observers (listeners)
ordenEvents.on('orden:created', (orden) => {
  console.log('📧 Enviando notificación de nueva orden:', orden.id);
  // Lógica para enviar email/notificación
});

ordenEvents.on('orden:completed', (orden) => {
  console.log('✅ Orden completada, generando reporte:', orden.id);
  // Lógica para generar reporte automático
});

// Observable (emite eventos)
export const createOrden = async (req: Request, res: Response) => {
  const orden = await prisma.ordenTrabajo.create({ data: req.body });
  
  // Notifica a los observers
  ordenEvents.emit('orden:created', orden);
  
  res.status(201).json({ orden });
};
```

### Ventajas
✅ **Desacoplamiento** - Componentes no dependen entre sí  
✅ **Reactividad** - Actualización automática de UI  
✅ **Extensibilidad** - Fácil agregar nuevos observers

---

## 4️⃣ Repository Pattern

### Descripción
Abstrae la capa de acceso a datos, proporcionando una interfaz para operaciones CRUD.

### Implementación en SGMI

#### User Repository (Backend)
```typescript
// backend/src/repositories/userRepository.ts

import prisma from '../config/database';
import { Usuario } from '@prisma/client';

export class UserRepository {
  // Método genérico para buscar usuarios
  async findMany(filters?: { search?: string; estado?: string; rolId?: number }) {
    const where: any = {};
    
    if (filters?.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    if (filters?.estado) {
      where.estado = filters.estado;
    }
    
    if (filters?.rolId) {
      where.rolId = filters.rolId;
    }
    
    return await prisma.usuario.findMany({
      where,
      include: { rol: true },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  async findById(id: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({
      where: { id },
      include: { rol: true }
    });
  }
  
  async findByEmail(email: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }
    });
  }
  
  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    return await prisma.usuario.create({
      data,
      include: { rol: true }
    });
  }
  
  async update(id: string, data: UpdateUsuarioDTO): Promise<Usuario> {
    return await prisma.usuario.update({
      where: { id },
      data,
      include: { rol: true }
    });
  }
  
  async delete(id: string): Promise<void> {
    await prisma.usuario.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
```

**Uso en controladores:**
```typescript
// controllers/userController.ts
import { userRepository } from '../repositories/userRepository';

export const getUsers = async (req: Request, res: Response) => {
  const { search, estado, rolId } = req.query;
  
  // Usa el repository en lugar de Prisma directamente
  const usuarios = await userRepository.findMany({ 
    search: search as string,
    estado: estado as string,
    rolId: rolId ? parseInt(rolId as string) : undefined
  });
  
  res.json({ users: usuarios });
};
```

### Ventajas
✅ **Abstracción** - Oculta detalles de implementación  
✅ **Testabilidad** - Fácil crear mocks  
✅ **Mantenibilidad** - Lógica de BD centralizada

---

## 5️⃣ Middleware Pattern (Chain of Responsibility)

### Descripción
Permite pasar solicitudes a través de una cadena de manejadores donde cada uno decide procesar o pasar al siguiente.

### Implementación en SGMI

#### Authentication & Authorization Chain
```typescript
// backend/src/routes/user.routes.ts

import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/roleMiddleware';
import { createUser } from '../controllers/userController';

const router = Router();

// Cadena de middleware
router.post('/',
  authenticateToken,                     // Handler 1: Valida JWT
  requirePermission('usuarios', 'crear'), // Handler 2: Verifica permisos
  createUser                              // Handler 3: Ejecuta lógica
);
```

**Implementación de cada handler:**
```typescript
// middleware/authMiddleware.ts
export const authenticateToken = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return next(new AppError('Token no proporcionado', 401));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next(); // Pasa al siguiente handler
  } catch (error) {
    return next(new AppError('Token inválido', 403));
  }
};

// middleware/roleMiddleware.ts
export const requirePermission = (modulo: string, accion: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const permisos = req.user?.permisos;
    
    if (!permisos || !permisos[modulo]?.[accion]) {
      return next(new AppError(`No tienes permiso para ${accion} en ${modulo}`, 403));
    }
    
    next(); // Pasa al siguiente handler
  };
};
```

### Ventajas
✅ **Separación de concerns** - Cada middleware una responsabilidad  
✅ **Reutilización** - Middleware composable  
✅ **Orden flexible** - Fácil reorganizar la cadena

---

## 6️⃣ Service Layer Pattern

### Descripción
Encapsula la lógica de negocio en servicios reutilizables.

### Implementación en SGMI

#### Auth Service (Frontend)
```typescript
// src/services/authService.ts

import { api } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: Usuario;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }
  
  async register(data: RegisterDTO): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response.data;
  }
  
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
  
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
}

export default new AuthService();
```

#### Orden Service (Frontend)
```typescript
// src/services/ordenService.ts

class OrdenService {
  async getOrdenes(filters?: OrdenFilters): Promise<OrdenTrabajo[]> {
    const response = await api.get('/ordenes', { params: filters });
    return response.data.ordenes;
  }
  
  async createOrden(data: CreateOrdenDTO): Promise<OrdenTrabajo> {
    const response = await api.post('/ordenes', data);
    return response.data.orden;
  }
  
  async updateOrden(id: string, data: UpdateOrdenDTO): Promise<OrdenTrabajo> {
    const response = await api.put(`/ordenes/${id}`, data);
    return response.data.orden;
  }
  
  async deleteOrden(id: string): Promise<void> {
    await api.delete(`/ordenes/${id}`);
  }
}

export default new OrdenService();
```

### Ventajas
✅ **Reutilización** - Lógica compartida entre componentes  
✅ **Testabilidad** - Fácil testear servicios aislados  
✅ **Mantenibilidad** - Un lugar para cambios de API

---

## 7️⃣ DTO Pattern (Data Transfer Object)

### Descripción
Define objetos para transferir datos entre capas sin lógica de negocio.

### Implementación en SGMI

#### Type Definitions
```typescript
// backend/src/types/dtos.ts

// DTO para crear usuario
export interface CreateUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  rolId: number;
  departamento?: string;
}

// DTO para actualizar usuario
export interface UpdateUsuarioDTO {
  nombre?: string;
  email?: string;
  rolId?: number;
  departamento?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
  password?: string;
}

// DTO para crear orden
export interface CreateOrdenDTO {
  equipo: string;
  tipo: 'PREVENTIVO' | 'CORRECTIVO' | 'PREDICTIVO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  descripcion?: string;
  tecnicoAsignadoId?: string;
}

// DTO para respuesta de orden
export interface OrdenResponseDTO {
  id: string;
  equipo: string;
  tipo: string;
  prioridad: string;
  estado: string;
  tecnicoAsignado?: {
    nombre: string;
    email: string;
  };
  creadoPor: {
    nombre: string;
  };
  createdAt: string;
}
```

**Uso en controladores:**
```typescript
// controllers/userController.ts
export const createUser = async (req: Request, res: Response) => {
  const dto: CreateUsuarioDTO = req.body;
  
  // Validación del DTO
  if (!dto.nombre || !dto.email || !dto.password || !dto.rolId) {
    return res.status(400).json({ 
      message: 'Campos requeridos: nombre, email, password, rolId' 
    });
  }
  
  const passwordHash = await bcrypt.hash(dto.password, 10);
  
  const usuario = await prisma.usuario.create({
    data: {
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
      rolId: dto.rolId,
      departamento: dto.departamento
    }
  });
  
  // Transformar a DTO de respuesta (sin password)
  const responseDTO = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    departamento: usuario.departamento
  };
  
  res.status(201).json({ usuario: responseDTO });
};
```

### Ventajas
✅ **Seguridad** - No expone datos sensibles  
✅ **Validación** - Estructura clara de datos  
✅ **Documentación** - Contratos de API claros

---

## 📊 Resumen de Patrones Utilizados

| Patrón | Ubicación | Propósito |
|--------|-----------|-----------|
| **Singleton** | `database.ts`, `authStore.ts` | Instancia única |
| **Factory** | `api.ts`, `errorHandler.ts` | Creación de objetos |
| **Observer** | `authStore.ts`, Zustand | Reactividad |
| **Repository** | `repositories/` | Abstracción de BD |
| **Middleware** | `middleware/` | Cadena de validación |
| **Service Layer** | `services/` | Lógica de negocio |
| **DTO** | Tipos TypeScript | Transferencia de datos |

---

## 🎯 Beneficios de los Patrones

1. **Código más limpio y organizado**
2. **Facilita el mantenimiento**
3. **Mejora la testabilidad**
4. **Reduce el acoplamiento**
5. **Aumenta la reutilización**
6. **Sigue principios SOLID**

---

**Documento elaborado por:** Equipo de Desarrollo SGMI  
**Última actualización:** Diciembre 2025
