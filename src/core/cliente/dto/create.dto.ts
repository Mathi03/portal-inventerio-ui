import { ClienteType } from "../cliente.type";

export type CreateFuenteDto = Pick<
  ClienteType,
  | "label"
  | "name"
  | "status"
  | "refNetworkId"
  | "refComponentTypeId"
  | "refTypeSourceId"
  | "version"
  | "attribute"
>;
