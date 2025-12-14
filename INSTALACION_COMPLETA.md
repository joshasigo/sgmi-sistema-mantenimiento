# 🚀 Guía de Instalación Completa - SGMI con Base de Datos

Esta guía te ayudará a configurar el sistema completo con backend y base de datos PostgreSQL.

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **PostgreSQL** 12+ ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))
- Editor de código (VS Code recomendado)

## 🎯 Opción 1: Instalación Rápida (Modo DEMO)

Si solo quieres probar el frontend SIN base de datos:

```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Copiar variables de entorno
copy .env.example .env

# 3. Iniciar frontend (modo demo activo por defecto)
npm run dev
```

✅ **Listo!** Abre http://localhost:5173 y usa las credenciales demo:
- Admin: `admin@demo.com` / `admin123`
- Supervisor: `supervisor@demo.com` / `super123`  
- Técnico: `tecnico@demo.com` / `tecnico123`

---

## 🏗️ Opción 2: Instalación Completa (Con Base de Datos)

### Paso 1: Configurar PostgreSQL

#### Windows:
```powershell
# Instalar PostgreSQL desde el instalador
# Durante la instalación, recuerda la contraseña del usuario postgres

# Crear la base de datos
psql -U postgres
CREATE DATABASE sgmi_db;
\q
```

#### Mac (con Homebrew):
```bash
brew install postgresql
brew services start postgresql
createdb sgmi_db
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb sgmi_db
```

---

### Paso 2: Configurar el Backend

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
copy .env.example .env  # Windows
# o
cp .env.example .env    # Mac/Linux

# 4. Editar .env con tu editor
notepad .env  # Windows
# o
code .env     # VS Code
```

**Edita `.env` y configura:**

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/sgmi_db"
JWT_SECRET="cambia_esto_por_un_secreto_muy_seguro_2025"
JWT_EXPIRATION="24h"
REFRESH_TOKEN_SECRET="otro_secreto_diferente_para_refresh_token"
REFRESH_TOKEN_EXPIRATION="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
DEMO_MODE=false  # false para usar base de datos real
```

---

### Paso 3: Inicializar la Base de Datos

```bash
# 1. Generar el cliente de Prisma
npm run prisma:generate

# 2. Crear las tablas (migraciones)
npm run prisma:migrate

# 3. Poblar datos iniciales (usuarios, roles, etc.)
npm run seed
```

✅ Si todo salió bien, verás:
```
✅ 4 roles creados
✅ 4 usuarios creados
✅ 2 proyectos creados
✅ 3 items de inventario creados
🎉 Seed completado exitosamente!
```

---

### Paso 4: Iniciar el Backend

```bash
# Modo desarrollo (con hot-reload)
npm run dev
```

Verás:
```
╔════════════════════════════════════════════════════════╗
║   🏭 SGMI Backend API                                  ║
║   🚀 Servidor: http://localhost:3000                   ║
║   📊 Health: http://localhost:3000/api/health          ║
╚════════════════════════════════════════════════════════╝
```

**Probar el backend:**
```bash
# Windows PowerShell
Invoke-WebRequest http://localhost:3000/api/health

# Mac/Linux
curl http://localhost:3000/api/health
```

---

### Paso 5: Configurar el Frontend

```bash
# 1. Abrir una NUEVA terminal y volver a la raíz
cd ..

# 2. Instalar dependencias del frontend
npm install

# 3. Copiar variables de entorno
copy .env.example .env  # Windows
# o
cp .env.example .env    # Mac/Linux

# 4. Editar .env
notepad .env  # Windows
```

**Configurar `.env` del frontend:**

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SGMI
VITE_DEMO_MODE=false  # false para conectar al backend real
```

---

### Paso 6: Iniciar el Frontend

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

---

## 🎮 Usuarios de Prueba

### Con Base de Datos (DEMO_MODE=false):
| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Carlos Mendoza | `admin@sgmi.com` | `password123` | Administrador |
| Ana Martínez | `supervisor@sgmi.com` | `password123` | Supervisor |
| Juan Pérez | `tecnico@sgmi.com` | `password123` | Técnico |
| María García | `maria.garcia@sgmi.com` | `password123` | Técnico |

### Modo Demo (DEMO_MODE=true):
| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin Demo | `admin@demo.com` | `admin123` | Administrador |
| Supervisor Demo | `supervisor@demo.com` | `super123` | Supervisor |
| Técnico Demo | `tecnico@demo.com` | `tecnico123` | Técnico |

---

## 🔍 Verificar que Todo Funcione

### 1. Backend funcionando:
```bash
curl http://localhost:3000/api/health
# Debe responder: { "status": "OK", "mode": "production" }
```

### 2. Base de datos conectada:
```bash
cd backend
npm run prisma:studio
```
Abre http://localhost:5555 para ver la interfaz gráfica de la base de datos.

### 3. Login funcionando:
1. Abre http://localhost:5173
2. Desmarca "Usar modo demo"
3. Usa `admin@sgmi.com` / `password123`
4. Deberías ver el dashboard

---

## 🛠️ Comandos Útiles

### Backend:
```bash
cd backend

