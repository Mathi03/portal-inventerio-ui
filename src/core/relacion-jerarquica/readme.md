# Documentación Técnica - RelacionJerarquicaService

## Descripción

`RelacionJerarquicaService` es una clase de servicio que gestiona las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para las relaciones jerárquicas en el sistema.

## Métodos

### create(createRelacionJerarquica: CreateRelacionJerarquicaDto)

Crea una nueva relación jerárquica.

- **Parámetros**:
  - `createRelacionJerarquica`: DTO con los datos para crear la relación
- **Endpoint**: POST `/v1/portal/hierarchy-relations`
- **Retorna**: Promesa con la respuesta del servidor

### findAll(queryRelacionJerarquica: QueryRelacionJerarquicaDto)

Obtiene un listado paginado de relaciones jerárquicas.

- **Parámetros**:
  - `queryRelacionJerarquica`: DTO con los parámetros de búsqueda y paginación
- **Endpoint**: GET `/v1/portal/hierarchy-relations`
- **Retorna**: Promesa con `PaginationDto<RelacionJerarquicaType[]>`

### getById()

Obtiene una relación jerárquica por su identificador.

- **Endpoint**: GET `/v1/portal/hierarchy-relations`
- **Nota**: Este método está incompleto y necesita implementación

### update(id: number, updateRelacionJerarquicae: UpdateRelacionJerarquicaeDto)

Actualiza una relación jerárquica existente.

- **Parámetros**:
  - `id`: Identificador numérico de la relación
  - `updateRelacionJerarquicae`: DTO con los datos a actualizar
- **Endpoint**: PUT `/v1/portal/hierarchy-relations/${id}`
- **Retorna**: Promesa con la respuesta del servidor

### delete(id: number)

Elimina una relación jerárquica.

- **Parámetros**:
  - `id`: Identificador numérico de la relación a eliminar
- **Endpoint**: DELETE `/v1/portal/hierarchy-relations/${id}`
- **Retorna**: Promesa con la respuesta del servidor

## DTOs Utilizados

- `CreateRelacionJerarquicaDto`: DTO para crear relaciones
- `QueryRelacionJerarquicaDto`: DTO para búsqueda y filtrado
- `UpdateRelacionJerarquicaeDto`: DTO para actualización
- `PaginationDto`: DTO para manejo de paginación

## Tipos

- `RelacionJerarquicaType`: Tipo que define la estructura de una relación jerárquica

## Dependencias

- `bff`: Cliente HTTP configurado para comunicación con el backend
