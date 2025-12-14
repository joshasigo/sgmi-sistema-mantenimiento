# 🔧 Guía Avanzada de Troubleshooting y Deployment

> **Soluciones a problemas complejos y configuraciones avanzadas**

---

## 🆘 Problemas Comunes y Soluciones

### **1. npm install se cuelga o falla**

**Síntomas:**
- Instalación se detiene a mitad
- "Error: unable to get local issuer certificate"
- Timeout después de 5 minutos

**Soluciones (en orden):**

```powershell
# Opción 1: Limpiar caché
npm cache clean --force

# Opción 2: Instalar con flags especiales
npm install --legacy-peer-deps

# Opción 3: Aumentar timeout
npm install --fetch-timeout=120000 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# Opción 4: Usar npm antiguo
npm install --npm=npm@8

# Opción 5: Borrar todo y reiniciar
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

**Si persiste:**
```powershell
# Verificar conexión DNS
nslookup registry.npmjs.org

# O cambiar registro npm
npm config set registry https://registry.npmmirror.com/
npm install
npm config set registry https://registry.npmjs.org/
```

---

### **2. "Module not found" después de instalar**

**Síntomas:**
```
Error: Cannot find module 'react'
```

**Soluciones:**

```bash
# Opción 1: Reinstalar específicamente
npm install react react-dom

# Opción 2: Limpiar caché de módulos
rm -rf node_modules/.cache
npm install

# Opción 3: Reinstalar todo
rm -rf node_modules
npm install

# Opción 4: Verificar package.json está bien
cat package.json | grep -A 20 "dependencies"
```

---

### **3. Puerto 5173 "Already in use"**

**Síntomas:**
```
Error: Port 5173 is already in use
```

**Soluciones:**

**Windows:**
```powershell
# Ver proceso en puerto 5173
netstat -ano | findstr :5173

# Matar proceso (reemplaza PID con el número)
taskkill /PID 12345 /F

# O usar puerto diferente
npm run dev -- --port 3000
```

**macOS/Linux:**
```bash
# Ver proceso
lsof -i :5173

# Matar proceso (reemplaza PID)
kill -9 12345

# O usar puerto diferente
npm run dev -- --port 3000
```

---

### **4. Cambios en código no se reflejan en navegador**

**Síntomas:**
- Editas archivo pero no ves cambios
- HMR (Hot Module Replacement) no funciona

**Soluciones:**

```bash
# 1. Limpiar caché navegador
Ctrl + Shift + Delete (Chrome/Edge)
Cmd + Shift + Delete (Firefox)
Cmd + Shift + Backspace (Safari)

# 2. Modo incógnito
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
Cmd + Shift + N (Safari)

# 3. Reiniciar servidor
Ctrl + C
npm run dev

# 4. Verificar archivo se guardó
# Asegúrate que el editor guardó con Ctrl + S

# 5. Si persiste, limpiar dist
rm -rf dist
npm run dev
```

---

### **5. Estilos Tailwind no se aplican**

**Síntomas:**
- Clases Tailwind no funcionan
- Estilos CSS vacíos

**Soluciones:**

```bash
# 1. Verificar tailwind.config.js
cat tailwind.config.js

# Debe incluir:
# content: ["./src/**/*.{js,jsx,ts,tsx}"]

# 2. Limpiar caché
npm run build -- --reset

# 3. Reinstalar tailwind
npm install -D tailwindcss postcss autoprefixer

# 4. Verificar index.css tiene directivas
grep -n "@tailwind" src/index.css

# Debe mostrar:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# 5. Reiniciar servidor
Ctrl + C
npm run dev
```

---

### **6. Error de TypeScript "Type is not assignable"**

**Síntomas:**
```
Type '{ name: string }' is not assignable to type 'User'
```

**Soluciones:**

```bash
# 1. Verificar tipos están correctos
# En src/types/ o top de archivos

# 2. Reconstruir
npm run build

# 3. Limpiar tipos
rm -rf dist
npm run build

# 4. Verificar tsconfig.json
cat tsconfig.json | grep -A 5 "compilerOptions"
```

---

### **7. "Cannot read property 'map' of undefined"**

**Síntomas:**
```
TypeError: Cannot read property 'map' of undefined
```

**Soluciones:**

```typescript
// Problema: intenta hacer map en algo undefined
items.map(item => item.name)

// Solución 1: Verificar antes
items?.map(item => item.name)

// Solución 2: Valor por defecto
(items || []).map(item => item.name)

// Solución 3: En componente
const [items, setItems] = useState([]) // Inicializar array vacío
```

---

### **8. Errores de CORS (desarrollo)"**

**Síntomas:**
```
Access to XMLHttpRequest at 'http://api.com' blocked by CORS policy
```

**Causa:** Desarrollo local vs API remota

**Soluciones:**

```bash
# 1. Usar proxy en vite.config.ts
# (Agregar en defineConfig)
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}

# 2. Luego usar fetch:
fetch('/api/users') // Funciona en desarrollo

