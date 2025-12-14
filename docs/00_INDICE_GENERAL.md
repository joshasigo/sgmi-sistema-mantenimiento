# 📚 Índice General de Documentación - SGMI
## Sistema de Gestión de Mantenimiento Industrial

**Proyecto:** SGMI  
**Universidad:** Universidad Iberoamericana  
**Materia:** Proyecto de Software 2025-2  
**Fecha:** Diciembre 2025

---

## 🎯 Propósito de este Documento

Este índice proporciona una guía centralizada para navegar toda la documentación técnica del Sistema de Gestión de Mantenimiento Industrial (SGMI). Los documentos están organizados por fase de desarrollo y cubren desde la arquitectura hasta el despliegue en producción.

---

## 📋 Índice de Documentos

### 📁 Fase 1: Documentación Funcional

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 1 | **START_HERE.md** | Punto de inicio - Guía rápida para comenzar | [/START_HERE.md](../START_HERE.md) |
| 2 | **README.md** | Descripción general del proyecto | [/README.md](../README.md) |
| 3 | **GUIA_RAPIDA_5_MINUTOS.md** | Guía de instalación rápida | [/GUIA_RAPIDA_5_MINUTOS.md](../GUIA_RAPIDA_5_MINUTOS.md) |
| 4 | **FUNCIONALIDADES_AUTH.md** | Sistema de autenticación y roles | [/FUNCIONALIDADES_AUTH.md](../FUNCIONALIDADES_AUTH.md) |

---

### 📁 Fase 2: Desarrollo - Arquitectura y Diseño

| # | Documento | Descripción | Páginas | Ubicación |
|---|-----------|-------------|---------|-----------|
| **1** | **01_ARQUITECTURA_SOFTWARE.md** | Arquitectura de tres capas, MVC, comunicación cliente-servidor, diagramas ER | 450+ líneas | [/docs/01_ARQUITECTURA_SOFTWARE.md](./01_ARQUITECTURA_SOFTWARE.md) |
| **2** | **02_PATRONES_DISEÑO.md** | Singleton, Factory, Observer, Repository, Middleware, Service Layer, DTO | 500+ líneas | [/docs/02_PATRONES_DISEÑO.md](./02_PATRONES_DISEÑO.md) |
| **3** | **03_PRINCIPIOS_SOLID.md** | Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion | 600+ líneas | [/docs/03_PRINCIPIOS_SOLID.md](./03_PRINCIPIOS_SOLID.md) |

#### 📊 Contenido Destacado - Arquitectura

- **Arquitectura de Tres Capas:** Frontend (React), Backend (Node.js + Express), Database (PostgreSQL)
- **Patrón MVC en Frontend:** Separación clara de Models, Views, Components
- **Backend por Capas:** Middleware → Controllers → Services → Repositories → Database
- **Diagramas ASCII:** Flujo de peticiones, arquitectura completa, ER de base de datos
- **Stack Tecnológico Completo:** React 18.3.1, TypeScript, Vite, Express, Prisma, Neon DB

---

### 📁 Fase 3: Pruebas de Software

| # | Documento | Descripción | Cobertura | Ubicación |
|---|-----------|-------------|-----------|-----------|
| **4** | **04_PRUEBAS_SOFTWARE.md** | Pruebas por nivel (Unitarias, Integración, Sistema, Aceptación), por técnica (Caja Blanca/Negra/Gris), funcionales y no funcionales | 73% código | [/docs/04_PRUEBAS_SOFTWARE.md](./04_PRUEBAS_SOFTWARE.md) |

#### 🧪 Contenido Destacado - Pruebas

**Por Nivel:**
- **Unitarias (60%):** 147 tests - Controllers, Services, Components
- **Integración (30%):** 53 tests - API workflows, Database operations
- **Sistema (E2E):** 28 tests - Ciclos completos de mantenimiento
- **Aceptación:** Escenarios Gherkin con Given/When/Then

**Por Técnica:**
- **Caja Blanca:** Validación de estructura interna (JWT, bcrypt, permisos)
- **Caja Negra:** Validación de entradas/salidas sin conocer implementación
- **Caja Gris:** Optimización de queries con conocimiento de índices

