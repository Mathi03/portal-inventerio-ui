import { ClienteType } from "../cliente.type";

export type UpdateFuenteDto = Pick<
  ClienteType,
  | "label"
  | "name"
  | "status"
  | "refNetworkId"
  | "refComponentTypeId"
  | "version"
  | "attribute"
>;
