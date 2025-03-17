# Documentación Técnica: Componente Home

## Descripción General

El componente `Home` es el componente principal de la página de inicio de la aplicación. Está implementado como un componente del lado del cliente ("use client") y se encarga de organizar y mostrar diferentes gráficos en una disposición de cuadrícula.

## Especificaciones Técnicas

### Ubicación

- **Ruta del archivo:** `src/app/(home)/page.tsx`

### Tecnologías Utilizadas

- React
- TypeScript
- Next.js (App Router)

### Directivas

- `"use client"` - Indica que este componente se ejecuta en el lado del cliente

### Dependencias

El componente importa tres subcomponentes:

- `ChartFuentes`
- `ChartRedes`
- `ChartTipoComponente`

### Estructura del Layout

- Utiliza CSS Grid para la disposición de los elementos
- Configuración de la cuadrícula:
  - `grid-cols-6`: Define 6 columnas en la cuadrícula
  - `gap-2`: Establece un espaciado de 2 unidades entre los elementos
  - `py-2`: Padding vertical de 2 unidades
  - `px-[10%]`: Padding horizontal del 10% en ambos lados
  - `isolate`: Crea un nuevo contexto de apilamiento

### Renderizado

El componente renderiza tres gráficos diferentes en el siguiente orden:

1. `<ChartTipoComponente />`
2. `<ChartRedes />`
3. `<ChartFuentes />`

## Uso

```tsx
import Home from "./app/(home)/page";

// El componente se utiliza como página principal en Next.js
// No requiere props para su funcionamiento
```

## Consideraciones

- Al ser un componente del lado del cliente, toda la lógica se ejecuta en el navegador
- La disposición en cuadrícula permite una organización responsive de los gráficos
- El padding horizontal del 10% asegura que el contenido esté centrado y tenga márgenes adecuados

## Mantenimiento

Para modificar la disposición de los gráficos, se pueden ajustar:

- Las clases de CSS Grid en el elemento `section`
- El orden de los componentes de gráficos
- Los márgenes y espaciados mediante las clases de utilidad