**Pruebas Funcionales:**
- Autenticación (7 casos)
- Gestión de Órdenes (9 casos)
- Inventario (5 casos)

**Pruebas No Funcionales:**
- **Rendimiento:** 250 req/seg en endpoint de órdenes
- **Seguridad:** SQL Injection, XSS, CSRF, Brute Force - Todos bloqueados ✅
- **Usabilidad:** Carga en <3seg, 92% usuarios completan tareas sin ayuda

**Métricas:**
- Total: 228 tests
- Pasadas: 218 (95.6%)
- Cobertura Global: 73%

---

### 📁 Fase 4: Despliegue

| # | Documento | Descripción | Servicios | Ubicación |
|---|-----------|-------------|-----------|-----------|
| **5** | **05_PROCESO_DESPLIEGUE.md** | Diagrama UML de despliegue, configuración de infraestructura, pipeline CI/CD, monitoreo | Vercel + Render + Neon | [/docs/05_PROCESO_DESPLIEGUE.md](./05_PROCESO_DESPLIEGUE.md) |

#### 🚀 Contenido Destacado - Despliegue

**Diagrama UML de Despliegue:**
- CDN / Edge Network (Vercel Edge)
- Frontend (Vercel - React SPA)
- Backend (Render - Express API)
- Database (Neon - PostgreSQL Serverless)

**Infraestructura:**
| Componente | Servicio | Plan | Costo |
|------------|----------|------|-------|
| Frontend | Vercel | Hobby | $0 |
| Backend | Render | Free | $0 |
| Database | Neon | Free Tier | $0 |

**Proceso Paso a Paso:**
1. Configuración de Base de Datos (Neon)
2. Migraciones y Seed
3. Despliegue Backend (Render)
4. Despliegue Frontend (Vercel)
5. Validación Post-Despliegue
6. Configuración de Monitoreo

**CI/CD Pipeline:**
- GitHub Actions
- Tests automáticos
- Deploy automático en push a main
- Rollback con un click

**Tiempo Total de Despliegue:** 57-68 minutos

---

### 📁 Documentación de Instalación y Configuración

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 5 | **GUIA_DEPLOYMENT_INSTALACION.md** | Guía completa de instalación local | [/GUIA_DEPLOYMENT_INSTALACION.md](../GUIA_DEPLOYMENT_INSTALACION.md) |
| 6 | **GUIA_SISTEMA_OPERATIVO.md** | Instalación específica por sistema operativo | [/GUIA_SISTEMA_OPERATIVO.md](../GUIA_SISTEMA_OPERATIVO.md) |
| 7 | **GUIA_TROUBLESHOOTING_AVANZADO.md** | Solución de problemas comunes | [/GUIA_TROUBLESHOOTING_AVANZADO.md](../GUIA_TROUBLESHOOTING_AVANZADO.md) |

---

### 📁 Documentación de Despliegue en la Nube

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 8 | **DEPLOYMENT_GITHUB_PAGES.md** | Despliegue en GitHub Pages | [/DEPLOYMENT_GITHUB_PAGES.md](../DEPLOYMENT_GITHUB_PAGES.md) |
| 9 | **GUIA_GITHUB_PAGES_DEPLOYMENT.md** | Guía detallada GitHub Pages | [/GUIA_GITHUB_PAGES_DEPLOYMENT.md](../GUIA_GITHUB_PAGES_DEPLOYMENT.md) |
| 10 | **PASOS_ACTIVAR_GITHUB_PAGES.md** | Activación paso a paso | [/PASOS_ACTIVAR_GITHUB_PAGES.md](../PASOS_ACTIVAR_GITHUB_PAGES.md) |

---

### 📁 Control de Versiones

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 11 | **GUIA_GITHUB_VERSIONADO.md** | Uso de Git y GitHub | [/GUIA_GITHUB_VERSIONADO.md](../GUIA_GITHUB_VERSIONADO.md) |
| 12 | **INSTRUCCIONES_CONECTAR_GITHUB.md** | Conexión con GitHub | [/INSTRUCCIONES_CONECTAR_GITHUB.md](../INSTRUCCIONES_CONECTAR_GITHUB.md) |
| 13 | **RESUMEN_GIT_GITHUB.md** | Resumen de comandos Git | [/RESUMEN_GIT_GITHUB.md](../RESUMEN_GIT_GITHUB.md) |