# Desarrollo
npm run dev                    # Iniciar con hot-reload
npm run build                  # Compilar para producción
npm start                      # Iniciar producción

# Base de datos
npm run prisma:generate        # Generar cliente Prisma
npm run prisma:migrate         # Ejecutar migraciones
npm run prisma:studio          # Interfaz gráfica BD
npm run seed                   # Poblar datos iniciales

# Resetear BD (cuidado en producción!)
npx prisma migrate reset       # Elimina TODO y vuelve a crear
npm run seed                   # Volver a poblar datos
```

### Frontend:
```bash
# En la raíz del proyecto

npm run dev                    # Desarrollo
npm run build                  # Compilar producción
npm run preview                # Previsualizar build
npm run deploy                 # Desplegar a GitHub Pages
```

---

## 🐛 Solución de Problemas

### Error: "DATABASE_URL not found"
```bash
# Asegúrate de tener el archivo .env
cd backend
copy .env.example .env  # Edita y configura DATABASE_URL
```

### Error: "Cannot connect to database"
```bash
# Verifica que PostgreSQL esté corriendo
# Windows: Servicios > PostgreSQL
# Mac: brew services list
# Linux: sudo service postgresql status

# Verifica las credenciales en .env
# El formato es: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Error: "Port 3000 already in use"
```bash
# Cambia el puerto en backend/.env
PORT=3001
```

### Error de CORS en el frontend
```bash
# Asegúrate que backend/.env tenga:
FRONTEND_URL="http://localhost:5173"
```

### "La página no carga / token expirado"
```bash
# Limpia localStorage del navegador
# En Chrome: F12 > Application > Local Storage > Clear All
# O cierra sesión y vuelve a entrar
```

---

## 📊 Estructura de Archivos

```
SGMI/
├── backend/                    # API Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de base de datos
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/           # Endpoints API
│   │   ├── middleware/       # Auth, permisos, errors
│   │   ├── config/           # Configuración
│   │   ├── seed.ts           # Datos iniciales
│   │   └── server.ts         # Servidor principal
│   ├── .env                  # Variables de entorno (no subir a Git)
│   └── package.json
│
├── src/                       # Frontend React
│   ├── components/           # Componentes UI
│   ├── services/             # API calls
│   │   ├── api.ts           # Cliente axios
│   │   └── authService.ts   # Servicios de auth
│   ├── store/               # Estado global (Zustand)
│   │   └── authStore.ts     # Store de autenticación
│   ├── hooks/               # Custom hooks
│   │   └── usePermissions.ts
│   └── App.tsx
│
├── .env                      # Variables frontend
└── package.json
```

---

## 🌐 Deployment en Producción

### Backend (Railway recomendado):
1. Crea cuenta en [Railway.app](https://railway.app)
2. Nuevo proyecto > Add PostgreSQL
3. Add Service > GitHub repo (carpeta backend)
4. Agregar variables de entorno desde `.env`
5. Deploy automático

### Frontend (GitHub Pages):
```bash
npm run deploy
```

### Base de datos en la nube:
- **Supabase** (Gratis): https://supabase.com
- **Railway** (Gratis): https://railway.app
- **Render** (Gratis): https://render.com

---

## 🎓 Próximos Pasos

Ahora que tienes todo funcionando:

1. ✅ Explora las secciones del dashboard
2. ✅ Crea un nuevo usuario desde la sección Usuarios (como Admin)
3. ✅ Prueba los diferentes roles y permisos
4. ✅ Revisa el código en `src/controllers` para entender la lógica
5. ✅ Personaliza los permisos en `backend/src/seed.ts`

---

## 📧 Soporte

¿Problemas? Abre un issue en GitHub o consulta:
- [README del Backend](backend/README.md)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Zustand](https://github.com/pmndrs/zustand)

---

**Desarrollado con ❤️ para SGMI - Sistema de Gestión de Mantenimiento Industrial**
