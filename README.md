# Portal Inventario (App)

Aplicación web para la administración y monitoreo de componentes de red, incluyendo:

- Gestión de componentes de red
- Tipos de componentes
- Redes
- Fuentes
- Monitoreo y auditoría de componentes

[Ver Prototipo en Figma](https://www.figma.com/design/SKj9FGDhuUem7RvgRUXFSv/Telefonica?node-id=270-245&t=yp00Y4n7bG32BhmR-1)

![Imagen del Portal](/readme/image-3.png)

## Arquitectura

### Flujo de Rutas

![Diagrama de Rutas](/readme/image.png)

### Comunicación con Otros Sistemas

Este proyecto se integra con los siguientes servicios:

- Maestros dirección
- Estaciones Web

![Diagrama de Comunicación](/readme/image-1.png)

## Diseño UI/UX

[Ver Biblioteca de Componentes UI](https://www.figma.com/design/SKj9FGDhuUem7RvgRUXFSv/Telefonica?node-id=269-192&t=yp00Y4n7bG32BhmR-1)

## Estructura del Proyecto

### Páginas Principales

- [`Inicio`](</src/app/(home)/readme.md>)
- [`Componentes de Red`](</src/app/(home)/componente-red/readme.md>)
- [`Crear Componente de Red`](/src/app/crear-componente-red/readme.md)
- [`Detalle de Componente de Red`](/src/app/detalle-componente-red/[id]/readme.md)
- [`Mantenedor de Fuentes`](</src/app/(home)/mantenedor-fuente/readme.md>)
- [`Mantenedor de Redes`](</src/app/(home)/redes/readme.md>)
- [`Mantenedor de Tipos de Componentes`](</src/app/(home)/tipo-componentes/readme.md>)

### Componentes Principales

- [Tablas](src/components/Table/readme.md)
- [Inputs Dinámicos](src/components/readme.md)

### Core del Sistema

- [`Componente Red`](/src/core/componente-red/readme.md)
- [`Control`](/src/core/control/readme.md)
- [`Fuente`](/src/core/fuente/readme.md)
- [`Red`](/src/core/red/readme.md)
- [`Relación Jerárquica`](/src/core/relacion-jerarquica/readme.md)
- [`Servicio`](/src/core/servicio/readme.md)
- [`Tipo Componente`](/src/core/tipo-componente/readme.md)

## Configuración del Entorno

### Variables de Entorno

```env
API_URL=http://localhost:8081
API_URL_MS_DIRECCIONES=""
API_URL_ESTACIONES=""
```

## Inicio Rápido

Este proyecto está construido con [Next.js](https://nextjs.org) y fue iniciado usando [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Instalación y Ejecución

1. Instalar dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
```

2. Iniciar servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver la aplicación.

### Características

- Utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para la optimización automática de fuentes
- Implementa la fuente [Geist](https://vercel.com/font) de Vercel

## Recursos Adicionales

Para aprender más sobre Next.js:

- [Documentación de Next.js](https://nextjs.org/docs) - Características y API
- [Aprende Next.js](https://nextjs.org/learn) - Tutorial interactivo
