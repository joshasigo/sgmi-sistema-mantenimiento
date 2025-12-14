# 🚀 Guía de Despliegue en GitHub Pages

## 📋 Resumen de Cambios Realizados

Se han configurado los siguientes archivos para permitir el despliegue automático en GitHub Pages:

### ✅ Archivos Modificados/Creados:

1. **`vite.config.ts`** - Agregado `base: '/SGMI-Frontend/'`
2. **`package.json`** - Agregados scripts de deploy y dependencia `gh-pages`
3. **`.github/workflows/deploy.yml`** - Workflow de GitHub Actions
4. **`public/.nojekyll`** - Evita procesamiento Jekyll en GitHub Pages

---

## 🔧 Pasos para Desplegar

### **Opción 1: Despliegue Automático (Recomendado) ✨**

El proyecto ya está configurado con GitHub Actions. Cada vez que hagas push a `main`, se desplegará automáticamente.

#### **Pasos:**

1. **Instalar dependencias actualizadas:**
   ```powershell
   npm install
   ```

2. **Commit y push de los cambios:**
   ```powershell
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Habilitar GitHub Pages en tu repositorio:**
   - Ve a: `https://github.com/joshasigo/SGMI-Frontend/settings/pages`
   - En **Source**, selecciona: **GitHub Actions**
   - Guarda los cambios

4. **Espera a que se complete el deployment** (1-2 minutos)
   - Ve a la pestaña **Actions** en tu repositorio
   - Verás el workflow ejecutándose

5. **Accede a tu sitio:**
   ```
   https://joshasigo.github.io/SGMI-Frontend/
   ```

---

### **Opción 2: Despliegue Manual con gh-pages 🔧**

Si prefieres desplegar manualmente desde tu terminal:

1. **Instalar dependencias:**
   ```powershell
   npm install
   ```

2. **Ejecutar el script de deploy:**
   ```powershell
   npm run deploy
   ```

3. **Habilitar GitHub Pages:**
   - Ve a: `https://github.com/joshasigo/SGMI-Frontend/settings/pages`
   - En **Source**, selecciona: **Deploy from a branch**
   - En **Branch**, selecciona: **gh-pages** / **(root)**
   - Guarda los cambios

4. **Accede a tu sitio:**
   ```
   https://joshasigo.github.io/SGMI-Frontend/
   ```

---

## 🛠️ Configuración Técnica

### **`vite.config.ts`**
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/SGMI-Frontend/', // ← Importante: nombre del repo
  server: {
    port: 5173,
    open: true
  }
})
```

### **Scripts en `package.json`**
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "npm run build && gh-pages -d dist"
}
```

---

## 📊 Verificación

### **Verificar que el build funciona localmente:**

1. **Construir el proyecto:**
   ```powershell
   npm run build
   ```

2. **Preview local:**
   ```powershell
   npm run preview
   ```

3. **Abrir en navegador:**
   ```
   http://localhost:4173/SGMI-Frontend/
   ```

---

## 🐛 Troubleshooting

### **Problema: Página en blanco después del deployment**

**Solución:** Verifica que `base` en `vite.config.ts` coincida con el nombre del repositorio:
```typescript
base: '/SGMI-Frontend/', // Debe coincidir con el nombre del repo
```

### **Problema: Assets (CSS/JS) no cargan (404)**

**Causa:** Rutas absolutas en lugar de relativas.

**Solución:** El `base` en `vite.config.ts` soluciona esto automáticamente.

### **Problema: GitHub Actions falla**

**Solución:** 
1. Ve a **Settings → Actions → General**
2. En **Workflow permissions**, selecciona: **Read and write permissions**
3. Guarda y vuelve a ejecutar el workflow

### **Problema: "Page not found" en GitHub Pages**

**Solución:**
1. Verifica que GitHub Pages esté habilitado
2. Si usas GitHub Actions, selecciona **GitHub Actions** como source
3. Si usas `gh-pages`, selecciona la rama **gh-pages**

---

## 🔄 Workflow de Desarrollo

### **Desarrollo Local:**
```powershell
npm run dev
```
→ Abre: `http://localhost:5173`

### **Build de Producción:**
```powershell
npm run build
```
→ Genera carpeta `dist/`

### **Preview Local del Build:**
```powershell
npm run preview
```
→ Abre: `http://localhost:4173/SGMI-Frontend/`

### **Deploy a GitHub Pages:**
```powershell
# Opción 1: Automático (push a main)
git push origin main

# Opción 2: Manual
npm run deploy
```

---

## 📦 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `vite.config.ts` | Configuración de Vite con `base` para GitHub Pages |
| `.github/workflows/deploy.yml` | GitHub Actions para CI/CD automático |
| `public/.nojekyll` | Desactiva Jekyll en GitHub Pages |
| `dist/` | Carpeta de build (generada, no commitear) |

---

## 🎯 URLs del Proyecto

- **Repositorio:** https://github.com/joshasigo/SGMI-Frontend
- **GitHub Pages:** https://joshasigo.github.io/SGMI-Frontend/
- **Diseño Figma:** https://www.figma.com/design/9PCTgEDBWatsuCDxolLL9Z/Proyecto-SGMI

---

## ✅ Checklist Final

- [ ] Instaladas todas las dependencias (`npm install`)
- [ ] Build exitoso (`npm run build`)
- [ ] Preview local funciona (`npm run preview`)
- [ ] Cambios commiteados y pusheados a GitHub
- [ ] GitHub Pages habilitado en Settings
- [ ] GitHub Actions configurado correctamente
- [ ] Sitio accesible en: https://joshasigo.github.io/SGMI-Frontend/

---

## 🎉 ¡Listo!

Tu proyecto SGMI ahora está configurado para desplegarse automáticamente en GitHub Pages cada vez que hagas push a la rama `main`.

**Cualquier cambio futuro:**
1. Desarrolla localmente con `npm run dev`
2. Commit y push a GitHub
3. GitHub Actions desplegará automáticamente

---

**Desarrollado por:** Joshua Asigo  
**Proyecto:** SGMI - Sistema de Gestión de Mantenimiento Industrial  
**Fecha:** Diciembre 2025
