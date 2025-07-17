export enum ClienteStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface ClienteType {
  id: number; //id
  label: string; //etiqueta
  name: string; //nombre
  status: ClienteStatusEnum; //estatus
  refNetworkId: number; //id_red
  refComponentTypeId: number; //id_tipo_componente
  refTypeSourceId: number;
  version: string; //version
  attribute: string; //atributo
  createdAt: string; //fecha_creacion
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
