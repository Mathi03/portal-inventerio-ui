import { RelacionJerarquicaType } from "../relacion-jerarquica.type";

export type UpdateRelacionJerarquicaeDto = Pick<
  RelacionJerarquicaType,
  | "controlId"
  | "refComponentTypeId"
  | "refNetworkId"
  | "status"
  | "superiorControlId"
>;
