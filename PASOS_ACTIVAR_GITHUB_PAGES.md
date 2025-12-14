# 🚀 Pasos para Activar GitHub Pages

## ✅ Estado Actual
- ✅ Proyecto configurado con `base: '/SGMI-Frontend/'`
- ✅ Workflows de GitHub Actions creados
- ✅ Build funciona correctamente
- ✅ Todos los cambios están en GitHub

---

## 📋 Pasos para Activar (SIGUE ESTOS PASOS AHORA)

### **1️⃣ Abre la Configuración de GitHub Pages**

Ve a esta URL en tu navegador:
```
https://github.com/joshasigo/SGMI-Frontend/settings/pages
```

### **2️⃣ Configura el Source**

En la sección **"Build and deployment"**:

- **Source:** Selecciona **"GitHub Actions"**
  
  *(NO selecciones "Deploy from a branch")*

### **3️⃣ Guarda los Cambios**

GitHub Pages se activará automáticamente.

### **4️⃣ Espera el Deployment**

1. Ve a la pestaña **Actions** de tu repositorio:
   ```
   https://github.com/joshasigo/SGMI-Frontend/actions
   ```

2. Verás un workflow ejecutándose (icono amarillo 🟡)

3. Espera 1-2 minutos hasta que aparezca el check verde ✅

### **5️⃣ Accede a tu Sitio Web**

Tu aplicación estará disponible en:
```
https://joshasigo.github.io/SGMI-Frontend/
```

---

## 🔄 Deployments Futuros

### **Automático:**
Cada vez que hagas `git push origin main`, el sitio se actualizará automáticamente.

### **Manual desde terminal:**
```powershell
npm run deploy
```

Esto usará `gh-pages` para desplegar directamente.

---

## 🐛 Si algo no funciona

### **Problema: No aparece la opción "GitHub Actions"**

**Solución:**
1. Ve a `Settings` → `Actions` → `General`
2. En **"Actions permissions"**, selecciona: **"Allow all actions and reusable workflows"**
3. En **"Workflow permissions"**, selecciona: **"Read and write permissions"**
4. Marca: ☑ **"Allow GitHub Actions to create and approve pull requests"**
5. Guarda y regresa a la configuración de Pages

### **Problema: Página en blanco**

**Verificar:**
- El `base` en `vite.config.ts` debe ser: `base: '/SGMI-Frontend/'`
- El nombre del repositorio debe coincidir exactamente

### **Problema: Error 404 en assets**

**Ya está solucionado** con la configuración de `base` en Vite.

---

## 📊 Verificar el Estado

### **Ver workflows activos:**
```
https://github.com/joshasigo/SGMI-Frontend/actions
```

### **Ver deployment actual:**
```
https://github.com/joshasigo/SGMI-Frontend/deployments
```

---

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| **Configuración de Pages** | https://github.com/joshasigo/SGMI-Frontend/settings/pages |
| **GitHub Actions** | https://github.com/joshasigo/SGMI-Frontend/actions |
| **Tu Sitio Web** | https://joshasigo.github.io/SGMI-Frontend/ |
| **Repositorio** | https://github.com/joshasigo/SGMI-Frontend |

---

## ✅ Checklist Final

- [ ] Abrí la configuración de Pages
- [ ] Seleccioné "GitHub Actions" como Source
- [ ] El workflow se ejecutó sin errores
- [ ] Mi sitio está visible en: https://joshasigo.github.io/SGMI-Frontend/

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación SGMI estará desplegada y accesible públicamente en GitHub Pages.

**¿Necesitas ayuda?** Revisa la pestaña Actions para ver logs detallados.
