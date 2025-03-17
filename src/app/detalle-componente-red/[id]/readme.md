# DetalleComponenteRed

Componente de React para visualizar y editar los detalles de un componente de red específico.

## Descripción

Este componente permite ver y modificar la información detallada de un componente de red. Implementa una interfaz de usuario dividida en una barra superior (header) y una sección principal con menú lateral y formulario de actualización.

## Tecnologías

- React
- Next.js
- TypeScript
- Tailwind CSS

## Estructura

```text
src/app/detalle-componente-red/[id]/
├── page.tsx # Componente principal
├── Header.tsx # Barra superior
├── NavMenu.tsx # Menú de navegación lateral
└── UpdateForm.tsx # Formulario de actualización
```

## Uso

```tsx
// Ejemplo de ruta
/detalle-componente-red/123;
```

## 🔧 Props y Estados

### Estados

- `componenteRed`: Almacena los datos del componente de red

```tsx
const [componenteRed, setComponenteRed] = useState<ComponenteRedType | null>(
  null,
);
```

### Props de Subcomponentes

- `Header`: Recibe `componenteRed`
- `UpdateForm`: Recibe `componenteRed`

## Funcionalidades

- Obtención automática de datos del componente al cargar
- Visualización de información en header
- Navegación mediante menú lateral
- Formulario para actualización de datos

## Interfaz

El componente utiliza CSS Grid para su layout:
┌────────────────┐
│ Header │
├────────┬───────┤
│ │ │
│NavMenu │Create │
│ │Form │
│ │ │
└────────┴───────┘

## Dependencias

```json
{
  "dependencies": {
    "react": "required",
    "next": "required",
    "@/core/componente-red/componente-red.service": "required",
    "@/core/componente-red/componente-red.type": "required"
  }
}
```

## Flujo de Datos

1. Obtención del ID desde parámetros URL
2. Llamada al servicio para obtener datos
3. Actualización del estado
4. Renderizado de interfaz con datos

## Consideraciones

- Componente del lado del cliente ("use client")
- Requiere ID válido en la URL
- Manejo asíncrono de datos
- Layout responsivo

## Contribución

Para contribuir a este componente:

1. Asegúrate de mantener la estructura de grid
2. Documenta nuevas props o estados
3. Mantén la consistencia con el diseño actual
4. Prueba la funcionalidad en diferentes tamaños de pantalla
