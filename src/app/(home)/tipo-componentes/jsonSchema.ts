import { z } from "zod";

const posiblesValoresSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const itemSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.union([z.literal("number"), z.literal("string")]),
  html_form_type: z.union([z.literal("input"), z.literal("select")]), // si es select = valores_posibles o valores_posibles_sources
  place_holder: z.string(),
  required: z.boolean(),
  default: z.boolean(),
  valores_posibles: z.array(posiblesValoresSchema).optional(),
  valores_posibles_sources: z.array(posiblesValoresSchema).optional(),
});

export const jsonSchema = z.array(itemSchema);