# 3. En producción, mismo dominio = sin CORS
```

---

## 🚀 Deployment Avanzado

### **Deployment en Vercel (Recomendado)**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Seleccionar opciones:
# - Link to existing project? No
# - Set up and deploy? Yes
# - Which scope? Personal/Team
# - Which directory? ./dist (después de build)
# - Override settings? No
```

**Resultado:**
```
✓ Production: https://tu-proyecto.vercel.app
✓ Preview: [URL única para cada push]
```

---

### **Deployment en Firebase**

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar proyecto
firebase init hosting

# Seleccionar:
# - Use existing project
# - What do you want to use as your public directory? dist
# - Configure as SPA? Yes

# 4. Build
npm run build

# 5. Deploy
firebase deploy

# Resultado: https://tu-proyecto.firebaseapp.com
```

---

### **Deployment en Docker**

**Crear `Dockerfile`:**
```dockerfile
# Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build y run:**
```bash
docker build -t sgmi-app .
docker run -p 3000:3000 sgmi-app
# http://localhost:3000
```

---

### **Deployment en AWS S3 + CloudFront**

```bash
# 1. Build
npm run build

# 2. Instalar AWS CLI
npm install -g aws-cli

# 3. Configurar credenciales
aws configure
# Ingresa: Access Key, Secret Key, región

# 4. Subir a S3
aws s3 sync dist/ s3://tu-bucket-sgmi/

# 5. (Opcional) Configurar CloudFront
# En AWS Console: Create distribution desde bucket
```

---

### **Deployment en GitHub Pages**

```bash
# 1. Modificar `vite.config.ts` (asegúrate del nombre del repo)
# Si tu repositorio se llama `SGMI-Frontend`:
# base: '/SGMI-Frontend/'

# 2. Agregar script a `package.json` (opcional si usas GitHub Actions)
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# 3. Deploy (local, opcional — Actions automatiza esto)
npm run deploy

# URL esperada: https://<tu-usuario>.github.io/SGMI-Frontend/
```

Notas rápidas de troubleshooting:

- Si la app carga 404s en producción, revisa el valor de `base` en `vite.config.ts` — debe coincidir con el nombre del repositorio cuando usas GitHub Pages (project site).
- Si usas el flujo oficial de Actions (`upload-pages-artifact` + `deploy-pages`), revisa en el repo `Settings -> Pages` que no haya restricciones inusuales y que las `Actions permissions` permitan desplegar.
- Si el workflow falla por versiones de acciones, actualiza las acciones (`upload-pages-artifact@v2`, `deploy-pages@v1`) — ya se configuró en este repo.
- Para publicar manualmente (si Actions no funciona), crea/actualiza la rama `gh-pages` con el contenido de `dist/` o usa `gh-pages` npm package.


---

## 📊 Monitoreo en Producción

### **Agregar Logging**

```typescript
// src/utils/logger.ts
export const logger = {
  error: (msg: string, error?: any) => {
    console.error(msg, error)
    // Aquí podrías enviar a servicio de logging
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify({ msg, error }) })
  },
  info: (msg: string) => {
    console.log(msg)
  }
}
```

### **Monitoreo de Performance**

```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => any) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`${name} took ${end - start}ms`)
  return result
}
```

---

## 🔒 Seguridad en Producción

### **Verificar Vulnerabilidades**

```bash
# Auditar dependencias
npm audit

# Arreglar vulnerabilidades automáticamente
npm audit fix

# Ver vulnerabilidades específicas
npm audit --json | grep severity
```

### **Configuración de Seguridad**

**En componentes que manejan datos sensibles:**

```typescript
// ❌ Nunca guardes secrets en cliente
localStorage.setItem('apiKey', 'secret123')

// ✅ Usa variables de entorno
const apiKey = import.meta.env.VITE_API_KEY
// Y NEVER expongas keys en .env
// Solo en servidor backend
```

---

## 📈 Optimización de Performance

### **Analizar Bundle Size**

```bash
npm install -g npm-check-updates
npm run build -- --report=true
```

### **Code Splitting Automático**

```typescript
// Lazy load componentes
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./components/Dashboard'))

export default function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Dashboard />
    </Suspense>
  )
}
```

---

## 🔄 CI/CD (Integración Continua)

### **GitHub Actions**

**Crear `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📚 Recursos Avanzados

| Tema | Link |
|------|------|
| Vite Plugins | https://vitejs.dev/plugins/ |
| React Advanced | https://react.dev/reference/react |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ |
| Tailwind Performance | https://tailwindcss.com/docs/optimizing-for-production |
| shadcn/ui Custom | https://ui.shadcn.com/docs/components |

---

## ✅ Checklist Antes de Deploy

- [ ] `npm run build` sin errores
- [ ] `npm audit` sin vulnerabilidades críticas
- [ ] Variables de entorno configuradas
- [ ] Tests pasan (si existen)
- [ ] Código revisado
- [ ] Performance optimizado
- [ ] Responsivo en móvil/tablet
- [ ] Caché limpiado en navegador
- [ ] HTTPS configurado
- [ ] Backup realizado

---

**Última actualización:** 2025-11-30  
**Nivel:** Avanzado  
**Status:** ✅ Completo
