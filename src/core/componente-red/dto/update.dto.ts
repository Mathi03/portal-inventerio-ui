import { ComponenteRedType } from "../componente-red.type";

export type UpdateComponenteRedDto = Pick<
  ComponenteRedType,
  "label" | "name" | "status"
>;