---

### 📁 Documentación de Depuración

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 14 | **REPORTE_DEPURACION.md** | Análisis de 76 errores TypeScript | [/REPORTE_DEPURACION.md](../REPORTE_DEPURACION.md) |
| 15 | **CORRECCIONES_APLICADAS.md** | Tracking de correcciones (40% completado) | [/CORRECCIONES_APLICADAS.md](../CORRECCIONES_APLICADAS.md) |

---

### 📁 Documentación de Diseño

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 16 | **ARQUITECTURA_FIGMA.md** | Arquitectura de diseño en Figma | [/ARQUITECTURA_FIGMA.md](../ARQUITECTURA_FIGMA.md) |
| 17 | **CAMBIOS_DOCUMENTACION_FIGMA.md** | Cambios en diseño | [/CAMBIOS_DOCUMENTACION_FIGMA.md](../CAMBIOS_DOCUMENTACION_FIGMA.md) |

---

### 📁 Referencias Rápidas

| # | Documento | Descripción | Ubicación |
|---|-----------|-------------|-----------|
| 18 | **COMANDOS_COPY_PASTE.md** | Comandos útiles para copiar/pegar | [/COMANDOS_COPY_PASTE.md](../COMANDOS_COPY_PASTE.md) |
| 19 | **INDICE_DOCUMENTACION.md** | Índice antiguo (reemplazado por este) | [/INDICE_DOCUMENTACION.md](../INDICE_DOCUMENTACION.md) |

---

## 🎓 Ruta de Aprendizaje Recomendada

### Para Nuevos Desarrolladores

```
1. START_HERE.md
   └─→ README.md
       └─→ GUIA_RAPIDA_5_MINUTOS.md
           └─→ FUNCIONALIDADES_AUTH.md
               └─→ docs/01_ARQUITECTURA_SOFTWARE.md
```

### Para Revisión Académica

```
1. docs/01_ARQUITECTURA_SOFTWARE.md      (Entender arquitectura)
   └─→ docs/02_PATRONES_DISEÑO.md        (Patrones implementados)
       └─→ docs/03_PRINCIPIOS_SOLID.md   (Principios de diseño)
           └─→ docs/04_PRUEBAS_SOFTWARE.md   (Validación)
               └─→ docs/05_PROCESO_DESPLIEGUE.md  (Despliegue)
```

### Para Despliegue

```
1. docs/05_PROCESO_DESPLIEGUE.md
   └─→ GUIA_DEPLOYMENT_INSTALACION.md
       └─→ GUIA_TROUBLESHOOTING_AVANZADO.md
```

---

## 📊 Resumen Ejecutivo del Proyecto

### Tecnologías Utilizadas

**Frontend:**
- React 18.3.1 + TypeScript
- Vite (Build tool)
- TailwindCSS + Shadcn/ui
- Zustand (State management)
- React Router DOM

**Backend:**
- Node.js 18+ + Express
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt (Password hashing)

**Base de Datos:**
- PostgreSQL 15
- Neon Serverless
- Prisma Migrations

**Infraestructura:**
- Vercel (Frontend hosting)
- Render (Backend hosting)
- Neon (Database hosting)
- GitHub Actions (CI/CD)

---

### Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de Código** | ~15,000 |
| **Componentes React** | 25+ |
| **Endpoints API** | 35+ |
| **Pruebas** | 228 tests |
| **Cobertura** | 73% |
| **Documentos** | 19 archivos |
| **Páginas Documentación** | ~3,000 líneas |

---

### Funcionalidades Principales

1. **Autenticación y Autorización**
   - Login/Registro
   - JWT Tokens
   - 4 Roles (Técnico, Administrador, Supervisor, Visualizador)
   - Permisos granulares por módulo

2. **Gestión de Órdenes de Trabajo**
   - CRUD completo
   - Asignación de técnicos
   - Seguimiento de progreso
   - Costos (mano de obra + repuestos)
   - Tipos: Preventivo, Correctivo, Predictivo

