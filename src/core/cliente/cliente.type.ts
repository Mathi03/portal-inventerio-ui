export enum ClienteStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface ClienteType {
  id: number; //id
  idestatus: number;
  nombreadministrativo: string;
  rif: string;
  nombrecomercial: string;
  updatedBy: string; //fecha_creacion
  updatedAt: string; //fecha_actualizacion
}

export const ClienteStatusEnumOptions = [
  {
    label: "Activo",
    value: ClienteStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: ClienteStatusEnum.INACTIVO,
  },
];
