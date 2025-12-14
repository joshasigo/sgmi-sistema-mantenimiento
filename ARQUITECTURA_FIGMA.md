# Arquitectura Frontend - SGMI Figma

## 🎨 Visión General

Este frontend del SGMI ha sido completamente diseñado en **Figma** y exportado como código React/TypeScript. El diseño mantiene una consistencia visual y de experiencia de usuario de clase mundial.

**Enlace Figma**: https://www.figma.com/design/9PCTgEDBWatsuCDxolLL9Z/Proyecto-SGMI

---

## 📐 Estructura Figma

### Sistemas de Diseño
- **Componentes**: Botones, inputs, cards, tablas, modales
- **Estilos**: Colores, tipografía, sombras, espaciado
- **Layouts**: Grillas responsive, breakpoints (mobile, tablet, desktop)
- **Iconografía**: Lucide React icons

### Paleta de Colores
| Nombre | Hex | Uso |
|--------|-----|-----|
| Azul Primario | #2563EB | Botones, links, acciones principales |
| Azul Secundario | #1E40AF | Hover states, énfasis |
| Azul Oscuro | #0F172A | Fondos de gradientes |
| Gris Texto | #1F2937 | Texto principal |
| Gris Claro | #F3F4F6 | Fondos secundarios |
| Verde Éxito | #10B981 | Estados positivos, checkmarks |
| Rojo Error | #EF4444 | Estados críticos, errores |
| Naranja Alerta | #F97316 | Alertas, warnings |

### Tipografía
- **Familia**: Inter, sans-serif
- **Encabezados H1**: 32px, peso 700
- **Encabezados H2**: 24px, peso 700
- **Encabezados H3**: 18px, peso 600
- **Texto Base**: 14px, peso 400
- **Labels**: 12px, peso 500

---

## 🔄 Flujo de Diseño Figma → React

### Proceso de Conversión
1. **Diseño en Figma**: Componentes y páginas diseñadas
2. **Exportación**: Código React generado desde Figma
3. **Optimización**: Mejoras de funcionalidad y interactividad
4. **Componentes shadcn/ui**: Integración de componentes base
5. **Tailwind CSS**: Estilos responsivos

### Componentes Principais

#### 1. **LandingPage**
- Diseño: Figma Canvas
- Componentes: Navbar, Hero, Features Grid, CTA, Footer
- Responsive: Mobile-first design

#### 2. **LoginPage / RegisterPage**
- Diseño: Formularios modernos
- Características: Validación visual, password strength
- Animaciones: Fondos con blobs decorativos

#### 3. **Dashboard**
- Diseño: Panel analítico completo
- Elementos: Stats cards, gráficos, tablas
- Interactividad: Filtros, búsqueda

#### 4. **Secciones de Gestión**
- Órdenes de Trabajo
- Inventario
- Reportes
- Usuarios
- Configuración

---

## 🎯 Componentes UI (shadcn/ui)

Todos los componentes base están construidos con **shadcn/ui**, que utiliza:
- **Radix UI**: Componentes accesibles
- **Tailwind CSS**: Utilidades de estilos
- **Class Variance Authority**: Gestión de variantes

### Componentes Utilizados
```
✅ Button
✅ Card
✅ Input
✅ Label
✅ Select
✅ Table
✅ Tabs
✅ Badge
✅ Dialog
✅ Dropdown Menu
✅ Avatar
✅ Progress
✅ Switch
✅ Toast/Sonner
✅ Y más...
```

---

## 🎬 Animaciones Figma

### Transiciones Implementadas
- **Hover Effects**: Cambios de color y escala
- **Focus States**: Indicadores de foco para accesibilidad
- **Loading States**: Spinners animados
- **Page Transitions**: Transiciones suaves entre vistas

### Animaciones CSS
```css
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
```

---

## 📱 Responsividad

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Estrategia
- **Mobile-first**: Diseño comienza en móvil
- **Grid Responsive**: Layouts que se adaptan
- **Flexible**: Componentes que se redimensionan

---

## 🎨 Sistema de Variables CSS

Variables Tailwind utilizadas:
```tailwind
/* Colores */
bg-blue-600, bg-blue-100
text-gray-900, text-gray-600
border-gray-200

/* Espaciado */
p-4, p-8, gap-2, gap-6
px-4, py-2

/* Sombras */
shadow-lg, shadow-2xl
```

---

## 📊 Estructura de Carpetas

```
src/
├── components/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── OrdenesTrabajoSection.tsx
│   ├── AppMovilSection.tsx
│   ├── InventarioSection.tsx
│   ├── ReportesSection.tsx
│   ├── UsuariosSection.tsx
│   ├── ConfiguracionSection.tsx
│   ├── Header.tsx
│   ├── UserProfile.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── [otros componentes ui]
│   └── figma/
│       └── ImageWithFallback.tsx
├── styles/
│   ├── globals.css
│   └── index.css
└── App.tsx
```

---

## 🔧 Configuración Técnica

### Herramientas
- **Build**: Vite
- **Framework**: React 18
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + PostCSS
- **Componentes**: shadcn/ui + Radix UI
- **Iconos**: Lucide React

### Scripts
```bash
npm install          # Instalar dependencias
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run preview     # Previsualizar build
```

---

## 🎯 Mejoras Futuras

### Figma
- [ ] Agregar más variantes de componentes
- [ ] Crear Design Tokens en Figma
- [ ] Documentar patrones de interacción
- [ ] Generar automáticamente código desde Figma

### React
- [ ] Integración con API real
- [ ] Autenticación real (JWT)
- [ ] Testing automatizado
- [ ] Optimización de performance
- [ ] Dark mode

### UX
- [ ] Micro-interacciones
- [ ] Gestos táctiles (mobile)
- [ ] Transiciones de página
- [ ] Soporte multi-idioma
- [ ] Accesibilidad mejorada (WCAG 2.1 AAA)

---

## 📚 Referencias

- **Figma Project**: https://www.figma.com/design/9PCTgEDBWatsuCDxolLL9Z/Proyecto-SGMI
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **React Documentation**: https://react.dev/
- **Lucide Icons**: https://lucide.dev/

---

**Versión**: 1.0  
**Última actualización**: 2025-11-30  
**Diseño**: 🎨 Figma  
**Implementación**: ⚛️ React + TypeScript
