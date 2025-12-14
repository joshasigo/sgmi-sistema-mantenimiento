# 🏭 SGMI Backend API

Backend del Sistema de Gestión de Mantenimiento Industrial desarrollado con Node.js, Express, TypeScript y Prisma.

## 🚀 Características

- ✅ Autenticación JWT con refresh tokens
- ✅ Sistema de roles y permisos
- ✅ **Modo DEMO** (usuarios demo sin base de datos)
- ✅ **Modo PRODUCCIÓN** (PostgreSQL con Prisma)
- ✅ CRUD completo de usuarios
- ✅ Middleware de permisos por rol
- ✅ Validación de datos
- ✅ Manejo de errores centralizado

## 📦 Instalación

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` y configura:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sgmi_db"
JWT_SECRET="tu_secreto_super_seguro"
PORT=3000
DEMO_MODE=true  # true para desarrollo, false para producción
```

### 3. Configurar base de datos

#### Opción A: PostgreSQL Local
```bash
# Instalar PostgreSQL si no lo tienes

# Crear base de datos
createdb sgmi_db

# Ejecutar migraciones
npm run prisma:migrate

# Poblar datos iniciales
npm run seed
```

#### Opción B: PostgreSQL en la nube (Supabase/Railway)
1. Crea una cuenta en [Supabase](https://supabase.com) o [Railway](https://railway.app)
2. Crea un proyecto PostgreSQL
3. Copia la cadena de conexión
4. Pégala en `DATABASE_URL` en tu `.env`
5. Ejecuta las migraciones:
```bash
npm run prisma:migrate
npm run seed
```

## 🎮 Uso

### Modo Desarrollo
```bash
npm run dev
```

El servidor estará en `http://localhost:3000`

### Modo Producción
```bash
npm run build
npm start
```

## 🎭 Modo DEMO vs PRODUCCIÓN

### Modo DEMO (DEMO_MODE=true)
- No requiere base de datos
- Usuarios demo predefinidos:
  - `admin@demo.com` / `admin123` (Administrador)
  - `supervisor@demo.com` / `super123` (Supervisor)
  - `tecnico@demo.com` / `tecnico123` (Técnico)
- Perfecto para desarrollo y pruebas
- Los tokens JWT funcionan igual

### Modo PRODUCCIÓN (DEMO_MODE=false)
- Requiere PostgreSQL configurado
- Usuarios en base de datos:
  - `admin@sgmi.com` / `password123` (Administrador)
  - `supervisor@sgmi.com` / `password123` (Supervisor)
  - `tecnico@sgmi.com` / `password123` (Técnico)
- Refresh tokens guardados en BD
- Historial de últimos accesos

## 📡 Endpoints Disponibles

### Autenticación
```http
POST   /api/auth/login           # Login (demo o real)
POST   /api/auth/register        # Registro de usuario
POST   /api/auth/refresh-token   # Refrescar token
POST   /api/auth/logout          # Cerrar sesión
GET    /api/auth/me              # Obtener usuario actual
```

### Usuarios (requiere autenticación)
```http
GET    /api/users                # Listar usuarios
GET    /api/users/:id            # Obtener usuario
POST   /api/users                # Crear usuario (Admin)
PUT    /api/users/:id            # Actualizar usuario
DELETE /api/users/:id            # Eliminar usuario (Admin)
GET    /api/users/roles          # Listar roles
```

### Otros (en construcción)
```http
GET    /api/ordenes              # Órdenes de trabajo
GET    /api/inventario           # Inventario
GET    /api/reportes/estadisticas # Estadísticas
```

## 🔐 Sistema de Permisos

### Roles Disponibles
| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total al sistema |
| **Supervisor** | Gestión de órdenes e inventario |
| **Técnico** | Crear/editar órdenes asignadas |
| **Visualizador** | Solo lectura |

### Ejemplo de Uso
```typescript
// Requiere permiso específico
router.post('/users', 
  authenticateToken, 
  requirePermission('usuarios', 'crear'),
  createUser
);

// Requiere rol específico
router.delete('/users/:id',
  authenticateToken,
  requireRole('Administrador'),
  deleteUser
);
```

## 🧪 Testing

### Probar el servidor
```bash
# Health check
curl http://localhost:3000/api/health

# Login con usuario demo
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@demo.com", "password": "admin123", "demoMode": true}'

# Login con usuario real (requiere BD)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sgmi.com", "password": "password123"}'
```

## 📂 Estructura del Proyecto

```
backend/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── config/
│   │   └── database.ts        # Configuración Prisma
│   ├── controllers/
│   │   ├── authController.ts  # Login, register, etc.
│   │   └── userController.ts  # CRUD usuarios
│   ├── middleware/
│   │   ├── authMiddleware.ts  # Verificar JWT
│   │   ├── roleMiddleware.ts  # Verificar permisos
│   │   └── errorHandler.ts    # Manejo de errores
│   ├── routes/
│   │   ├── auth.routes.ts     # Rutas de autenticación
│   │   ├── user.routes.ts     # Rutas de usuarios
│   │   └── ...
│   ├── seed.ts                # Datos iniciales
│   └── server.ts              # Servidor principal
├── .env.example
├── package.json
└── tsconfig.json
```

## 🔄 Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor en modo desarrollo

# Base de datos
npm run prisma:generate        # Generar cliente Prisma
npm run prisma:migrate         # Ejecutar migraciones
npm run prisma:studio          # Interfaz gráfica de BD
npm run seed                   # Poblar datos iniciales

# Producción
npm run build                  # Compilar TypeScript
npm start                      # Iniciar servidor compilado
```

## 🌐 Deployment

### Railway (Recomendado)
1. Crea cuenta en [Railway](https://railway.app)
2. Crea nuevo proyecto PostgreSQL
3. Crea nuevo servicio Node.js
4. Conecta tu repositorio GitHub
5. Agrega variables de entorno
6. Deploy automático

### Render
1. Crea cuenta en [Render](https://render.com)
2. Nuevo PostgreSQL database
3. Nuevo Web Service
4. Conecta repositorio
5. Build: `cd backend && npm install && npm run build`
6. Start: `cd backend && npm start`

## 📝 Notas

- **Seguridad**: Cambiar `JWT_SECRET` en producción
- **CORS**: Configurar `FRONTEND_URL` según tu dominio
- **PostgreSQL**: Versión mínima 12+
- **Node.js**: Versión mínima 18+

## 🐛 Troubleshooting

### Error: "DATABASE_URL not found"
```bash
# Asegúrate de tener el archivo .env
cp .env.example .env
# Edita .env y configura DATABASE_URL
```

### Error: "Cannot connect to database"
```bash
# Verifica que PostgreSQL esté corriendo
# Windows: Servicios > PostgreSQL
# Mac/Linux: sudo service postgresql status

# O usa DEMO_MODE=true para no requerir BD
```

### Error al ejecutar migraciones
```bash
# Resetea la base de datos
npx prisma migrate reset
npm run seed
```

## 📧 Soporte

Para problemas o preguntas, abre un issue en GitHub.

---

**Desarrollado con ❤️ para SGMI**
