# Servicio Service

## Descripción

Este servicio maneja las operaciones relacionadas con los servicios del portal. Proporciona métodos para consultar y gestionar los servicios disponibles.

## Métodos

### findAll

Obtiene todos los servicios asociados a un control específico.

#### Parámetros

- `controlId`: Identificador del control para filtrar los servicios

#### Retorno

- `Promise<ServicioType[]>`: Arreglo de servicios que coinciden con el criterio de búsqueda

#### Ejemplo de uso

```ts
const servicioService = new ServicioService();
const servicios = await servicioService.findAll({ controlId: 123 });
```

## Tipos de Datos

### ServicioType

Representa la estructura de datos de un servicio.

### QueryServiceDto

DTO (Data Transfer Object) para las consultas de servicios.

- `controlId`: Identificador del control

## Dependencias

- Utiliza el cliente HTTP configurado en `bff` para realizar las peticiones
- Importa `PaginationDto` para manejar la paginación de resultados
- Depende de los tipos `ServicioType` y `QueryServiceDto`

## Endpoints

- GET `/v1/portal/services`: Obtiene la lista de servicios paginada
  - Query params:
    - `controlId`: ID del control para filtrar

## Notas Técnicas

- El servicio está implementado como una clase TypeScript
- Utiliza async/await para el manejo de operaciones asíncronas
- Los datos se obtienen a través de una API REST
