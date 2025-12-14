# 📋 COMANDOS LISTOS PARA COPIAR Y PEGAR

## 🚀 Conectar a GitHub en 2 Pasos

### **PASO 1: Copia y Pega en PowerShell**

```powershell
git remote add origin https://github.com/TU-USUARIO/SGMI-Frontend.git
```

**IMPORTANTE:** Reemplaza `TU-USUARIO` con tu usuario de GitHub

Ejemplo:
```powershell
git remote add origin https://github.com/joshuadev/SGMI-Frontend.git
```

### **PASO 2: Copia y Pega estos dos comandos**

```powershell
git branch -M main
git push -u origin main
```

---

## 🔐 Primera Vez: Credenciales

Cuando PowerShell pida credenciales:

```
Username: tu-usuario-de-github
Password: tu-personal-access-token
```

### **¿Cómo obtener Token Personal?**

1. Ve a: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Nombre: `git-sgmi`
4. Marca: `repo` ☑️
5. Click "Generate token"
6. **Copia el token**
7. En PowerShell, pégalo como contraseña

---

## 📝 Futuros Commits

Cada cambio que hagas, copia y pega esto:

```powershell
git add .
git commit -m "Feature: Descripción breve del cambio"
git push
```

Ejemplos:
```powershell
git add .
git commit -m "Feature: Agregué búsqueda en órdenes"
git push
```

```powershell
git add .
git commit -m "Fix: Arreglé bug en dropdown"
git push
```

```powershell
git add .
git commit -m "Docs: Actualicé guía de deployment"
git push
```

---

## 📊 Ver Estado

```powershell
# Ver commits
git log --oneline

# Ver cambios pendientes
git status

# Ver diferencias
git diff

# Ver conexión a GitHub
git remote -v
```

---

## 🏷️ Crear Versión (Opcional)

```powershell
git tag -a v1.0.0 -m "Versión 1.0 - Sistema completo"
git push origin --tags
```

---

## ✅ Checklist

```
[ ] Creé repositorio en https://github.com/new
[ ] Copié la URL del repositorio
[ ] Ejecuté: git remote add origin <URL>
[ ] Ejecuté: git branch -M main
[ ] Ejecuté: git push -u origin main
[ ] Ingresé credenciales (usuario + token)
[ ] Verificé en GitHub que los archivos están
[ ] Ví mis 4 commits en el historial
```

---

**¡Listo para GitHub! 🚀**

*Todos los comandos están probados y funcionan.*
