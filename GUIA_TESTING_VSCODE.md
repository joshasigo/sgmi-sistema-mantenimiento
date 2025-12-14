# 🧪 Guía de Pruebas en VS Code - SGMI

## 📋 Configuración Completada

✅ Vitest instalado y configurado  
✅ React Testing Library instalado  
✅ Archivos de setup creados  
✅ Scripts de test en package.json  
✅ Tests de ejemplo creados

---

## 🚀 Comandos para Ejecutar Pruebas

### Desde la Terminal de VS Code

```bash
# 1. Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
npm test

# 2. Ejecutar tests una sola vez
npm run test:run

# 3. Ejecutar tests con interfaz visual
npm run test:ui

# 4. Ejecutar tests con reporte de cobertura
npm run test:coverage
```

---

## 🎨 Usando la Interfaz Visual de Vitest

### Opción 1: Desde la Terminal

```bash
npm run test:ui
```

Esto abrirá una interfaz web en `http://localhost:51204/__vitest__/` donde podrás:
- Ver todos los tests en un árbol visual
- Ejecutar tests individualmente
- Ver resultados en tiempo real
- Filtrar tests por nombre o archivo
- Ver cobertura de código

### Opción 2: Instalar Extensión de VS Code

1. **Buscar e Instalar:**
   - Presiona `Ctrl + Shift + X` (abrir extensiones)
   - Busca "Vitest"
   - Instala la extensión oficial "Vitest" de Vitest Team

2. **Usar la Extensión:**
   - Aparecerá un ícono de laboratorio en la barra lateral
   - Click para ver todos los tests
   - Botón de play para ejecutar tests individuales
   - Indicadores verdes/rojos junto al código

---

## 📁 Estructura de Tests Creada

```
src/
├── test/
│   ├── setup.ts              # Configuración global de tests
│   ├── LoginPage.test.tsx    # Tests del componente LoginPage
│   ├── Dashboard.test.tsx    # Tests del componente Dashboard
│   └── utils.test.ts         # Tests de funciones utilitarias
```

---

## ✍️ Cómo Escribir Nuevos Tests

### Ejemplo 1: Test de Componente

```typescript
// src/test/MiComponente.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MiComponente } from '../components/MiComponente';

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });
});
```

### Ejemplo 2: Test con Interacción de Usuario

```typescript
import { fireEvent, waitFor } from '@testing-library/react';

it('debe responder a clicks', async () => {
  render(<MiComponente />);
  
  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Ejemplo 3: Test con Mock

```typescript
import { vi } from 'vitest';

