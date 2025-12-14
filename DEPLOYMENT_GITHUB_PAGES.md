# 🚀 Documentación Completa - Despliegue en GitHub Pages

## 📌 Información del Proyecto

- **Proyecto:** SGMI - Sistema de Gestión de Mantenimiento Industrial
- **Repositorio:** https://github.com/joshasigo/SGMI-Frontend
- **GitHub Pages:** https://joshasigo.github.io/SGMI-Frontend/
- **Rama principal:** `main`
- **Tecnologías:** React 18 + TypeScript + Vite + Tailwind CSS

---

## ✅ Estado Actual del Deployment

### **Configuración Completada:**

- ✅ **Repositorio:** GitHub configurado y sincronizado
- ✅ **GitHub Actions:** Workflow de CI/CD funcionando
- ✅ **GitHub Pages:** Activado con GitHub Actions como source
- ✅ **Build:** Compila exitosamente sin errores
- ✅ **Sitio Web:** Desplegado y accesible públicamente

### **URL del Sitio:**
```
https://joshasigo.github.io/SGMI-Frontend/
```

---

## 🏗️ Arquitectura del Deployment

### **1. Configuración de Vite (`vite.config.ts`)**

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/SGMI-Frontend/',  // ← Importante: nombre del repositorio
  server: {
    port: 5173,
    open: true
  }
})
```

**Nota:** El `base` debe coincidir exactamente con el nombre del repositorio para que los assets se carguen correctamente.

### **2. Scripts de Deployment (`package.json`)**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1"
  }
}
```

### **3. GitHub Actions Workflow (`.github/workflows/deploy.yml`)**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      # Fix para bug de Rollup en Linux
      - name: Clean install
        run: |
          rm -rf node_modules package-lock.json
          npm install --legacy-peer-deps
          npm install --legacy-peer-deps
      
      - name: Build
        run: npm run build
        env:
          CI: false
          NODE_ENV: production
      
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

### **4. Archivo `.nojekyll`**

Ubicado en `public/.nojekyll` para evitar que GitHub Pages procese el sitio con Jekyll.

---

## 🔄 Proceso de Deployment Automático

### **Flujo Completo:**

```
1. Desarrollador hace cambios localmente
   ↓
2. git add . && git commit -m "mensaje"
   ↓
3. git push origin main
   ↓
4. GitHub Actions detecta el push
   ↓
5. Ejecuta workflow:
   - Instala Node.js 20
   - Instala dependencias (doble instalación para fix de Rollup)
   - Compila el proyecto (npm run build)
   - Genera carpeta dist/
   - Sube artifact a GitHub Pages
   ↓
6. Deploy automático a GitHub Pages
   ↓
7. Sitio actualizado en: https://joshasigo.github.io/SGMI-Frontend/
```

**Tiempo estimado:** 3-5 minutos desde push hasta deployment completo.

---

## 📝 Comandos Útiles

### **Desarrollo Local:**

```powershell
# Instalar dependencias
npm install

# Modo desarrollo (hot reload)
npm run dev
# → http://localhost:5173

# Compilar para producción
npm run build

# Vista previa del build de producción
npm run preview
# → http://localhost:4173/SGMI-Frontend/
```

### **Deployment:**

```powershell
# Opción 1: Automático (recomendado)
git add .
git commit -m "Descripción de cambios"
git push origin main
# → GitHub Actions desplegará automáticamente

# Opción 2: Manual con gh-pages
npm run deploy
# → Despliega directamente desde tu máquina
```

### **Control de Versiones:**

```powershell
# Ver estado del repositorio
git status

# Ver historial de commits
git log --oneline -10

# Ver diferencias
git diff

# Deshacer cambios (antes de commit)
git restore archivo.tsx
```

---

## 🐛 Solución de Problemas Comunes

### **Problema 1: Página en blanco después del deployment**

**Causa:** El `base` en `vite.config.ts` no coincide con el nombre del repositorio.

**Solución:**
```typescript
// Verificar que coincida:
base: '/SGMI-Frontend/'  // Nombre exacto del repo
```

### **Problema 2: Assets (CSS/JS) no cargan (404)**

**Causa:** Rutas absolutas sin el base correcto.

**Solución:** Ya está solucionado con la configuración de `base` en Vite.

### **Problema 3: Error en GitHub Actions - "Cannot find module @rollup/rollup-linux-x64-gnu"**

**Causa:** Bug conocido de npm con dependencias opcionales de Rollup.

**Solución:** Ya aplicada en el workflow con doble `npm install`.

### **Problema 4: Workflow no se ejecuta**

