import { TipoFuenteType } from "../tipo-fuente.type";

export type UpdateTipoFuenteDto = Pick<
  TipoFuenteType,
  "label" | "name" | "status"
>;