it('debe llamar a la función mock', () => {
  const mockFn = vi.fn();
  render(<MiComponente onSubmit={mockFn} />);
  
  // Simular interacción
  fireEvent.click(screen.getByRole('button'));
  
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

---

## 🎯 Tests Creados en el Proyecto

### LoginPage.test.tsx (9 tests)

✅ Renderiza el formulario correctamente  
✅ Permite escribir en los campos  
✅ Llama al login con datos válidos  
✅ Muestra spinner de carga  
✅ Muestra error cuando falla  
✅ Alterna visibilidad de contraseña  
✅ Click en "Olvidé mi contraseña"  
✅ Click en "Crear cuenta"

### Dashboard.test.tsx (3 tests)

✅ Renderiza el título  
✅ Muestra mensaje de bienvenida  
✅ Renderiza tarjetas de estadísticas

### utils.test.ts (4 tests)

✅ Combina clases correctamente  
✅ Maneja valores condicionales  
✅ Maneja undefined y null  
✅ Sobrescribe clases de Tailwind

---

## 🔍 Debugging de Tests

### En VS Code con Breakpoints

1. Coloca un breakpoint en tu test (click en el margen izquierdo)
2. En la paleta de comandos (`Ctrl + Shift + P`), busca "Debug: JavaScript Debug Terminal"
3. En la nueva terminal, ejecuta: `npm test`
4. El debugger se detendrá en tus breakpoints

### Con console.log

```typescript
it('mi test', () => {
  const { container } = render(<MiComponente />);
  
  // Ver el HTML renderizado
  console.log(container.innerHTML);
  
  // Ver el estado de un elemento
  const button = screen.getByRole('button');
  console.log(button);
});
```

---

## 📊 Ver Cobertura de Código

```bash
npm run test:coverage
```

Esto generará:
- Reporte en la terminal con porcentajes
- Carpeta `coverage/` con reporte HTML
- Abre `coverage/index.html` en el navegador para ver reporte visual

**Objetivo de Cobertura:** 75% o más

---

## ⚡ Shortcuts Útiles

| Acción | Shortcut | Descripción |
|--------|----------|-------------|
| Ejecutar test | `Ctrl + Shift + P` → "Test: Run" | Ejecuta el test bajo el cursor |
| Debug test | `Ctrl + Shift + P` → "Test: Debug" | Debuggea el test |
| Ejecutar todos | En terminal: `npm test` | Ejecuta todos los tests |
| UI Visual | `npm run test:ui` | Abre interfaz web |

---

## 🐛 Solución de Problemas Comunes

### Problema 1: "Cannot find module"

**Solución:**
```bash
npm install
```

### Problema 2: Tests pasan pero componente no se ve

**Causa:** Falta mock de estilos  
**Solución:** Ya está configurado en `setup.ts`

### Problema 3: "ReferenceError: vi is not defined"

**Solución:**
```typescript
import { vi } from 'vitest';
```

### Problema 4: Tests muy lentos

**Solución:** Usa `test.concurrent` para paralelizar:
```typescript
it.concurrent('mi test', async () => {
  // ...
});
```

---

## 📝 Buenas Prácticas

### ✅ Hacer

- Usar nombres descriptivos: `it('debe mostrar error cuando email es inválido')`
- Organizar con `describe` para agrupar tests relacionados
- Limpiar después de cada test (ya configurado automáticamente)
- Usar `screen.getByRole()` en lugar de `getByTestId()`
- Mockear dependencias externas (APIs, stores)

### ❌ Evitar

- Tests que dependen del orden de ejecución
- Tests con timeouts largos
- Tests que prueban implementación en lugar de comportamiento
- Múltiples `expect()` en un solo test (idealmente 1-3)

---

## 🎓 Recursos Adicionales

### Documentación Oficial

- **Vitest:** https://vitest.dev/
- **React Testing Library:** https://testing-library.com/react
- **jest-dom matchers:** https://github.com/testing-library/jest-dom

### Queries de Testing Library

```typescript
// Por Rol (PREFERIDO)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })

// Por Label
screen.getByLabelText(/email/i)

// Por Placeholder
screen.getByPlaceholderText(/enter email/i)

// Por Texto
screen.getByText(/welcome/i)

// Queries async (para elementos que aparecen después)
await screen.findByText(/success/i)
```

### Matchers Útiles

```typescript
// Elementos en DOM
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toBeDisabled()

// Valores
expect(input).toHaveValue('texto')
expect(checkbox).toBeChecked()

// Clases CSS
expect(element).toHaveClass('active')

// Atributos
expect(link).toHaveAttribute('href', '/home')

// Llamadas a funciones
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
expect(mockFn).toHaveBeenCalledTimes(2)
```

---

## 🚀 Próximos Pasos

1. **Ejecutar tests ahora:**
   ```bash
   npm run test:ui
   ```

2. **Instalar extensión de Vitest en VS Code** (recomendado)

3. **Escribir más tests para tus componentes:**
   - UsuariosSection.test.tsx
   - OrdenesTrabajoSection.test.tsx
   - InventarioSection.test.tsx

4. **Alcanzar 75% de cobertura:**
   ```bash
   npm run test:coverage
   ```

---

## ✅ Checklist de Testing

- [x] Vitest configurado
- [x] React Testing Library instalado
- [x] Setup creado
- [x] Tests de ejemplo funcionando
- [ ] Instalar extensión de Vitest en VS Code
- [ ] Escribir tests para componentes principales
- [ ] Alcanzar 75% de cobertura
- [ ] Configurar CI/CD para ejecutar tests automáticamente

---

**¡Estás listo para escribir y ejecutar pruebas en VS Code! 🎉**

**Comando rápido para empezar:**
```bash
npm run test:ui
```
