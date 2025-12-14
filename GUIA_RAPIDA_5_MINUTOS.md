# 🖥️ Guía Paso a Paso - Primeras 5 Minutos

> **Cómo tener la app SGMI funcionando en 5 minutos en tu computadora**

---

## ✨ Versión Rápida (TL;DR)

Si solo quieres que funcione, sigue esto:

### **Windows PowerShell / CMD**
```powershell
# 1. Abre PowerShell o CMD

# 2. Ve a la carpeta del proyecto
cd "C:\ruta\a\SGMI DESARROLLO FRONTEND"

# 3. Instala dependencias
npm install

# 4. Inicia el servidor
npm run dev

# 5. Abre en el navegador: http://localhost:5173
```

### **macOS Terminal**
```bash
# 1. Abre Terminal

# 2. Ve a la carpeta
cd /ruta/a/SGMI\ DESARROLLO\ FRONTEND

# 3. Instala dependencias
npm install

# 4. Inicia el servidor
npm run dev

# 5. Abre en navegador: http://localhost:5173
```

### **Linux Terminal**
```bash
# Igual que macOS
cd /ruta/a/SGMI\ DESARROLLO\ FRONTEND
npm install
npm run dev
# Luego: http://localhost:5173
```

---

## 🎯 Guía Visual Completa

### **PASO 1: Verificar Node.js Instalado**

**Windows:**
1. Abre PowerShell (Windows + X, escribe "PowerShell")
2. Ejecuta:
   ```powershell
   node --version
   npm --version
   ```
3. Deberías ver versiones como `v20.10.0` y `10.2.3`

**Si NO aparecen versiones:**
- Descarga Node.js desde https://nodejs.org/
- Instala con las opciones por defecto
- Reinicia PowerShell

---

### **PASO 2: Descargar el Proyecto**

**Opción A: Con Git**
```powershell
cd C:\Users\tu-usuario\Documents

git clone <URL-DEL-REPO>

cd "SGMI DESARROLLO FRONTEND"
```

**Opción B: Descargar ZIP**
1. Ve a GitHub/tu plataforma
2. Click "Code" → "Download ZIP"
3. Extrae en `C:\Users\tu-usuario\Documents`
4. Abre PowerShell en esa carpeta (Shift + Click derecho → "Open PowerShell here")

---

### **PASO 3: Instalar Dependencias**

Ejecuta en PowerShell:
```powershell
npm install
```

**Verás esto:**
```
added 244 packages in 2m 34s
```

**Toma 2-5 minutos dependiendo del internet**

---

### **PASO 4: Iniciar Servidor de Desarrollo**

```powershell
npm run dev
```

**Verás algo como esto:**
```
  VITE v5.4.21  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

### **PASO 5: Abrir en Navegador**

1. Abre Chrome, Firefox, Edge o Safari
2. Ve a: `http://localhost:5173/`
3. ¡Deberías ver la app SGMI! 🎉

---

## 🔧 Acciones Comunes

### **Editar Código**

1. Abre VS Code en la carpeta del proyecto
2. Edita cualquier archivo en `src/`
3. **Automáticamente se actualiza en el navegador** ✨

**Ejemplo:**
- Abre `src/components/LandingPage.tsx`
- Cambia algún texto
- Guarda (Ctrl + S)
- En el navegador: cambio aparece al instante

### **Detener el Servidor**

En PowerShell:
```powershell
Ctrl + C
```

Verás:
```
Terminate batch job (Y/N)? Y
```

---

## 🏗️ Compilar para Producción

Cuando termines de desarrollar:

```powershell
npm run build
```

Esto crea una carpeta `dist/` con:
- Código optimizado
- Archivos minificados
- Listo para subir a servidor

**Para ver cómo se verá:**
```powershell
npm run preview
```

Luego accede a: `http://localhost:4173/`

---

## 🌐 Subir a Internet

### **Opción 1: Netlify (Más Fácil - SIN CÓDIGO)**

1. Ve a https://netlify.com
2. Clic "Sign up" (usa GitHub es más fácil)
3. Autoriza Netlify
4. Clic "New site from Git"
5. Selecciona tu repositorio
6. Rellena:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Clic "Deploy"

**¡Listo!** Tu app estará en una URL como:
```
https://tu-app-sgmi.netlify.app
```

### **Opción 2: Vercel (Alternativa)**

Similar a Netlify, pero desde https://vercel.com

### **Opción 3: Servidor Propio**

Si tienes servidor (VPS, hosting):
1. Compila: `npm run build`
2. Descarga carpeta `dist/`
3. Sube a tu servidor
4. Configura servidor web (Nginx/Apache)

Ver `GUIA_DEPLOYMENT_INSTALACION.md` para detalles

---

## ⚠️ Problemas Comunes

### **"npm: command not found"**
```
❌ Node.js no está instalado
✅ Descarga de https://nodejs.org/
✅ Reinstala PowerShell después
```

### **"Port 5173 already in use"**
```powershell
# Opción 1: Usar puerto diferente
npm run dev -- --port 3000

# Opción 2: Cerrar otros procesos
```

### **Pantalla en blanco en navegador**
```powershell
# Solución:
Ctrl + Shift + R  (en el navegador para limpiar caché)
```

### **Errores de instalación**
```powershell
npm cache clean --force
rm -r node_modules (o borrar carpeta manualmente)
rm package-lock.json
npm install
```

---

## 📋 Credenciales de Demo

Una vez abierta la app:

**Landing Page:**
- Click en botón "Comenzar"

**Login:**
- Email: `admin@sgmi.com`
- Contraseña: `demo123`

O usa:
- Email: `usuario@sgmi.com`
- Contraseña: `demo123`

---

## 🎓 Próximos Pasos

Una vez todo funciona:

1. **Explora la app**
   - Navega entre secciones
   - Ve los datos mock
   - Prueba el logout

2. **Edita componentes**
   - Abre `src/components/Dashboard.tsx`
   - Cambia algo
   - Ve el cambio en tiempo real

3. **Agrega funcionalidades**
   - Implementa búsqueda real
   - Agrega botones con acciones
   - Conecta a API backend

4. **Despliega**
   - Crea build: `npm run build`
   - Sube a Netlify/Vercel
   - ¡Comparte tu URL!

---

## 📞 Soporte Rápido

| Problema | Solución |
|----------|----------|
| Node.js no funciona | Reinstala desde nodejs.org |
| npm install lento | Usa `npm install --legacy-peer-deps` |
| Puertos en uso | Cambia puerto: `npm run dev -- --port 3000` |
| Cambios no se ven | Limpia caché: `Ctrl+Shift+R` en navegador |
| Error de carpetas | Usa `cd` con comillas: `cd "Mi Carpeta"` |

---

## ✅ Checklist Rápido

- [ ] Node.js instalado (`node --version` funciona)
- [ ] Proyecto descargado
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` iniciado
- [ ] Navegador muestra app en `http://localhost:5173`
- [ ] Login funciona con credenciales demo
- [ ] Puedes navegar entre secciones

**Si todos los puntos están ✅ = ¡ÉXITO!** 🚀

---

**Tiempo estimado:** 5-10 minutos  
**Dificultad:** ⭐ Muy Fácil  
**Requisitos:** Solo Node.js + navegador
