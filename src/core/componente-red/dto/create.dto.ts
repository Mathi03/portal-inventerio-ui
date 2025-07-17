import { ComponenteRedType } from "../componente-red.type";

export type CreateComponenteRedDto = Pick<
  ComponenteRedType,
  | "regionId"
  | "refNetworkId"
  | "stationId"
  | "refComponentTypeId"
  | "observation"
  | "status"
  | "refSourceId"
  | "code"
  | "codigo"
  | "controlId"
  | "componentId"
> & { attribute:any, service: any; control: any };
