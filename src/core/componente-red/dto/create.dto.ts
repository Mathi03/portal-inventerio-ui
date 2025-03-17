import { ComponenteRedType } from "../componente-red.type";

export type CreateComponenteRedDto = Pick<
  ComponenteRedType,
  | "label"
  | "name"
  | "regionId"
  | "refNetworkId"
  | "stationId"
  | "refComponentTypeId"
  | "observation"
  | "attribute"
  | "status"
  | "refSourceId"
> & { service: any; control: any };
