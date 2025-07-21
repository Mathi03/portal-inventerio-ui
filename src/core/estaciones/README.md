# Servicio de Fuentes (FuenteService)

## Descripción

El `FuenteService` es un servicio que maneja las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) para las fuentes de referencia en el sistema. Este servicio se comunica con el backend a través de endpoints REST.

## Métodos

### create(createFuente: CreateFuenteDto)

Crea una nueva fuente en el sistema.

- **Parámetros**:
  - `createFuente`: DTO con los datos de la fuente a crear
- **Endpoint**: POST `/v1/portal/ref-sources`
- **Retorna**: Respuesta del servidor con los datos de la fuente creada

### findAll(queryFuente: QueryFuenteDto)

Obtiene una lista paginada de fuentes según los criterios de búsqueda.

- **Parámetros**:
  - `queryFuente`: DTO con los parámetros de búsqueda y paginación
- **Endpoint**: GET `/v1/portal/ref-sources`
- **Retorna**: `PaginationDto<FuenteType[]>` - Lista paginada de fuentes

### getById(id: number)

Obtiene una fuente específica por su ID.

- **Parámetros**:
  - `id`: Identificador numérico de la fuente
- **Endpoint**: GET `/v1/portal/ref-sources/{id}`
- **Retorna**: Datos de la fuente solicitada

### update(id: number, updateFuente: UpdateFuenteDto)

Actualiza una fuente existente.

- **Parámetros**:
  - `id`: Identificador numérico de la fuente
  - `updateFuente`: DTO con los datos a actualizar
- **Endpoint**: PUT `/v1/portal/ref-sources/{id}`
- **Retorna**: Respuesta del servidor con los datos actualizados

### delete(id: number)

Elimina una fuente del sistema.

- **Parámetros**:
  - `id`: Identificador numérico de la fuente a eliminar
- **Endpoint**: DELETE `/v1/portal/ref-sources/{id}`
- **Retorna**: Respuesta del servidor confirmando la eliminación

## Tipos de Datos

### CreateFuenteDto

DTO para la creación de fuentes (ver definición en `./dto/create.dto`)

### UpdateFuenteDto

DTO para la actualización de fuentes (ver definición en `./dto/update.dto`)

### QueryFuenteDto

DTO para la búsqueda de fuentes (ver definición en `./dto/search.dto`)

### FuenteType

Tipo que define la estructura de una fuente (ver definición en `./fuente.type`)

## Dependencias

- `bff`: Cliente HTTP configurado para comunicación con el backend
- `PaginationDto`: DTO para manejar la paginación de resultados

## Notas

- Hay un error tipográfico en el método `detele` que debería ser `delete`
- Todos los métodos son asíncronos y retornan Promesas
- El servicio utiliza la ruta base `/v1/portal/ref-sources` para todas sus operaciones
