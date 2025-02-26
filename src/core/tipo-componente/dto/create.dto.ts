import { TipoComponenteType } from "../tipo-componente.type";

export type CreateTipoComponenteDto = Pick<
  TipoComponenteType,
  | "label"
  | "name"
  | "status"
  | "configAttributes"
  | "configServices"
  | "configRelations"
>;
