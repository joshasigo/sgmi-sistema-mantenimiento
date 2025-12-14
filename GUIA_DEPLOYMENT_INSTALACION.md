# 🚀 Guía de Deployment e Instalación - SGMI

> **Sistema de Gestión de Mantenimiento Industrial**  
> Frontend desarrollado en **React 18** + **TypeScript** + **Vite**

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#-requisitos-previos)
2. [Instalación en Desarrollo Local](#-instalación-en-desarrollo-local)
3. [Configuración del Proyecto](#-configuración-del-proyecto)
4. [Ejecutar en Desarrollo](#-ejecutar-en-desarrollo)
5. [Compilación para Producción](#-compilación-para-producción)
6. [Deployment en Servidores](#-deployment-en-servidores)
7. [Troubleshooting](#-troubleshooting)
8. [Variables de Entorno](#-variables-de-entorno)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### **Windows / macOS / Linux**

#### 1. **Node.js (Recomendado: v18+ o v20+)**
   - Descarga desde: https://nodejs.org/
   - Verificar instalación:
     ```powershell
     node --version
     npm --version
     ```
   - Debe mostrar versiones similares a:
     ```
     v20.x.x
     10.x.x (npm)
     ```

#### 2. **Git** (Opcional, pero recomendado)
   - Descarga desde: https://git-scm.com/
   - Verificar instalación:
     ```powershell
     git --version
     ```

#### 3. **Un Editor de Código**
   - **VS Code** (Recomendado): https://code.visualstudio.com/
   - O cualquier editor de tu preferencia (WebStorm, Sublime Text, etc.)

---

## 📦 Instalación en Desarrollo Local

### **Paso 1: Descargar el Proyecto**

**Opción A - Usando Git (Recomendado):**
```powershell
git clone <URL-DEL-REPOSITORIO>
cd "SGMI DESARROLLO FRONTEND"
```

**Opción B - Descargar ZIP:**
1. Descarga el archivo ZIP del proyecto
2. Extrae en tu carpeta deseada
3. Abre PowerShell o Command Prompt en esa carpeta

### **Paso 2: Navegar a la Carpeta del Proyecto**

```powershell
# Windows PowerShell
cd "C:\ruta\a\SGMI DESARROLLO FRONTEND"

# macOS/Linux Terminal
cd /ruta/a/SGMI\ DESARROLLO\ FRONTEND
```

### **Paso 3: Instalar Dependencias**

```powershell
npm install
```

**¿Qué sucede?**
- Se crea una carpeta `node_modules/` con todas las librerías
- Se genera archivo `package-lock.json` (no modificar)
- Toma de 2-5 minutos dependiendo de tu velocidad de internet

**Si hay errores de instalación:**
```powershell
# Limpiar caché y reinstalar
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

---

## ⚙️ Configuración del Proyecto

### **Estructura de Carpetas**

```
SGMI DESARROLLO FRONTEND/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Dashboard.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OrdenesTrabajoSection.tsx
│   │   ├── ui/              # Componentes de shadcn/ui
│   │   └── figma/
│   ├── styles/              # Estilos CSS
│   │   ├── globals.css
│   │   └── index.css
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada React
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── node_modules/            # Dependencias (generado)
├── dist/                    # Build producción (generado)
├── package.json             # Configuración y dependencias
├── tsconfig.json            # Configuración TypeScript
├── vite.config.ts           # Configuración Vite
├── tailwind.config.js       # Configuración Tailwind CSS
└── postcss.config.js        # Configuración PostCSS
```

### **package.json - Scripts Disponibles**

Abre `package.json` y encontrarás los siguientes scripts:

```json
{
  "scripts": {
    "dev": "vite",                          // Desarrollo local
    "build": "tsc && vite build",           // Compilar producción
    "preview": "vite preview",              // Ver build localmente
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives" // Revisar código
  }
}
```

---

## 🏃 Ejecutar en Desarrollo

### **Inicia el Servidor de Desarrollo**

```powershell
npm run dev
```

**Resultado esperado:**
```
VITE v5.4.21  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### **Acceder a la Aplicación**

1. Abre tu navegador web (Chrome, Firefox, Edge, Safari)
2. Ve a: `http://localhost:5173/`
3. Deberías ver la página de **Landing Page** del SGMI

### **Desarrollo en Vivo (Hot Reload)**

- **Cualquier cambio** que hagas en los archivos se refleja **automáticamente** en el navegador
- No necesitas reiniciar el servidor
- Presiona `Ctrl + Shift + R` en el navegador si algo se ve raro

### **Detener el Servidor**

En PowerShell/Terminal:
```powershell
Ctrl + C
```

---

## 🏗️ Compilación para Producción

### **Crear el Build Optimizado**

```powershell
npm run build
```

**¿Qué sucede?**
- Se crea carpeta `dist/` con archivos compilados y optimizados
- Se minifica el código
- Se generan archivos estáticos listos para servir
- Toma 1-2 minutos

**Resultado esperado:**
```
✓ built in 12.34s

dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── ...
```

### **Vista Previa del Build**

```powershell
npm run preview
```

Accede a: `http://localhost:4173/` para ver cómo se verá en producción

---

## 🌐 Deployment en Servidores

### **Opción 1: Netlify (RECOMENDADO - Más Fácil)**

**Paso 1: Crear Cuenta**
- Ve a https://netlify.com
- Regístrate con GitHub, GitLab, o email

**Paso 2: Conectar Repositorio**
- Click en "New site from Git"
- Selecciona tu repositorio
- Autoriza Netlify

**Paso 3: Configurar Build**
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- Click en "Deploy site"

**Listo!** Tu app estará disponible en una URL de Netlify (ej: `https://sgmi-app.netlify.app`)

---

### **Opción 2: Vercel**

**Paso 1: Instalar Vercel CLI**
```powershell
npm install -g vercel
```

**Paso 2: Deploy**
```powershell
vercel
```

Sigue las instrucciones interactivas

---

### **Opción 3: GitHub Pages (Gratis)**

**Resumen:** esta guía ya está configurada para publicar el sitio en GitHub Pages usando `gh-pages` o mediante el workflow de GitHub Actions.

1) Configuración aplicada en este repositorio

- `vite.config.ts`: se estableció `base: '/SGMI-Frontend/'` (ajusta si tu repo tiene otro nombre).
- `package.json`: se añadieron los scripts `predeploy` (construye) y `deploy` (publica usando `gh-pages`).
- Workflow: existe `.github/workflows/deploy-gh-pages.yml` que construye y publica `dist/` a GitHub Pages al hacer push en `main`.

2) Pasos para desplegar (localmente) — PowerShell

```powershell
cd "c:\Users\josha\Desktop\Trabajos Carrera Ing desarrollo de Software IBERO\Proyecto de software 2025-2\proyecto sgmi\SGMI DESARROLLO FRONTEND WED DESPLIEGUE 2"
npm install
# Construir
npm run build
# Desplegar manualmente con gh-pages (opcional)
npm run deploy
```

3) Despliegue automático con GitHub Actions

- Haz commit y push a la rama `main`:

```powershell
git add .
git commit -m "Configurar despliegue a GitHub Pages"
git push origin main
```

- La acción en `.github/workflows/deploy-gh-pages.yml` ejecutará `npm ci`, `npm run build` y publicará `./dist` en la rama `gh-pages`. GitHub Pages servirá el contenido desde esa rama y la URL será:

`https://<tu-usuario>.github.io/SGMI-Frontend/`

4) Verificar en GitHub

- En el repositorio en GitHub, ve a `Settings` → `Pages`. Si usas el workflow `peaceiris/actions-gh-pages`, la rama `gh-pages` será creada automáticamente; la sección Pages mostrará la URL pública.
- Si la URL no aparece inmediatamente, espera unos minutos y revisa la pestaña `Actions` para ver la ejecución y posibles errores.

5) Notas y ajustes

- Si tu repositorio tiene otro nombre, actualiza `base` en `vite.config.ts` y repite `npm run build` antes de desplegar.
- Si quieres un dominio personalizado, configura `CNAME` en `dist/` o ajusta desde la sección Pages en GitHub.
- `gh-pages` ya fue agregado como dependencia de desarrollo; si prefieres no usar el workflow, `npm run deploy` publicará la carpeta `dist` en la rama `gh-pages`.


---

### **Opción 4: Servidor Tradicional (Apache, Nginx, IIS)**

#### **Con Nginx:**

**1. Copiar archivos compilados**
```bash
scp -r dist/* usuario@servidor:/var/www/sgmi/
```

**2. Configurar Nginx (`/etc/nginx/sites-available/sgmi`)**
```nginx
server {
    listen 80;
    server_name tudominio.com;
    root /var/www/sgmi;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**3. Habilitar sitio**
```bash
sudo ln -s /etc/nginx/sites-available/sgmi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **Con Apache:**

**1. Copiar archivos**
```bash
scp -r dist/* usuario@servidor:/var/www/html/sgmi/
```

**2. Crear `.htaccess` en `dist/`**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /sgmi/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /sgmi/index.html [L]
</IfModule>
```

**3. Habilitar mod_rewrite**
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### **Con IIS (Windows Server):**

1. Copiar carpeta `dist` a `C:\inetpub\wwwroot\sgmi`
2. Crear regla de rewrite en IIS Manager:
   - Agregar regla "Blank rule"
   - Pattern: `.*`
   - Rewrite URL: `index.html`
   - Stop processing: ✓

---

### **Opción 5: Docker (Contenedor)**

**Crear `Dockerfile`:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Crear `.dockerignore`:**
```
node_modules
dist
.git
.env
```

**Compilar y ejecutar:**
```powershell
# Compilar imagen
docker build -t sgmi-app .

# Ejecutar contenedor
docker run -p 3000:3000 sgmi-app
```

Accede a: `http://localhost:3000`

---

## 🆘 Troubleshooting

### **Problema: "node: command not found"**
```powershell
# Solución: Node.js no está instalado
# Descarga desde https://nodejs.org/ e instala
```

### **Problema: "npm ERR! code ENOENT"**
```powershell
# Solución: Borrar y reinstalar
npm cache clean --force
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

### **Problema: "Port 5173 already in use"**
```powershell
# Solución 1: Usar puerto diferente
npm run dev -- --port 3000

# Solución 2: Matar proceso usando puerto
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### **Problema: CORS errors en consola**
- Esto es normal en desarrollo local
- En producción desaparece cuando ambos servidores estén en el mismo dominio

### **Problema: Estilos no cargan correctamente**
```powershell
# Solución: Limpiar navegador
Ctrl + Shift + Delete  # Chrome/Edge
Cmd + Shift + Delete   # macOS Safari

# O en modo incógnito/privado
```

---

## 🔐 Variables de Entorno

### **Crear archivo `.env`** (en la raíz del proyecto)

```env
# API Backend (cuando esté listo)
VITE_API_URL=http://localhost:3000/api

# Entorno
VITE_ENV=development

# Figma
VITE_FIGMA_PROJECT=https://www.figma.com/design/9PCTgEDBWatsuCDxolLL9Z/Proyecto-SGMI
```

### **Crear archivo `.env.production`** (para producción)

```env
VITE_API_URL=https://api.tudominio.com
VITE_ENV=production
```

### **Usar Variables en el Código**

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);
```

---

## 📝 Checklist de Deployment

- [ ] Node.js v18+ instalado
- [ ] Repositorio clonado o descargado
- [ ] `npm install` ejecutado correctamente
- [ ] `npm run dev` funciona en desarrollo
- [ ] Todos los cambios están listos
- [ ] `npm run build` compila sin errores
- [ ] Build previewado con `npm run preview`
- [ ] Archivos `dist/` listos para subir
- [ ] Servidor/hosting configurado
- [ ] Dominio apuntando al servidor
- [ ] SSL/HTTPS configurado (en producción)
- [ ] Caché del navegador limpiado

---

## 🔄 Workflow Recomendado

### **Para Desarrollo**
```powershell
# 1. Instalar dependencias (primera vez)
npm install

# 2. Iniciar servidor
npm run dev

# 3. Realizar cambios en src/
# 4. Ver cambios en tiempo real

# 5. Cuando termines
Ctrl + C
```

### **Para Producción**
```powershell
# 1. Preparar cambios
git add .
git commit -m "Cambios para producción"
git push origin main

# 2. Compilar
npm run build

# 3. Subir carpeta dist/ a servidor
# 4. Verificar en navegador
```

---

## 📚 Recursos Útiles

- **Documentación Vite:** https://vitejs.dev/
- **Documentación React:** https://react.dev/
- **Documentación TypeScript:** https://www.typescriptlang.org/
- **Tailwind CSS:** https://tailwindcss.com/
- **shadcn/ui:** https://ui.shadcn.com/
- **Figma (Diseño Original):** https://www.figma.com/design/9PCTgEDBWatsuCDxolLL9Z/Proyecto-SGMI

---

## ✅ Configuración Completada

Una vez sigas esta guía, tendrás:

✅ App ejecutándose en desarrollo  
✅ Code con hot reload funcional  
✅ Build optimizado para producción  
✅ Listo para deploy en cualquier servidor  
✅ Variables de entorno configuradas  

**¡Felicidades! 🎉 Tu SGMI está listo para desplegarse.**

---

**Última actualización:** 2025-11-30  
**Versión:** 1.0  
**Status:** ✅ Documentación Completa
