export enum FuenteStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface FuenteType {
  id: number; //id
  label: string; //etiqueta
  name: string; //nombre
  status: FuenteStatusEnum; //estatus
  refNetworkId: number; //id_red
  refComponentTypeId: number; //id_tipo_componente
  version: string; //version
  attribute: string; //atributo
  createdAt: string; //fecha_creacion
  updatedAt: string; //fecha_actualizacion
}

export const FuenteStatusEnumOptions = [
  {
    label: "Activo",
    value: FuenteStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: FuenteStatusEnum.INACTIVO,
  },
];
