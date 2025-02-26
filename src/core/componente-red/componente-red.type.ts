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
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  refSourceId: number;
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
