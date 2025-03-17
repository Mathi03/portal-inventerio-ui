# Documentación del Componente InputJson

## Descripción General

`InputJson` es un componente React que proporciona una interfaz de editor y visualizador de JSON con vista dividida. Permite a los usuarios ingresar y editar texto JSON mientras ven una vista previa en tiempo real de la estructura JSON analizada.

## Props del Componente

| Prop          | Tipo    | Valor por defecto | Descripción                                        |
| ------------- | ------- | ----------------- | -------------------------------------------------- |
| `codeDefault` | string  | `"{}"`            | Valor inicial del string JSON                      |
| `label`       | string  | `"Label"`         | Etiqueta del encabezado del componente             |
| `onChange`    | función | requerido         | Función callback que recibe el valor JSON parseado |

## Características

### 1. Diseño de Vista Dividida

- Lado izquierdo: Editor de texto JSON usando CodeMirror
- Lado derecho: Visualizador de árbol JSON usando `@uiw/react-json-view`
- Paneles redimensionables usando `@uiw/react-split`

### 2. Editor JSON (Panel Izquierdo)

- Resaltado de sintaxis para JSON
- Seguimiento de número de línea y columna
- Visualización de información de selección
- Validación en tiempo real
- Mensajes de error para JSON inválido

### 3. Vista Previa JSON (Panel Derecho)

- Visualización en árbol del JSON parseado
- Nodos colapsables
- Sin visualización de tipos de datos
- Manejo de estados de error

### 4. Controles del Encabezado

- Botón para formatear JSON (indenta con 2 espacios)
- Visualización de etiqueta del componente

### 5. Barra de Estado

- Muestra la posición actual del cursor
- Muestra información de selección
- Muestra mensajes de error cuando el JSON es inválido

## Funciones Principales

### `handleJson()`

- Parsea el texto actual a JSON
- Actualiza el panel de vista previa
- Dispara el callback `onChange`
- Maneja errores de parseo

### `formatJson(replacer = 2)`

- Formatea el texto JSON con indentación apropiada
- La indentación por defecto es de 2 espacios
- Preserva la estructura JSON
- Maneja errores de formateo

## Dependencias

```json
{
  "@uiw/react-split": "Para el diseño de paneles divididos",
  "@uiw/react-json-view": "Para visualización de árbol JSON",
  "@uiw/react-codemirror": "Para edición de código",
  "@codemirror/lang-json": "Para resaltado de sintaxis JSON"
}
```

## Estilos

El componente utiliza una combinación de:

- Clases de Tailwind CSS para diseño y espaciado
- Estilos en línea para posicionamiento específico y colores
- Alturas fijas y anchos responsivos
- Colores de fondo personalizados:
  - Editor: rgb(245, 245, 245)
  - Vista previa: rgb(255, 255, 255)

## Ejemplo de Uso

```tsx
import InputJson from "./components/InputJson";
function MiComponente() {
  const manejarCambioJson = (valor) => {
    console.log("JSON modificado:", valor);
  };
  return (
    <InputJson
      codeDefault='{"ejemplo": "datos"}'
      label="Configuración JSON"
      onChange={manejarCambioJson}
    />
  );
}
```

## Manejo de Errores

- Muestra mensajes de error para sintaxis JSON inválida
- Maneja valores undefined de forma elegante
- Los mensajes de error se muestran en rojo
- El panel de vista previa se limpia cuando el JSON es inválido

## Consideraciones de Rendimiento

- Utiliza `useCallback` para memorizar referencias a funciones
- `useEffect` para parseo JSON en cambios de código
- Renderizado eficiente mediante gestión de estado de React

# Input dinamyc

Componente encargado de insertar dinamicamente un atributo Form que el operador desea incluir dentro de sus formularios

```json
{
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  html_form_type: "input" | "select" | "date";
  valores_posibles?: Array<{
    name: string;
    value: string;
  }>;
  valores_posibles_source?: string;
  valores_posibles_response?: ["label", "id"];
  onChange?: (name: string, value: any) => void;
}
```

## name

atributo que representara como se guardara en base de datos.

Este datos no puede ser duplicado

## label

etiqueta que se le mostrara al cliente

## required

Indicarle al formulario si es requerido que rellene este atributo

## html_form_type

es el encargado de definir el tipo de input que se insertara dentro del formulario.
los posibles valores son:

- date
- inpit
- select

## valores_posibles

opciones posible que se le mostraran dentro del formulario

## valores_posibles_source

opciones dinamica que se cargaran segun la url especificado por el usuario y se renderizaran cuando se cree el componente

## valores_posibles_response

opcion para indicar cuales son las keys que se le presentaria al cliente

- [0] label : key
- [1] id : key
