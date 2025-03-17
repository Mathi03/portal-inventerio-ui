import { ControlType } from "../control/control.type";
import { ServicioType } from "../servicio/servicio.type";

export enum CRStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface ComponenteRedType {
  id: number;
  label: string;
  name: string;
  code: string;
  controlId: number;
  stationId: number;
  regionId: number;
  refNetworkId: number;
  refComponentTypeId: number;
  componentId: number;
  attribute: string;
  approvalComment: string;
  observation: string;
  status: CRStatusEnum;
  disabledAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  refSourceId: number;
  control?: ControlType;
  service?: ServicioType;
  relations: any;
}

export const CRStatusEnumOptions = [
  {
    label: "Activo",
    value: CRStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: CRStatusEnum.INACTIVO,
  },
];
