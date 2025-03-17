# Documentación Técnica - MantenedorRedPage

## Descripción General

`MantenedorRedPage` es un componente React que implementa una interfaz de gestión de redes con funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar). El componente utiliza el framework Mistica de Telefónica y está diseñado como una página del lado del cliente ("use client").

## Dependencias Principales

- **@telefonica/mistica**: Para diálogos de confirmación
- **React**: Utiliza hooks como useState, useEffect, useCallback
- Componentes personalizados:
  - Table
  - Filter
  - Pagination
  - InputSearch
  - Button
  - Icon

## Características Principales

### Estado Local

```tsx
const [search, setSearch] = useState<string | null>();
const [openFilter, setOpenFilter] = useState(true);
const [openCreate, setOpenCreate] = useState(false);
const [openEdit, setOpenEdit] = useState(false);
```

### Hooks Personalizados

- `useRed()`: Gestiona la lógica de datos de redes
- `useColumn()`: Maneja la configuración de columnas
- `usePagination()`: Controla la paginación
- `useDialog()`: Manejo de diálogos de confirmación

### Funcionalidades

#### 1. Gestión de Datos

- Carga de datos de redes con paginación
- Búsqueda por texto
- Filtrado avanzado
- Exportación a XLS

#### 2. Operaciones CRUD

- **Crear**: Modal de creación de nueva red
- **Leer**: Tabla con datos paginados
- **Actualizar**: Modal de edición de red existente
- **Eliminar**: Confirmación y eliminación de red

#### 3. Interfaz de Usuario

- Tabla principal con datos
- Barra de búsqueda
- Filtros laterales
- Menú de acciones por fila
- Paginación
- Selección de columnas visibles

## Estructura del Componente

### Header

```tsx
<header className="grid grid-cols-[1fr_auto] justify-between gap-4">
  <InputSearch />
  <menu>
    <ExportXLS />
    <ShowColumns />
    <ButtonFilter />
    <Button>Crear</Button>
  </menu>
</header>
```

### Contenido Principal

- Tabla con datos de redes
- Filtro lateral (toggleable)
- Paginación en la parte inferior

### Modales

- Modal de creación
- Modal de edición
- Diálogo de confirmación para eliminación

## Eventos y Callbacks

### onLoad

```tsx
const onLoad = useCallback(() => {
  getRedes({ search, page, limit });
}, [search, page, limit, getRedes]);
```

Carga los datos de redes cuando cambian los parámetros de búsqueda, página o límite.

### onEdit

```tsx
const onEdit = useCallback(
  (red: RedType) => {
    setRed(red);
    setOpenEdit(true);
  },
  [setRed],
);
```

Maneja la edición de una red existente.

### onDelete

```tsx
const onDelete = useCallback((red: RedType) => {
  confirm({
  title: Eliminar red "${name}",
  message: "¿Estás seguro de eliminar este mantenedor de red?",
  destructive: true,
  onAccept: async () => {
    await deteleRed(id, name);
    onLoad();
  },
  });
}, [deteleRed, confirm, onLoad]);
```

Gestiona la eliminación de una red con confirmación.

## Propiedades de Estilo

- Utiliza CSS Grid y Flexbox para el layout
- Clases de utilidad para espaciado y posicionamiento
- Sistema de diseño responsive

## Consideraciones Técnicas

1. Implementa "use client" para renderizado del lado del cliente
2. Utiliza gestión de estado local para modales y filtros
3. Implementa callbacks memorizados para optimización de rendimiento
4. Maneja estados de carga para mejor UX
5. Integra sistema de confirmación para acciones destructivas
