# Documentación Técnica de ComponenteRedService

## Descripción General

La clase `ComponenteRedService` gestiona operaciones relacionadas con componentes de red a través de una API BFF (Backend for Frontend). Proporciona métodos para operaciones CRUD y funcionalidades adicionales como aprobación de componentes y gestión de relaciones.

## Dependencias

- `bff`: Cliente HTTP para configuración
- `ControlService`: Servicio para operaciones de control
- `ServicioService`: Servicio para operaciones de servicios
- `PaginationDto`: Objeto de transferencia de datos para paginación
- Varios DTOs para operaciones de componentes

## Estructura de la Clase

### Propiedades

- `controlService`: Instancia de `ControlService`
- `servicioService`: Instancia de `ServicioService`

### Métodos

#### `create(createComponenteRed: CreateComponenteRedDto)`

Crea un nuevo componente de red.

- **Parámetros**: `createComponenteRed` - DTO con datos de creación del componente
- **Retorna**: Promise con la respuesta de la API
- **Endpoint**: POST `/v1/portal/components`

#### `findAll(queryComponenteRed: QueryComponenteRedDto)`

Obtiene una lista paginada de componentes de red.

- **Parámetros**: `queryComponenteRed` - Parámetros de consulta para filtrado
- **Retorna**: Promise con datos paginados de tipo `ComponenteRedType[]`
- **Endpoint**: GET `/v1/portal/components`
- **Nota**: Filtra los componentes que tienen `disabledAt` establecido

#### `getById(id: number)`

Obtiene información detallada de un componente específico.

- **Parámetros**: `id` - Identificador del componente
- **Retorna**: Promise con datos enriquecidos de tipo `ComponenteRedType`
- **Endpoint**: GET `/v1/portal/components/${id}`
- **Características adicionales**:
  - Obtiene información del control relacionado
  - Recupera servicios asociados
  - Obtiene relaciones del componente
  - Combina todos los datos en una única respuesta

#### `update(id: number, updateComponenteRed: UpdateComponenteRedDto)`

Actualiza un componente de red existente.

- **Parámetros**:
  - `id` - Identificador del componente
  - `updateComponenteRed` - DTO con datos de actualización
- **Retorna**: Promise con la respuesta de la API
- **Endpoint**: PUT `/v1/portal/components/${id}`

#### `delete(id: number)`

Elimina un componente de red.

- **Parámetros**: `id` - Identificador del componente
- **Retorna**: Promise con la respuesta de la API
- **Endpoint**: DELETE `/v1/portal/components/${id}`

#### `approve(id: number, approvalComment: string, observation: string)`

Aprueba un componente de red con comentarios.

- **Parámetros**:
  - `id` - Identificador del componente
  - `approvalComment` - Comentario de aprobación
  - `observation` - Observaciones adicionales
- **Retorna**: Promise con la respuesta de la API
- **Endpoint**: PATCH `/v1/portal/components/${id}`

#### `getRelations(id: number)`

Obtiene las relaciones de un componente específico.

- **Parámetros**: `id` - Identificador del componente
- **Retorna**: Promise con datos de relaciones del componente
- **Endpoint**: GET `/v1/portal/components/${id}/relation`
- **Nota**: Incluye manejo de errores para solicitudes fallidas

## Manejo de Errores

- El servicio incluye manejo básico de errores para la obtención de relaciones
- Otros métodos dependen del manejo de errores predeterminado del cliente BFF

## Tipos de Datos

- `ComponenteRedType`: Representa la estructura de un componente de red
- `CreateComponenteRedDto`: Estructura de datos para creación de componentes
- `UpdateComponenteRedDto`: Estructura de datos para actualizaciones de componentes
- `QueryComponenteRedDto`: Estructura de datos para consultas de búsqueda
- `PaginationDto`: Estructura genérica de paginación

## Ejemplo de Uso

```ts
const componenteRedService = new ComponenteRedService();
// Create a new component
await componenteRedService.create(createDto);
// Get all components with pagination
const components = await componenteRedService.findAll(queryDto);
// Get specific component with all related data
const component = await componenteRedService.getById(123);
```
