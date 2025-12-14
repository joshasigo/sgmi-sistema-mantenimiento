# 💻 Guía de Instalación por Sistema Operativo

> **Instrucciones específicas para Windows, macOS y Linux**

---

## 🪟 WINDOWS 10/11

### **Requisitos Previos**

1. **Descargar Node.js**
   - Visita: https://nodejs.org/ (versión LTS)
   - Descarga el instalador `.msi`
   - Ejecuta el instalador
   - Selecciona "Install for all users"
   - Marca "Add Node.js to PATH"
   - Completa la instalación
   - **Reinicia tu PC**

2. **Verificar Instalación**
   - Presiona `Windows + R`
   - Escribe `powershell` y presiona Enter
   - Ejecuta: `node --version` y `npm --version`
   - Deberías ver versiones (ej: `v20.10.0`)

### **Descargar Proyecto**

**Método 1: Con Git**
```powershell
# En PowerShell:
cd C:\Users\TuUsuario\Documents

git clone https://github.com/tuusuario/sgmi-proyecto.git

cd "SGMI DESARROLLO FRONTEND"
```

**Método 2: Sin Git (Manual)**
1. Ve a: https://github.com/tuusuario/sgmi-proyecto
2. Click verde "Code" → "Download ZIP"
3. Extrae el ZIP en `C:\Users\TuUsuario\Documents`
4. Abre PowerShell: `Windows + X` → PowerShell (Admin)
5. Navega: `cd "C:\Users\TuUsuario\Documents\SGMI DESARROLLO FRONTEND"`

### **Instalar y Ejecutar**

```powershell
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor
npm run dev

# 3. En navegador: http://localhost:5173
```

### **Accesos Rápidos Windows**

| Acción | Comando |
|--------|---------|
| Abrir PowerShell en carpeta | Shift + Click derecho → "Open PowerShell here" |
| Abrir VS Code | `code .` (en PowerShell dentro de la carpeta) |
| Detener servidor | `Ctrl + C` |
| Limpiar terminal | `clear` |
| Ver archivos | `ls` o `dir` |

### **Problema: "No se reconoce el término npm"**

Soluciones:
1. Reinicia PowerShell (cierra y abre de nuevo)
2. Si persiste, reinstala Node.js
3. Asegúrate de marcar "Add to PATH" en instalador

---

## 🍎 macOS

### **Requisitos Previos**

1. **Descargar Node.js**
   - Visita: https://nodejs.org/ (versión LTS)
   - Descarga el instalador `.pkg` para Mac
   - Ejecuta el instalador
   - Sigue los pasos (siguiente, siguiente, instalar)
   - **Reinicia la Terminal**

2. **Verificar Instalación**
   - Abre Terminal (Cmd + Espacio, escribe "Terminal")
   - Ejecuta: `node --version` y `npm --version`
   - Deberías ver versiones

### **Alternativa: Instalar con Homebrew (Recomendado)**

```bash
# 1. Si no tienes Homebrew, instala:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instala Node.js
brew install node

# 3. Verifica
node --version
npm --version
```

### **Descargar Proyecto**

**Método 1: Con Git**
```bash
cd ~/Documents

git clone https://github.com/tuusuario/sgmi-proyecto.git

cd "SGMI DESARROLLO FRONTEND"
```

**Método 2: Manual**
1. Ve a: https://github.com/tuusuario/sgmi-proyecto
2. Click "Code" (verde) → "Download ZIP"
3. Extrae en `~/Documents`
4. Abre Terminal en esa carpeta

### **Instalar y Ejecutar**

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor
npm run dev

# 3. En navegador: http://localhost:5173
```

### **Accesos Rápidos macOS**

| Acción | Comando |
|--------|---------|
| Abrir Terminal aquí | Right-click carpeta → "New Terminal at Folder" |
| Abrir VS Code | `code .` |
| Detener servidor | `Ctrl + C` |
| Ir a carpeta | `cd ~/Documents/SGMI...` |
| Listar archivos | `ls` |

### **Problema: "zsh: command not found: node"**

Soluciones:
1. Cierra y reabre Terminal
2. Si instalaste con Homebrew:
   ```bash
   brew link node
   ```
3. Verifica ruta: `which node`

---

## 🐧 LINUX (Ubuntu/Debian)

### **Requisitos Previos**

1. **Instalar Node.js**

```bash
# Actualizar paquetes
sudo apt update
sudo apt upgrade

# Instalar Node.js y npm
sudo apt install nodejs npm

# Verificar
node --version
npm --version
```

2. **Alternativa: NodeSource (Versión más reciente)**

```bash
# Descargar script setup
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar
sudo apt-get install -y nodejs
```

### **Descargar Proyecto**

**Método 1: Con Git**
```bash
cd ~/Documents

