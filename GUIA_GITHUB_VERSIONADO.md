# 🚀 Guía: Subir Proyecto SGMI a GitHub

> **Cómo subir tu proyecto a GitHub, mantener versionado y colaborar**

---

## 📋 Paso a Paso (Recomendado para Principiantes)

### **PASO 1: Crear Repositorio en GitHub**

1. Ve a https://github.com/new
2. Rellena los campos:
   - **Repository name:** `SGMI-Frontend` (o el nombre que prefieras)
   - **Description:** `Sistema de Gestión de Mantenimiento Industrial - Frontend en React/Figma`
   - **Visibility:** Elige:
     - `Public` si quieres que todos vean
     - `Private` si es solo para ti
3. **NO marques** "Initialize with README" (ya tienes uno)
4. **NO marques** "Add .gitignore" (ya lo tenemos)
5. Click en "Create repository"

**Resultado:** GitHub te mostrará una URL como:
```
https://github.com/tu-usuario/SGMI-Frontend.git
```

---

### **PASO 2: Inicializar Git Localmente**

En PowerShell, navega a la carpeta del proyecto:

```powershell
cd "C:\Users\tu-usuario\Desktop\Trabajos Carrera Ing desarrollo de Software IBERO\Proyecto de software 2025-2\proyecto sgmi\SGMI DESARROLLO FRONTEND"
```

Luego ejecuta:

```powershell
# Inicializar Git
git init

# Configurar tu nombre y email (importante!)
git config user.name "Tu Nombre Completo"
git config user.email "tu@email.com"

# Verificar configuración
git config --list
```

**Debe mostrar:**
```
user.name=Tu Nombre Completo
user.email=tu@email.com
```

---

### **PASO 3: Agregar el Remote (Conexión a GitHub)**

Reemplaza la URL con la que GitHub te dio en Paso 1:

```powershell
git remote add origin https://github.com/tu-usuario/SGMI-Frontend.git
```

Verifica:
```powershell
git remote -v
```

**Debe mostrar:**
```
origin  https://github.com/tu-usuario/SGMI-Frontend.git (fetch)
origin  https://github.com/tu-usuario/SGMI-Frontend.git (push)
```

---

### **PASO 4: Crear Primer Commit**

```powershell
# Ver qué archivos se van a agregar
git status

# Agregar todos los archivos
git add .

# Crear commit con mensaje
git commit -m "Commit inicial: SGMI Frontend - React + TypeScript + Figma"
```

**Verás algo como:**
```
[main (root-commit) abc1234] Commit inicial: SGMI Frontend...
 50 files changed, 5000 insertions(+)
```

---

### **PASO 5: Subir a GitHub**

```powershell
# Subir rama main a GitHub
git branch -M main
git push -u origin main
```

**¡IMPORTANTE!** La primera vez te pedirá credenciales. Opciones:

#### **Opción A: SSH (Recomendado)**
```powershell
# Si GitHub pide SSH key
git push -u origin main
# Seguir las instrucciones de GitHub
```

#### **Opción B: HTTPS con Token Personal**
1. Ve a https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Dale nombre: `git-push-token`
4. Selecciona: `repo` (todos los permisos)
5. Click "Generate token"
6. **Copia el token** (solo aparece una vez)
7. Cuando PowerShell pida contraseña, **pega el token**

#### **Opción C: Guardar Credenciales**
```powershell
git config --global credential.helper store
# Próxima vez que hagas push, se guardan automáticamente
```

---

## ✅ ¡Completado!

Tu proyecto está en GitHub. Verifica:
1. Ve a https://github.com/tu-usuario/SGMI-Frontend
2. Deberías ver todos tus archivos
3. Los commits en la pestaña "Commits"

---

## 📝 Versionado (Para Futuro)

### **Cada vez que hagas cambios:**

```powershell
# Ver cambios
git status

# Agregar cambios específicos o todos
git add .

# Crear commit con descripción
git commit -m "Descripción de cambios: Arreglé button, agregué login"

# Subir a GitHub
git push
```

---

## 🏷️ Crear Versiones/Tags

Para marcar versiones importantes:

