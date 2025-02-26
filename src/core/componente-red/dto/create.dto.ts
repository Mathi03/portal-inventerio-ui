import { ComponenteRedType } from "../componente-red.type";

export type CreateComponenteRedDto = Pick<
  ComponenteRedType,
  | "label"
  | "name"
  | "regionId"
  | "refNetworkId"
  | "stationId"
  | "refComponentTypeId"
  | "code"
  | "observation"
  | "attribute"
  | "componentId"
  | "controlId"
  | "status"
  | "refSourceId"
>;