3. **Inventario**
   - Control de stock
   - Alertas de bajo stock
   - Categorías (Repuestos, Herramientas, Consumibles)
   - Historial de movimientos

4. **Reportes**
   - PDF, Excel, CSV
   - Órdenes por período
   - Inventario bajo stock
   - Costos y estadísticas

5. **Dashboard**
   - Estadísticas en tiempo real
   - Gráficos interactivos
   - Indicadores clave (KPIs)

---

## 🎯 Objetivos Académicos Cumplidos

### Fase de Desarrollo - Codificación ✅

- [x] **Arquitectura del Software:** Documentada en [01_ARQUITECTURA_SOFTWARE.md](./01_ARQUITECTURA_SOFTWARE.md)
  - Arquitectura de tres capas
  - Patrón MVC en frontend
  - Backend por capas
  - Diagramas de comunicación
  - ER de base de datos

- [x] **Patrones de Diseño:** Documentados en [02_PATRONES_DISEÑO.md](./02_PATRONES_DISEÑO.md)
  - Singleton (Database, Store)
  - Factory (API Client, Errors)
  - Observer (State Management)
  - Repository (Data Access)
  - Middleware (Chain of Responsibility)
  - Service Layer
  - DTO (Data Transfer Objects)

- [x] **Principios SOLID:** Documentados en [03_PRINCIPIOS_SOLID.md](./03_PRINCIPIOS_SOLID.md)
  - Single Responsibility ✅
  - Open/Closed ✅
  - Liskov Substitution ✅
  - Interface Segregation ✅
  - Dependency Inversion ✅

### Pruebas de Software ✅

- [x] **Por Nivel:** Documentado en [04_PRUEBAS_SOFTWARE.md](./04_PRUEBAS_SOFTWARE.md)
  - Unitarias (147 tests, 96.6% éxito)
  - Integración (53 tests, 96.2% éxito)
  - Sistema (28 tests, 89.3% éxito)
  - Aceptación (Escenarios Gherkin)

- [x] **Por Técnica:**
  - Caja Blanca (estructura interna)
  - Caja Negra (entradas/salidas)
  - Caja Gris (conocimiento parcial)

- [x] **Por Tipo:**
  - Funcionales (Autenticación, Órdenes, Inventario)
  - No Funcionales (Rendimiento, Seguridad, Usabilidad)

- [x] **Casos de Prueba con Resultados:**
  - 21+ casos documentados
  - Precondiciones y postcondiciones
  - Resultados esperados vs reales

### Proceso de Despliegue ✅

- [x] **Diagrama de Despliegue:** Incluido en [05_PROCESO_DESPLIEGUE.md](./05_PROCESO_DESPLIEGUE.md)
  - Diagrama UML completo
  - Componentes de infraestructura
  - Flujos de comunicación

- [x] **Proceso Paso a Paso:**
  - Configuración de base de datos
  - Despliegue de backend
  - Despliegue de frontend
  - Validación post-despliegue
  - Monitoreo y logs
  - Rollback y recuperación

---

## 📞 Información de Contacto

**Proyecto:** SGMI - Sistema de Gestión de Mantenimiento Industrial  
**Universidad:** Universidad Iberoamericana  
**Materia:** Proyecto de Software 2025-2  
**Profesor:** [Nombre del Profesor]  
**Equipo:**
- Joshua [Apellido] - Desarrollo Full Stack
- [Otros miembros si aplica]

**Repositorio:** https://github.com/[usuario]/sgmi  
**Demo:** https://sgmi.vercel.app  
**API:** https://sgmi-api.onrender.com

---

## 📝 Notas Finales

Este índice se actualiza continuamente. Última actualización: **Diciembre 2025**.

Para cualquier pregunta o sugerencia sobre la documentación, por favor:
1. Revisar primero [START_HERE.md](../START_HERE.md)
2. Consultar [GUIA_TROUBLESHOOTING_AVANZADO.md](../GUIA_TROUBLESHOOTING_AVANZADO.md)
3. Contactar al equipo de desarrollo

---

**Documento elaborado por:** Equipo de Desarrollo SGMI  
**Fecha de Creación:** Diciembre 2025  
**Versión:** 1.0.0  
**Próxima Revisión:** Enero 2026