git clone https://github.com/tuusuario/sgmi-proyecto.git

cd "SGMI DESARROLLO FRONTEND"
```

**Método 2: Manual**
1. Ve a: https://github.com/tuusuario/sgmi-proyecto
2. Click "Code" → "Download ZIP"
3. Extrae en `~/Documents`
4. Abre Terminal

### **Instalar y Ejecutar**

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor
npm run dev

# 3. En navegador: http://localhost:5173
```

### **Accesos Rápidos Linux**

| Acción | Comando |
|--------|---------|
| Abrir Terminal aquí | Right-click → "Open Terminal Here" |
| Ir a carpeta home | `cd ~` |
| Ver carpeta actual | `pwd` |
| Listar archivos | `ls -la` |
| Editar archivo | `nano archivo.txt` |

### **Problema: Permisos Denegados**

```bash
# Si npm install falla:
sudo chown -R $USER:$USER .

# Luego intenta de nuevo
npm install
```

### **Linux: Compilar en Segundo Plano**

```bash
# Ejecutar en background (no bloquea terminal)
npm run dev &

# Para ver procesos
jobs

# Para traer al frente
fg
```

---

## 🚀 Compilar para Producción (Todos los SO)

### **Paso 1: Compilar**

```
# Windows PowerShell
npm run build

# macOS/Linux Terminal
npm run build
```

### **Paso 2: Ver Resultado**

Se crea carpeta `dist/` con:
- `index.html`
- `assets/` (archivos JS, CSS)

### **Paso 3: Previsualizar**

```
npm run preview
```

Accede a: `http://localhost:4173/`

---

## 📦 Instalar Git (Opcional pero Recomendado)

### **Windows**
1. Descarga: https://git-scm.com/
2. Ejecuta instalador `.exe`
3. Sigue pasos (siguiente, siguiente, instalar)
4. Reinicia PowerShell

### **macOS**
```bash
# Con Homebrew
brew install git

# Verifica
git --version
```

### **Linux**
```bash
sudo apt install git
git --version
```

---

## 🎯 Tabla Comparativa de Comandos

| Windows | macOS | Linux | Acción |
|---------|-------|-------|--------|
| `cd C:\Users\...` | `cd ~/` | `cd ~/` | Navegar carpeta |
| `dir` | `ls` | `ls` | Listar archivos |
| `cls` | `clear` | `clear` | Limpiar terminal |
| `del archivo` | `rm archivo` | `rm archivo` | Eliminar archivo |
| `code .` | `code .` | `code .` | Abrir VS Code |

---

## 📝 Scripts Disponibles (Todos los SO)

```bash
npm install         # Instalar dependencias
npm run dev         # Iniciar desarrollo
npm run build       # Compilar producción
npm run preview     # Ver build local
npm run lint        # Revisar código
```

---

## 🔧 Configuración Inicial Recomendada

### **1. Editor (VS Code)**

**Windows/macOS/Linux:**
```bash
# Descargar desde https://code.visualstudio.com/

# O instalar desde terminal:
# Windows: choco install vscode
# macOS: brew install visual-studio-code
# Linux: sudo apt install code
```

**Extensiones Recomendadas:**
1. "ES7+ React/Redux/React-Native snippets"
2. "Tailwind CSS IntelliSense"
3. "TypeScript Vue Plugin"
4. "Prettier - Code formatter"

### **2. Configurar Git (Opcional)**

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### **3. Archivo `.gitignore` (Ya incluido)**

El proyecto ya tiene esto, ignora:
- `node_modules/`
- `dist/`
- `.env`
- Archivos de sistema

---

## ✅ Verificación Final (Todos los SO)

Ejecuta esto para verificar que todo está bien:

```bash
# 1. Verifica Node.js
node --version

# 2. Verifica npm
npm --version

# 3. Navega a proyecto
cd "ruta/a/SGMI"

# 4. Verifica dependencias
npm list (debe mostrar lista larga)

# 5. Intenta compilar
npm run build

# 6. Si todo está verde = ¡LISTO!
```

---

## 🆘 Tabla de Troubleshooting

| Error | Windows | macOS | Linux |
|-------|---------|-------|-------|
| npm no funciona | Reinstala Node.js | Reinicia Terminal | `brew link node` |
| Puerto ocupado | `npm run dev -- --port 3000` | `npm run dev -- --port 3000` | Idem |
| Permisos denegados | Ejecutar como Admin | N/A | `sudo chown` |
| Cambios no se ven | `Ctrl+Shift+R` | `Cmd+Shift+R` | `Ctrl+Shift+R` |

---

**Última actualización:** 2025-11-30  
**Compatibilidad:** Windows 10/11, macOS 10.15+, Ubuntu 20.04+  
**Status:** ✅ Completo