**Verificar:**
1. GitHub Actions está habilitado en `Settings → Actions → General`
2. "Allow all actions and reusable workflows" está seleccionado
3. "Read and write permissions" está habilitado
4. El archivo `.github/workflows/deploy.yml` existe en el repositorio

### **Problema 5: Build funciona local pero falla en GitHub Actions**

**Solución:** Revisar los logs completos en:
```
https://github.com/joshasigo/SGMI-Frontend/actions
```

Y verificar las variables de entorno en el workflow.

---

## 🔐 Configuración de GitHub Pages

### **Pasos para Verificar/Configurar:**

1. **Ve a Settings del repositorio:**
   ```
   https://github.com/joshasigo/SGMI-Frontend/settings/pages
   ```

2. **En "Build and deployment":**
   - **Source:** GitHub Actions ✅
   
   *(NO selecciones "Deploy from a branch")*

3. **Verifica que esté activo:**
   - Deberías ver: "Your site is live at https://joshasigo.github.io/SGMI-Frontend/"

---

## 📊 Monitoreo y Validación

### **Verificar Deployments:**

```
https://github.com/joshasigo/SGMI-Frontend/deployments
```

### **Ver Workflows en ejecución:**

```
https://github.com/joshasigo/SGMI-Frontend/actions
```

### **Revisar logs de un workflow:**

1. Click en el workflow
2. Click en "Build" o "Deploy"
3. Expande cada paso para ver detalles

---

## 📦 Estructura de Archivos Importantes

```
SGMI-Frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Workflow de CI/CD
├── public/
│   └── .nojekyll              ← Desactiva Jekyll
├── src/                        ← Código fuente
├── dist/                       ← Build (generado, no commitear)
├── vite.config.ts             ← Configuración de Vite
├── package.json               ← Dependencias y scripts
└── DEPLOYMENT_GITHUB_PAGES.md ← Esta documentación
```

### **Archivos a NO commitear:**

- `dist/` - Carpeta de build (generada automáticamente)
- `node_modules/` - Dependencias npm
- `.cache/` - Caché temporal

Estos ya están en `.gitignore`.

---

## 🎯 Checklist de Deployment

### **Antes del Primer Deployment:**

- [x] Repositorio creado en GitHub
- [x] Repositorio local conectado al remoto
- [x] `vite.config.ts` configurado con base correcto
- [x] Scripts de deploy en `package.json`
- [x] Workflow de GitHub Actions creado
- [x] GitHub Actions habilitado en el repositorio
- [x] GitHub Pages configurado con source "GitHub Actions"

### **Para Cada Deployment:**

- [ ] Cambios testeados localmente con `npm run dev`
- [ ] Build exitoso con `npm run build`
- [ ] Preview funciona con `npm run preview`
- [ ] Commit con mensaje descriptivo
- [ ] Push a la rama `main`
- [ ] Verificar que el workflow se ejecute sin errores
- [ ] Validar el sitio en producción

---

## 🚀 Mejoras Futuras

### **Optimizaciones Posibles:**

1. **Dominio Personalizado:**
   - Configurar un dominio custom en GitHub Pages
   - Actualizar el `base` en `vite.config.ts`

2. **Caché Mejorado:**
   - Implementar Service Workers
   - Configurar headers de caché

3. **Análisis:**
   - Integrar Google Analytics
   - Monitoreo de errores con Sentry

4. **Testing:**
   - Agregar tests unitarios
   - Ejecutar tests en el workflow antes del deploy

5. **Optimización de Build:**
   - Code splitting más agresivo
   - Lazy loading de componentes

---

## 📞 Contacto y Soporte

**Desarrollador:** Joshua Asigo  
**Repositorio:** https://github.com/joshasigo/SGMI-Frontend  
**Sitio Web:** https://joshasigo.github.io/SGMI-Frontend/

---

## 📜 Historial de Cambios

### **Versión 1.0.0 - Diciembre 2025**

- ✅ Configuración inicial de GitHub Pages
- ✅ Workflow de GitHub Actions implementado
- ✅ Fix de bug de Rollup en Linux
- ✅ Deployment automático funcional
- ✅ Documentación completa

---

## 🎉 ¡Proyecto Desplegado Exitosamente!

Tu aplicación SGMI está ahora:
- ✅ Desplegada en GitHub Pages
- ✅ Con deployment automático configurado
- ✅ Accesible públicamente
- ✅ Completamente documentada

**URL Final:** https://joshasigo.github.io/SGMI-Frontend/

---

*Documentación generada el 9 de diciembre de 2025*  
*Última actualización: Deployment exitoso con GitHub Actions*
