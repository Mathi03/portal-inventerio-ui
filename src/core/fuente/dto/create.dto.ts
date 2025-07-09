import { FuenteType } from "../fuente.type";

export type CreateFuenteDto = Pick<
  FuenteType,
  | "label"
  | "name"
  | "status"
  | "refNetworkId"
  | "refComponentTypeId"
  | "refTypeSourceId"
  | "version"
  | "attribute"
>;
