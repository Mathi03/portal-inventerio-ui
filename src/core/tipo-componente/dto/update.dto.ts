import { TipoComponenteType } from "../tipo-componente.type";

export type UpdateTipoComponenteDto = Pick<
  TipoComponenteType,
  | "label"
  | "name"
  | "status"
  | "configAttributes"
  | "configServices"
  | "commentApproval"
>;
