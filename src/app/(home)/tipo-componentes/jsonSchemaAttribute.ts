import { z } from "zod";

const urlConIPRegex = new RegExp(
  "^(https?:\\/\\/)?(?:(?:[a-z0-9-]+\\.)+[a-z]{2,}|(?:\\d{1,3}\\.){3}\\d{1,3})(?:\\:\\d+)?(?:\\/\\S*)?$"
);

const posiblesValoresSchema = z.object({
  name: z.string(),
  value: z.string(),
});
const TypeEnum = z.union(
  [
    z.literal("number"),
    z.literal("string"),
    z.literal("array"),
    z.literal("date"),
    z.literal("boolean"),
  ],
  {
    invalid_type_error:
      "El tipo debe ser uno de: 'number', 'string', 'array', 'date' o 'boolean'",
    required_error:
      "El tipo debe ser uno de: 'number', 'string', 'array', 'date' o 'boolean'",
  }
);

const HtmlFormTypeEnum = z.union(
  [z.literal("input"), z.literal("select"), z.literal("date")],
  {
    invalid_type_error:
      "El tipo de formulario HTML debe ser 'input', 'select' o 'date'",
    required_error:
      "El tipo de formulario HTML debe ser 'input', 'select' o 'date'",
  }
);

const onChangeSchema = z.object({
  target_name: z.string(),
  valores_posibles_source: z.string(),
  valores_posibles_response: z.array(z.string()),
});

const atribsConfigSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: TypeEnum,
  html_form_type: HtmlFormTypeEnum,
  place_holder: z.string().optional(),
  required: z.boolean(),
  default: z.boolean(),
  valores_posibles2: z.array(posiblesValoresSchema).optional(),
});

const itemSchema = z.object({
  name: z.string({
    required_error: "El campo 'name' es obligatorio",
    invalid_type_error: "El campo 'name' debe ser una cadena",
  }),
  label: z.string({
    required_error: "El campo 'label' es obligatorio",
    invalid_type_error: "El campo 'label' debe ser una cadena",
  }),
  type: TypeEnum,
  html_form_type: HtmlFormTypeEnum, // si es select = valores_posibles o valores_posibles_sources
  place_holder: z.string().optional(),
  required: z.boolean({
    required_error: "El campo 'required' es obligatorio",
    invalid_type_error: "El campo 'required' debe ser un valor booleano",
  }),
  default: z.boolean({
    required_error: "El campo 'default' es obligatorio",
    invalid_type_error: "El campo 'default' debe ser un valor booleano",
  }),
  valores_posibles: z.array(posiblesValoresSchema).optional(),
  valores_posibles_source: z
    .string()
    .regex(urlConIPRegex, {
      message: "Debe ser una URL válida o una IP con puerto",
    })
    .optional(),
  valores_posibles_response: z.array(z.string()).optional(),
  // valores_posibles_sources: z.array(posiblesValoresSchema).optional(),
  on_change: onChangeSchema.optional(),
  depend_of: z.string().optional(),
  atribs_config: z.array(atribsConfigSchema).optional(),
  status: z.union([z.string(), z.number()]).optional(),
});

export const jsonSchemaAttribute = z.array(itemSchema);
