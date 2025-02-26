import { FuenteType } from "../fuente.type";

export type UpdateFuenteDto = Pick<
  FuenteType,
  | "label"
  | "name"
  | "status"
  | "refNetworkId"
  | "refComponentTypeId"
  | "version"
  | "attribute"
>;
