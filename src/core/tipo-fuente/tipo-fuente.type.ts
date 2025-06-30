export enum TipoFuenteStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface TipoFuenteType {
  id: number;
  label: string;
  name: string;
  status: TipoFuenteStatusEnum;
  updatedBy: string;
  updatedAt: string;
  createdBy: string;
  createdAt: string;
}

export const TipoFuenteStatusEnumOptions = [
  {
    label: "Activo",
    value: TipoFuenteStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: TipoFuenteStatusEnum.INACTIVO,
  },
];
