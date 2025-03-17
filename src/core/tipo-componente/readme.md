# Servicio de Tipo Componente

## Descripción

Este servicio proporciona la lógica de negocio para gestionar los tipos de componentes en el portal, implementando operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y funcionalidades adicionales como aprobación.

## Métodos

### create(createTipoComponente: CreateTipoComponenteDto)

Crea un nuevo tipo de componente.

- **Parámetros**: Objeto CreateTipoComponenteDto con los datos del nuevo tipo de componente
- **Endpoint**: POST `/v1/portal/ref-component-type`
- **Retorna**: Respuesta del servidor con los datos del componente creado

### findAll(queryTipoComponente: QueryTipoComponenteDto)

Obtiene una lista paginada de tipos de componentes.

- **Parámetros**: Objeto QueryTipoComponenteDto con los parámetros de búsqueda y paginación
- **Endpoint**: GET `/v1/portal/ref-component-type`
- **Retorna**: PaginationDto<TipoComponenteType[]> con la lista de componentes y metadata de paginación

### getById(id: number)

Obtiene un tipo de componente específico por su ID.

- **Parámetros**: ID numérico del componente
- **Endpoint**: GET `/v1/portal/ref-component-type/{id}`
- **Retorna**: Datos del tipo de componente solicitado

### update(id: number, updateTipoComponente: UpdateTipoComponenteDto)

Actualiza un tipo de componente existente.

- **Parámetros**:
  - id: ID numérico del componente
  - updateTipoComponente: Objeto UpdateTipoComponenteDto con los datos a actualizar
- **Endpoint**: PUT `/v1/portal/ref-component-type/{id}`
- **Retorna**: Respuesta del servidor con los datos actualizados

### delete(id: number)

Elimina un tipo de componente.

- **Parámetros**: ID numérico del componente a eliminar
- **Endpoint**: DELETE `/v1/portal/ref-component-type/{id}`
- **Retorna**: Respuesta del servidor confirmando la eliminación

### approval(id: number, commentApproval: string)

Aprueba un tipo de componente.

- **Parámetros**:
  - id: ID numérico del componente
  - commentApproval: Comentario de aprobación
- **Endpoint**: PATCH `/v1/portal/ref-component-type/approval/{id}`
- **Retorna**: Respuesta del servidor con el estado de aprobación

## DTOs Utilizados

- CreateTipoComponenteDto
- QueryTipoComponenteDto
- UpdateTipoComponenteDto
- PaginationDto

## Tipos

- TipoComponenteType: Define la estructura de datos para un tipo de componente

## Dependencias

- bff: Cliente HTTP configurado para comunicación con el backend
