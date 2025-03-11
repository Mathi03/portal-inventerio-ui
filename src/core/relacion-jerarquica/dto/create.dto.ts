import { RelacionJerarquicaType } from "../relacion-jerarquica.type";

export type CreateRelacionJerarquicaDto = Pick<
  RelacionJerarquicaType,
  | "status"
  | "controlId"
  | "refComponentTypeId"
  | "refNetworkId"
  | "superiorControlId"
>;
