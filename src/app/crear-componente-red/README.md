# Componente DetalleComponenteRed

## Descripción

Componente de página que implementa la interfaz para crear componentes de red en Next.js.

## Tecnologías

- Next.js
- TypeScript
- Tailwind CSS

## Estructura del Directorio

src/app/crear-componente-red/
├── page.tsx # Componente principal
├── Header.tsx # Componente de cabecera
├── NavMenu.tsx # Menú de navegación
└── CreateForm.tsx # Formulario de creación

## Componentes

### DetalleComponenteRed (page.tsx)

Componente principal que estructura la página usando CSS Grid.

#### Dependencias

- `Header`: Cabecera de la página
- `NavMenu`: Menú de navegación lateral
- `CreateForm`: Formulario para crear componentes

#### Layout

┌────────────────┐
│ Header │
├────────┬───────┤
│ │ │
│NavMenu │Create │
│ │Form │
│ │ │
└────────┴───────┘

#### Características

- Renderizado del lado del cliente ("use client")
- Grid responsivo de dos filas y dos columnas
- NavMenu con ancho fijo de 360px
- Manejo de overflow oculto
- Espaciado interno uniforme

## Uso

```tsx
import DetalleComponenteRed from "./crear-componente-red/page";
// Usar como página en Next.js
<DetalleComponenteRed />;
```

## Estilos

Utiliza Tailwind CSS con las siguientes clases principales:

- `grid`: Para layout principal
- `grid-rows-[auto_1fr]`: Distribución de filas
- `grid-cols-[360px_1fr]`: Distribución de columnas
- `w-full h-full`: Dimensiones completas
- `overflow-hidden`: Control de desbordamiento
- `gap-2`: Espaciado entre elementos
- `p-2`: Padding interno

## Notas de Desarrollo

- Componente marcado como "use client" para interactividad
- Diseño optimizado para visualización de formularios
- Estructura modular para fácil mantenimiento
