export enum RedStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface RedType {
  id: number; //id
  label: string; //etiqueta
  name: string; //nombre
  status: RedStatusEnum; //estatus
  createdAt: string; //fecha_creacion
  updatedAt: string; //fecha_actualizacion
}

export const RedStatusEnumOptions = [
  {
    label: "Activo",
    value: RedStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: RedStatusEnum.INACTIVO,
  },
];
