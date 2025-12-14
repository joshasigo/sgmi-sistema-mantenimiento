# 🚀 Proceso de Despliegue - SGMI
## Sistema de Gestión de Mantenimiento Industrial

**Proyecto:** SGMI  
**Fecha:** Diciembre 2025  
**Entorno:** Render (Backend) + Vercel (Frontend) + Neon (Database)

---

## 📋 Tabla de Contenido

1. [Diagrama de Despliegue UML](#diagrama-de-despliegue-uml)
2. [Arquitectura de Despliegue](#arquitectura-de-despliegue)
3. [Requisitos Previos](#requisitos-previos)
4. [Configuración de Base de Datos](#configuración-de-base-de-datos)
5. [Despliegue del Backend](#despliegue-del-backend)
6. [Despliegue del Frontend](#despliegue-del-frontend)
7. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
8. [Validación Post-Despliegue](#validación-post-despliegue)
9. [Monitoreo y Logs](#monitoreo-y-logs)
10. [Rollback y Recuperación](#rollback-y-recuperación)

---

## 🏗️ Diagrama de Despliegue UML

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET                                    │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CDN / Edge Network                             │
│  ┌──────────────────────┐        ┌────────────────────────┐         │
│  │  Vercel Edge         │        │  Cloudflare (opcional) │         │
│  │  - SSL/TLS           │        │  - DDoS Protection     │         │
│  │  - Geo Routing       │        │  - Rate Limiting       │         │
│  │  - Cache             │        │  - WAF                 │         │
│  └──────────────────────┘        └────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────┘
           │                                    │
           │                                    │
           ▼                                    ▼
┌──────────────────────────┐     ┌──────────────────────────────────┐
│   Frontend Deployment    │     │    Backend Deployment            │
│   ─────────────────────  │     │    ─────────────────────         │
│   «execution environment»│     │    «execution environment»       │
│   ┌──────────────────┐   │     │    ┌──────────────────────┐     │
│   │   Vercel         │   │     │    │   Render             │     │
│   │                  │   │     │    │                      │     │
│   │  - Node.js 18.x  │   │     │    │  - Node.js 18.x      │     │
│   │  - Static Files  │   │     │    │  - Express Server    │     │
│   │  - SPA Routing   │   │     │    │  - Health Checks     │     │
│   │                  │   │     │    │  - Auto-scaling      │     │
│   │  ┌────────────┐  │   │     │    │  ┌────────────────┐  │     │
│   │  │React SPA   │  │   │     │    │  │ API REST       │  │     │
│   │  │            │  │───┼─────┼────┼─▶│ - /api/auth    │  │     │
│   │  │- Dashboard │  │   │     │    │  │ - /api/ordenes │  │     │
│   │  │- Ordenes   │  │   │     │    │  │ - /api/users   │  │     │
│   │  │- Inventario│  │   │     │    │  │ - /api/reportes│  │     │
│   │  │- Reportes  │  │   │     │    │  │                │  │     │
│   │  │- Users     │  │   │     │    │  │ ┌────────────┐ │  │     │
│   │  └────────────┘  │   │     │    │  │ │Middleware  │ │  │     │
│   │                  │   │     │    │  │ │- JWT Auth  │ │  │     │
│   │  Components:     │   │     │    │  │ │- CORS      │ │  │     │
│   │  - Vite Build    │   │     │    │  │ │- Helmet    │ │  │     │
│   │  - TailwindCSS   │   │     │    │  │ │- RateLimiter│ │  │    │
│   │  - Shadcn/ui     │   │     │    │  │ └────────────┘ │  │     │
│   │  - Zustand       │   │     │    │  └────────────────┘  │     │
│   └──────────────────┘   │     │    └──────────────────────┘     │
│                          │     │             │                    │
│   Environment:           │     │             │ Prisma Client      │
│   - VITE_API_URL         │     │             ▼                    │
│   - VITE_APP_VERSION     │     │    ┌──────────────────────┐     │
└──────────────────────────┘     │    │  ORM Layer           │     │
                                 │    │  ────────────         │     │
                                 │    │  Prisma Client       │     │
                                 │    │  - Query Builder     │     │
                                 │    │  - Migrations        │     │
                                 │    │  - Type Safety       │     │
                                 │    └──────────────────────┘     │
                                 │             │                    │
                                 │             │ PostgreSQL Wire    │
                                 │             │ Protocol           │
                                 │             ▼                    │
                                 │    Environment:                  │
                                 │    - DATABASE_URL                │
                                 │    - JWT_SECRET                  │
                                 │    - NODE_ENV=production         │
                                 └──────────────────────────────────┘
                                              │
                                              │ SSL/TLS
                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Database Layer                                    │
│   ─────────────────────────────────────────────────────────         │
│   «database server»                                                 │
│   ┌──────────────────────────────────────────────────────────┐     │
│   │   Neon Serverless PostgreSQL                             │     │
│   │   ───────────────────────────────────────                │     │
│   │   - PostgreSQL 15                                        │     │
│   │   - Auto-scaling                                         │     │
│   │   - Automatic Backups (Daily)                            │     │
│   │   - Point-in-time Recovery                               │     │
│   │   - Connection Pooling                                   │     │
│   │   - Branch Database (Development)                        │     │
│   │                                                           │     │
│   │   Tables:                                                │     │
│   │   ┌────────────┐  ┌───────────────┐  ┌──────────────┐   │     │
│   │   │ usuarios   │  │ ordenes_trabajo│  │ inventario   │   │     │
│   │   │- id        │  │- id           │  │- id          │   │     │
│   │   │- nombre    │  │- equipo       │  │- nombre      │   │     │
│   │   │- email     │  │- tipo         │  │- cantidad    │   │     │
│   │   │- rolId     │  │- estado       │  │- stockMinimo │   │     │
│   │   └────────────┘  └───────────────┘  └──────────────┘   │     │
│   │                                                           │     │
│   │   Indexes:                                               │     │
│   │   - usuarios(email) UNIQUE                               │     │
│   │   - ordenes_trabajo(estado, prioridad)                   │     │
│   │   - inventario(codigo) UNIQUE                            │     │
│   └──────────────────────────────────────────────────────────┘     │
│                                                                     │
│   Backup Strategy:                                                 │
│   - Automated Daily Backups (7 days retention)                     │
│   - Manual Snapshots before major updates                          │
│   - Replicas in different regions (optional)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Arquitectura de Despliegue

### Componentes de Infraestructura

| Componente | Servicio | Función | URL |
|------------|----------|---------|-----|
| **Frontend** | Vercel | Hosting de aplicación React | https://sgmi.vercel.app |
| **Backend** | Render | API REST Node.js + Express | https://sgmi-api.onrender.com |
| **Base de Datos** | Neon | PostgreSQL Serverless | Internal endpoint |
| **CDN** | Vercel Edge | Distribución de contenido estático | Global |
| **SSL/TLS** | Automático | Certificados HTTPS | Let's Encrypt |

### Flujo de Despliegue

```
Developer                CI/CD                 Production
    │                      │                        │
    │  git push main       │                        │
    │─────────────────────▶│                        │
    │                      │                        │
    │                      │  Build & Test          │
    │                      │─────────────           │
    │                      │             │          │
    │                      │◀────────────┘          │
    │                      │                        │
    │                      │  Deploy Backend        │
    │                      │───────────────────────▶│
    │                      │                        │
    │                      │  Run Migrations        │
    │                      │───────────────────────▶│
    │                      │                        │
    │                      │  Deploy Frontend       │
    │                      │───────────────────────▶│
    │                      │                        │
    │                      │  Health Checks         │
    │                      │◀───────────────────────│
    │                      │                        │
    │  Deploy Success ✅   │                        │
    │◀─────────────────────│                        │
    │                      │                        │
```

---

## ✅ Requisitos Previos

### 1. Cuentas Necesarias

- [x] Cuenta GitHub (para repositorio de código)
- [x] Cuenta Vercel (para frontend)
- [x] Cuenta Render (para backend)
- [x] Cuenta Neon (para base de datos PostgreSQL)

### 2. Herramientas Locales

```bash
# Verificar versiones instaladas
node --version  # v18.0.0 o superior
npm --version   # v9.0.0 o superior
git --version   # v2.30.0 o superior
```

### 3. Preparación del Código

```bash
# Asegurarse de que el código esté en GitHub
git status
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

---

## 🗄️ Configuración de Base de Datos (Neon)

### Paso 1: Crear Proyecto en Neon

1. **Acceder a Neon Dashboard**
   - URL: https://console.neon.tech
   - Click en "Create Project"

2. **Configurar Proyecto**
   ```
   Project Name: sgmi-production
   PostgreSQL Version: 15
   Region: US East (Ohio) - us-east-2
   Compute Size: Shared (0.25 vCPU)
   ```

3. **Obtener Connection String**
   ```
   postgresql://usuario:password@ep-xyz.us-east-2.aws.neon.tech/sgmi?sslmode=require
   ```

### Paso 2: Ejecutar Migraciones

```bash
# En tu máquina local
cd backend

# Configurar DATABASE_URL
export DATABASE_URL="postgresql://usuario:password@ep-xyz.us-east-2.aws.neon.tech/sgmi?sslmode=require"

# Ejecutar migraciones
npx prisma migrate deploy

# Verificar schema
npx prisma db pull

# Generar Prisma Client
npx prisma generate
```

### Paso 3: Seed de Datos Iniciales

```bash
# Crear script de seed
# backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles
  await prisma.rol.createMany({
    data: [
      { id: 1, nombre: 'Técnico', permisos: {...} },
      { id: 2, nombre: 'Administrador', permisos: {...} },
      { id: 3, nombre: 'Supervisor', permisos: {...} },
      { id: 4, nombre: 'Visualizador', permisos: {...} },
    ],
  });

  // Crear usuario admin
  const passwordHash = await bcrypt.hash('Admin123', 10);
  await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@sgmi.com',
      passwordHash,
      rolId: 2,
      departamento: 'TI',
    },
  });

  console.log('✅ Seed completado');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

```bash
# Ejecutar seed
npx tsx prisma/seed.ts
```

---

## 🖥️ Despliegue del Backend (Render)

### Paso 1: Crear Servicio en Render

1. **Acceder a Render Dashboard**
   - URL: https://dashboard.render.com
   - Click en "New +" → "Web Service"

2. **Conectar Repositorio**
   - Seleccionar GitHub
   - Autorizar acceso a repositorio `sgmi-backend`
   - Branch: `main`

### Paso 2: Configurar Servicio

```yaml
# Configuración del servicio
Name: sgmi-backend-api
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install && npx prisma generate
Start Command: npm run start
Instance Type: Free (512MB RAM, 0.1 CPU)
Auto-Deploy: Yes
```

### Paso 3: Variables de Entorno

```bash
# En Render Dashboard → Environment
DATABASE_URL=postgresql://usuario:password@ep-xyz.us-east-2.aws.neon.tech/sgmi?sslmode=require
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiar_en_produccion
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://sgmi.vercel.app
```

### Paso 4: Configurar Health Checks

```yaml
# En Render Dashboard → Health & Alerts
Health Check Path: /api/health
Health Check Interval: 60 seconds
```

**Crear endpoint de salud:**

```typescript
// backend/src/routes/health.routes.ts
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

export default router;
```

### Paso 5: Desplegar

```bash
# Render automáticamente:
# 1. Clona el repositorio
# 2. Ejecuta npm install
# 3. Ejecuta npx prisma generate
# 4. Ejecuta npm run start
# 5. Monitorea el health check

# Monitorear logs en tiempo real
# Dashboard → Logs
```

**Verificar despliegue:**

```bash
# Probar endpoint de salud
curl https://sgmi-api.onrender.com/api/health

# Respuesta esperada:
{
  "status": "ok",
  "timestamp": "2025-12-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

---

## 🌐 Despliegue del Frontend (Vercel)

### Paso 1: Crear Proyecto en Vercel

1. **Acceder a Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Click en "Add New" → "Project"

2. **Importar Repositorio**
   - Conectar GitHub
   - Seleccionar repositorio `sgmi-frontend`
   - Branch: `main`

### Paso 2: Configurar Build Settings

```yaml
# Configuración automática detectada por Vercel
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

### Paso 3: Variables de Entorno

```bash
# En Vercel Dashboard → Settings → Environment Variables

# Production
VITE_API_URL=https://sgmi-api.onrender.com/api
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Preview (opcional - para ramas de desarrollo)
VITE_API_URL=https://sgmi-api-dev.onrender.com/api
VITE_APP_VERSION=1.0.0-preview
VITE_ENVIRONMENT=preview
```

### Paso 4: Configurar Custom Domain (Opcional)

```bash
# En Vercel Dashboard → Settings → Domains
# Agregar dominio personalizado: www.sgmi.com

# Configurar DNS:
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Paso 5: Optimización de Build

```typescript
// vite.config.ts - Configuración para producción

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactivar en producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog'],
          'utils': ['zustand', 'axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Paso 6: Desplegar

```bash
# Opción 1: Desde Dashboard (automático con git push)
git push origin main

# Opción 2: Desde CLI
npm i -g vercel
vercel --prod

# Monitorear despliegue
# Dashboard → Deployments
```

**Verificar despliegue:**

```bash
# Acceder a la URL generada
https://sgmi.vercel.app

# Verificar en navegador:
# - Página carga correctamente
# - Login funciona
# - API se conecta
# - Dashboard muestra datos
```

---

## 🔐 Configuración de Variables de Entorno

### Backend (.env.production)

```bash
# Database
DATABASE_URL="postgresql://usuario:password@ep-xyz.us-east-2.aws.neon.tech/sgmi?sslmode=require"

# JWT
JWT_SECRET="clave_super_secreta_cambiar_en_produccion_usar_64_caracteres"
JWT_EXPIRATION="24h"
JWT_REFRESH_EXPIRATION="7d"

# Server
NODE_ENV="production"
PORT=3000
HOST="0.0.0.0"

# CORS
FRONTEND_URL="https://sgmi.vercel.app"
ALLOWED_ORIGINS="https://sgmi.vercel.app,https://www.sgmi.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
ENABLE_REQUEST_LOGGING=true
```

### Frontend (.env.production)

```bash
# API Configuration
VITE_API_URL=https://sgmi-api.onrender.com/api
VITE_API_TIMEOUT=10000

# Application
VITE_APP_NAME="SGMI"
VITE_APP_VERSION="1.0.0"
VITE_ENVIRONMENT="production"

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=false
```

---

## ✅ Validación Post-Despliegue

### Checklist de Validación

```bash
# 1️⃣ Verificar Base de Datos
curl -X GET https://sgmi-api.onrender.com/api/health

# 2️⃣ Verificar Autenticación
curl -X POST https://sgmi-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sgmi.com","password":"Admin123"}'

# 3️⃣ Verificar Endpoints Protegidos
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET https://sgmi-api.onrender.com/api/ordenes \
  -H "Authorization: Bearer $TOKEN"

# 4️⃣ Verificar CORS
curl -X OPTIONS https://sgmi-api.onrender.com/api/ordenes \
  -H "Origin: https://sgmi.vercel.app" \
  -H "Access-Control-Request-Method: GET"

# 5️⃣ Verificar Frontend
curl -I https://sgmi.vercel.app

# 6️⃣ Prueba End-to-End Manual
# - Login en https://sgmi.vercel.app
# - Crear orden de trabajo
# - Actualizar inventario
# - Generar reporte
```

### Test de Carga Básico

```bash
# Usar Apache Bench
ab -n 100 -c 10 https://sgmi-api.onrender.com/api/health

# Resultados esperados:
# - Time per request: < 200ms
# - Failed requests: 0
# - Requests per second: > 50
```

---

## 📊 Monitoreo y Logs

### Logs del Backend (Render)

```bash
# Dashboard → Logs (Live)
# Filtrar por nivel:
# - Error
# - Warning
# - Info
```

**Configurar Alertas:**

```yaml
# Render Dashboard → Settings → Alerts
Alert Type: Failed Health Checks
Threshold: 3 consecutive failures
Notification: Email + Slack
```

### Logs del Frontend (Vercel)

```bash
# Dashboard → Deployments → [Deployment] → Runtime Logs

# Configurar Error Tracking (opcional)
# Integrar Sentry:
npm install @sentry/react

# src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: import.meta.env.VITE_ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

### Monitoreo de Base de Datos (Neon)

```bash
# Neon Dashboard → Monitoring
# - Connection Count
# - Query Performance
# - Storage Usage
# - CPU Usage
```

---

## 🔄 Rollback y Recuperación

### Rollback de Backend (Render)

```bash
# Método 1: Desde Dashboard
# 1. Dashboard → Deployments
# 2. Seleccionar deployment previo
# 3. Click "Redeploy"

# Método 2: Desde Git
git revert HEAD
git push origin main
# Render automáticamente despliega el commit anterior
```

### Rollback de Frontend (Vercel)

```bash
# Dashboard → Deployments
# 1. Encontrar deployment estable anterior
# 2. Click "Promote to Production"

# O desde CLI:
vercel rollback
```

### Restauración de Base de Datos

```bash
# Neon Dashboard → Backups
# 1. Seleccionar snapshot
# 2. Restaurar a nueva branch
# 3. Validar datos
# 4. Promover a main si está correcto

# O crear restore point manual:
# 1. Dashboard → Branches
# 2. "Create Branch from main"
# 3. Point-in-time restore
```

---

## 📋 Pipeline CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy SGMI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run Backend Tests
        working-directory: ./backend
        run: npm test
      
      - name: Install Frontend Dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run Frontend Tests
        working-directory: ./frontend
        run: npm test

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🎯 Resumen del Proceso

### Tiempo Estimado de Despliegue

| Etapa | Duración |
|-------|----------|
| Configuración de Neon DB | 10 min |
| Migraciones y Seed | 5 min |
| Configuración Render | 15 min |
| Primer Deploy Backend | 5-10 min |
| Configuración Vercel | 10 min |
| Primer Deploy Frontend | 2-3 min |
| Validación | 10 min |
| **TOTAL** | **57-68 min** |

### Costos Mensuales (Nivel Gratuito)

| Servicio | Plan | Costo |
|----------|------|-------|
| Neon DB | Free Tier | $0 (1GB storage) |
| Render | Free | $0 (750 horas/mes) |
| Vercel | Hobby | $0 (100GB bandwidth) |
| **TOTAL** | | **$0/mes** |

---

## ✅ Checklist Final de Despliegue

- [x] Base de datos configurada en Neon
- [x] Migraciones ejecutadas
- [x] Seed de datos inicial
- [x] Backend desplegado en Render
- [x] Variables de entorno configuradas
- [x] Health checks funcionando
- [x] Frontend desplegado en Vercel
- [x] CORS configurado correctamente
- [x] SSL/TLS habilitado
- [x] Pruebas E2E pasando
- [x] Monitoreo configurado
- [x] Logs accesibles
- [x] Backups automáticos activos
- [x] Documentación actualizada

---

**Documento elaborado por:** Equipo de Desarrollo SGMI  
**Última actualización:** Diciembre 2025  
**Siguiente Revisión:** Enero 2026
