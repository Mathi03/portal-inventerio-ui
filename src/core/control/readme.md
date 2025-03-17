# Documentación Técnica - ControlService

## Descripción General

`ControlService` es una clase de servicio que maneja las operaciones relacionadas con los controles en el sistema, proporcionando métodos para recuperar información de controles a través de llamadas API.

## Ubicación

`src/core/control/control.service.ts`

## Dependencias

- `bff`: Cliente HTTP para realizar peticiones al backend
- `PaginationDto`: Tipo de datos para manejar respuestas paginadas
- `ControlType`: Tipo de datos que define la estructura de un control

## Métodos

### findAll()

**Descripción**: Recupera todos los controles disponibles.
**Retorno**: `Promise<PaginationDto<ControlType[]>>`
**Endpoint**: GET `/v1/portal/controls`
**Uso**:

```ts
const controlService = new ControlService();
const controls = await controlService.findAll();
```

### findById(id: number)

**Descripción**: Recupera un control específico por su ID.
**Parámetros**:

- `id` (number): Identificador único del control

**Retorno**: `Promise<ControlType>`
**Endpoint**: GET `/v1/portal/controls/${id}`
**Uso**:

```ts
const controlService = new ControlService();
const control = await controlService.findById(1);
```

## Tipos de Datos Relacionados

### ControlType

Interfaz que define la estructura de un control (no mostrada en el código proporcionado).

### PaginationDto<T>

Tipo genérico para manejar respuestas paginadas del servidor.

## Notas Adicionales

- El servicio utiliza un cliente HTTP (`bff`) configurado previamente
- Todas las operaciones son asíncronas y devuelven Promesas
- Las rutas de API utilizan el prefijo `/v1/portal/controls`