```powershell
# Crear tag (versión)
git tag -a v1.0.0 -m "Versión inicial - Sistema completo funcionando"

# Subir tags a GitHub
git push origin --tags

# Ver todos los tags
git tag -l
```

En GitHub aparecerá en "Releases"

---

## 🔄 Comando Rápido (Después de Paso 5)

Copia esto para futuro:

```powershell
# Cambios
git add .
git commit -m "Tu mensaje aquí"
git push
```

---

## 🛠️ Alternativa: Si Ya Tienes Repositorio

Si ya creaste el repositorio con archivos:

```powershell
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/SGMI-Frontend.git

# 2. Copiar archivos SGMI a esa carpeta (no el .git)

# 3. Subir
git add .
git commit -m "Inicial"
git push
```

---

## 📚 Comandos Útiles

| Comando | Qué hace |
|---------|----------|
| `git status` | Ver cambios pendientes |
| `git log --oneline` | Ver historial de commits |
| `git diff` | Ver diferencias en código |
| `git branch` | Ver ramas |
| `git branch mi-rama` | Crear nueva rama |
| `git checkout mi-rama` | Cambiar de rama |
| `git pull` | Bajar cambios de GitHub |
| `git push` | Subir cambios a GitHub |

---

## 🎯 Buenas Prácticas de Commits

**❌ Malo:**
```
git commit -m "cambios"
git commit -m "fix"
git commit -m "actualizado"
```

**✅ Bueno:**
```
git commit -m "Fix: Arreglé responsive en mobile"
git commit -m "Feature: Agregué búsqueda en órdenes"
git commit -m "Docs: Actualicé guía de deployment"
```

**Formato recomendado:**
```
<tipo>: <descripción corta>

<descripción detallada opcional>
```

**Tipos comunes:**
- `Feature:` - Nueva funcionalidad
- `Fix:` - Corrección de bug
- `Docs:` - Cambios en documentación
- `Style:` - Cambios de formato/estilos
- `Refactor:` - Reorganización de código
- `Test:` - Cambios en tests
- `Chore:` - Cambios en herramientas/config

---

## 🤝 Colaborar en GitHub

Si quieres invitar a otros:

1. Ve a tu repositorio
2. Settings → Collaborators
3. Click "Add people"
4. Ingresa el username de GitHub de la persona
5. Click "Add"

---

## 📦 Estructura Recomendada en GitHub

Tu repositorio debería tener:

```
SGMI-Frontend/
├── src/
│   ├── components/
│   ├── styles/
│   └── ...
├── public/
├── docs/
├── .gitignore
├── README.md
├── GUIA_RAPIDA_5_MINUTOS.md
├── GUIA_SISTEMA_OPERATIVO.md
├── package.json
├── vite.config.ts
└── ...
```

---

## 🔒 Seguridad: Nunca Subas

**Nunca** agregar a Git/GitHub:
- `.env` con contraseñas
- `node_modules/` (muy grande)
- `dist/` (se genera con build)
- Archivos personales
- Keys/secrets

*(Ya está en .gitignore, pero ten cuidado)*

---

## 📞 Problemas Comunes

### **"fatal: No commits yet on main"**
```
Significa que no hiciste el primer commit
Ejecuta: git commit -m "inicial"
```

### **"error: failed to push some refs"**
```
GitHub tiene cambios que no tienes localmente
Ejecuta: git pull origin main
Resuelve conflictos si hay
Luego: git push
```

### **"Permission denied (publickey)"**
```
Problema con SSH
Usa HTTPS en lugar de SSH
O configura SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### **"fatal: pathspec 'origin/main' did not match"**
```
Rama no existe
Ejecuta: git branch -M main
Luego: git push -u origin main
```

---

## 🎉 Resumen

1. ✅ Crear repo en GitHub
2. ✅ `git init` en tu proyecto
3. ✅ `git remote add origin <URL>`
4. ✅ `git add .`
5. ✅ `git commit -m "Inicial"`
6. ✅ `git push -u origin main`
7. ✅ ¡Listo! Versión en la nube

**Próximas veces:**
```
git add .
git commit -m "Descripción"
git push
```

---

**¿Preguntas?** Revisa la documentación oficial: https://docs.github.com/

Última actualización: 2025-11-30
