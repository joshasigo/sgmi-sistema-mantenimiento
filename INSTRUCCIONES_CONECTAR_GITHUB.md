# 🚀 INSTRUCCIONES FINALES: Conectar a GitHub

## ✅ Estado Actual

Tu proyecto local está completamente versionado con **2 commits**:

```
643f309 - Docs: Agregué guías completas para GitHub y versionado
c2badbf - Commit inicial: SGMI Frontend - React 18 + TypeScript + Figma + Documentación completa
```

**Ahora necesitas solo 2 pasos para subirlo a GitHub:**

---

## 📌 PASO 1: Crear Repositorio en GitHub (5 minutos)

### Instrucciones:

1. **Abre navegador** → https://github.com/new

2. **Rellena el formulario:**

   | Campo | Valor |
   |-------|-------|
   | Repository name | `SGMI-Frontend` |
   | Description | `Sistema de Gestión de Mantenimiento Industrial - Frontend React + TypeScript + Figma` |
   | Visibility | Elige: `Public` (público) o `Private` (privado) |

3. **Deja sin marcar:**
   - ❌ "Initialize this repository with a README"
   - ❌ "Add .gitignore"
   - ❌ "Add a license"

4. **Click en "Create repository"**

### Resultado:

GitHub te mostrará una página con instrucciones. Te aparecerá algo como:

```
Quick setup — if you've done this kind of thing before

or

https://github.com/tu-usuario/SGMI-Frontend.git
```

**📋 COPIA ESTA URL**, la necesitarás en el siguiente paso.

---

## 📌 PASO 2: Conectar tu Proyecto Local a GitHub (2 minutos)

### Abre PowerShell:

1. Presiona `Windows + X`
2. Selecciona "Windows PowerShell" o "Terminal"
3. O usa la terminal en VS Code

### Ejecuta estos comandos (uno por uno):

```powershell
# Navega a tu proyecto
cd "C:\Users\tu-usuario\Desktop\Trabajos Carrera Ing desarrollo de Software IBERO\Proyecto de software 2025-2\proyecto sgmi\SGMI DESARROLLO FRONTEND"

# Verifica que estés en el proyecto
pwd

# Conectar con GitHub (REEMPLAZA LA URL)
git remote add origin https://github.com/tu-usuario/SGMI-Frontend.git

# Verifica la conexión
git remote -v

# Cambiar rama a "main" (GitHub usa main por defecto)
git branch -M main

# Subir código a GitHub
git push -u origin main
```

### Resultado esperado:

```
Enumerating objects: 89, done.
Counting objects: 100% (89/89), done.
Delta compression using up to 8 threads.
Compressing objects: 100% (84/84), done.
Writing objects: 100% (89/89), 1.25 MiB | 1.05 MiB/s, done.
Total 89 (delta 15), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (15/15), done.
To https://github.com/tu-usuario/SGMI-Frontend.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🔐 Primera Vez: Credenciales

### La primera vez que hagas `git push`, PowerShell te pedirá:

**Opción 1: Token Personal (RECOMENDADO)**

```
Username for 'https://github.com': tu-usuario-github
Password for 'https://tu-usuario-github@github.com': 
```

1. **Usuario:** Tu usuario de GitHub
2. **Contraseña:** 
   - Ve a https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Dale nombre: `git-sgmi`
   - Marca: `repo` (todos los permisos)
   - Click "Generate token"
   - **Copia el token**
   - Pégalo como contraseña en PowerShell

**Ventaja:** Más seguro que contraseña, puedes revocarlo cuando quieras.

---

### Opción 2: Guardar Credenciales (Siguiente vez)

```powershell
# Guardar credenciales para próximas veces
git config --global credential.helper store

# Próxima vez que hagas push, se guardará automáticamente
```

---

## ✅ Verifica en GitHub

Una vez que `git push` termine exitosamente:

1. **Abre navegador** → https://github.com/tu-usuario/SGMI-Frontend
2. **Deberías ver:**
   - ✅ Todos tus archivos (87+)
   - ✅ Pestaña "Commits" con tus 2 commits
   - ✅ README.md actualizado
   - ✅ Descripción del proyecto
   - ✅ Rama "main"

---

## 📝 Resumen de Comandos (Copia y Pega)

```powershell
# 1. Navega a proyecto
cd "C:\Users\josha\Desktop\Trabajos Carrera Ing desarrollo de Software IBERO\Proyecto de software 2025-2\proyecto sgmi\SGMI DESARROLLO FRONTEND"

# 2. Conectar con GitHub (REEMPLAZA URL)
git remote add origin https://github.com/tu-usuario/SGMI-Frontend.git

# 3. Cambiar rama a main
git branch -M main

# 4. Subir código
git push -u origin main

# 5. Verificar
git remote -v
```

---

## 🚀 Después de GitHub: Futuras Actualizaciones

Cada vez que hagas cambios:

```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción del cambio"

# Subir a GitHub
git push
```

**¡Sin necesidad de `-u origin main`, solo `git push`!**

---

## 🏷️ Crear Versiones (Opcional)

Para marcar versiones importantes:

```powershell
# Crear versión 1.0
git tag -a v1.0 -m "Versión 1.0 - Sistema completo funcionando"

# Subir tags
git push origin --tags
```

En GitHub aparecerá en "Releases"

---

## ❓ Solución de Problemas

### **Error: "fatal: not a git repository"**
```
Significa que no estás en la carpeta correcta.
Ejecuta: cd "ruta/correcta/SGMI DESARROLLO FRONTEND"
```

### **Error: "remote origin already exists"**
```powershell
# Si ya existe, reemplázalo
git remote remove origin
git remote add origin https://github.com/tu-usuario/SGMI-Frontend.git
```

### **Error: "failed to push some refs"**
```powershell
# GitHub tiene cambios que no tienes
git pull origin main
# Resuelve conflictos si hay
git push
```

### **Error: "fatal: 'origin' does not appear to be a 'git' repository"**
```
Significa que no conectaste el remote.
Ejecuta: git remote add origin https://github.com/tu-usuario/SGMI-Frontend.git
```

---

## 📞 Comandos Útiles

```powershell
# Ver conexión a GitHub
git remote -v

# Ver commits locales
git log --oneline

# Ver rama actual
git branch

# Ver cambios pendientes
git status

# Ver diferencias
git diff
```

---

## ✨ Checklist Final

- [ ] Creaste repositorio en https://github.com/new
- [ ] Copiaste la URL del repositorio
- [ ] Ejecutaste `git remote add origin <URL>`
- [ ] Ejecutaste `git branch -M main`
- [ ] Ejecutaste `git push -u origin main`
- [ ] Ingresaste credenciales (usuario + token)
- [ ] Verificaste en https://github.com/tu-usuario/SGMI-Frontend
- [ ] Ves tus archivos en GitHub
- [ ] Ves tus 2 commits en "Commits"

---

## 🎉 ¡Listo!

Una vez que completes estos pasos:

✅ Tu código está en GitHub  
✅ Tienes versionado completo  
✅ Otros pueden colaborar  
✅ Tienes backup en la nube  
✅ Tu equipo puede ver el progreso  

---

## 📚 Documentación Completa

Para más detalles, lee:
- **GUIA_GITHUB_VERSIONADO.md** - Guía completa de Git y GitHub
- **RESUMEN_GIT_GITHUB.md** - Diagrama y flujo
- **GUIA_DEPLOYMENT_INSTALACION.md** - Deployment a producción

---

**¡A partir de ahora tu proyecto estará versionado en GitHub!** 🚀

*Creado: 2025-11-30*  
*Estado: ✅ Git local listo, falta conectar a GitHub*
