# Documentación Técnica - ComponenteRedPage

## Descripción General

`ComponenteRedPage` es un componente React que implementa una página de gestión de componentes de red. Permite visualizar, filtrar, exportar, crear, editar y eliminar componentes de red en una interfaz tabulada.

## Tecnologías Utilizadas

- React (Next.js)
- TypeScript
- Mistica UI Library (@telefonica/mistica)
- Custom Hooks

## Props

Este componente no recibe props ya que es una página autónoma.

## Estado Local

- search: string | null // Término de búsqueda
- openFilter: boolean // Control de visibilidad del filtro
- openApprove: boolean // Control del modal de aprobación
- page: number // Página actual de la tabla
- items: number // Total de items
- limit: number // Límite de items por página
- componenteRedes: ComponenteRedType[] // Lista de componentes de red
- isLoading: boolean // Estado de carga
- filter: FormFilterType // Filtros aplicados
- selectedCR: ComponenteRedType // Componente seleccionado para aprobar
- showColumn: Record<string, boolean> // Control de visibilidad de columnas

## Funcionalidades Principales

### 1. Gestión de Tabla

- Paginación
- Filtrado
- Búsqueda
- Mostrar/ocultar columnas
- Exportación a XLS

### 2. Operaciones CRUD

- Crear nuevo componente de red
- Editar componente existente
- Eliminar componente
- Aprobar componente

### 3. Columnas de la Tabla

- ID
- Nombre
- Etiqueta
- Región
- Tipo de componente
- Red
- Fuente
- ID Control
- ID Estación
- Status
- Acciones

## Hooks Utilizados

- `useCallback`: Memorización de funciones
- `useEffect`: Efectos secundarios
- `useMemo`: Memorización de valores
- `useState`: Gestión de estado
- `useStorage`: Hook personalizado para persistencia
- `useDialog`: Diálogos de confirmación
- `useSnackbar`: Notificaciones
- `useRouter`: Navegación

## Componentes Relacionados

- `Filter`: Componente de filtrado
- `Table`: Componente de tabla
- `Aprobar`: Modal de aprobación
- `ExportXLS`: Componente de exportación
- `ShowColumns`: Selector de columnas visibles
- Componentes de detalle:
  - `DetalleTipoComponente`
  - `DetalleRed`
  - `DetalleFuente`
  - `DetalleControl`

## Servicios

- findAll(): Obtiene lista de componentes
- delete(): Elimina un componente

## Manejo de Errores

- Utiliza el sistema de notificaciones (Snackbar) para mostrar mensajes de éxito
- Implementa diálogos de confirmación para acciones destructivas

## Estilos

- Utiliza clases de Tailwind CSS para el layout
- Implementa componentes de Mistica UI para la interfaz de usuario

## Consideraciones de Rendimiento

- Memorización de callbacks con useCallback
- Memorización de columnas con useMemo
- Carga bajo demanda con paginación
