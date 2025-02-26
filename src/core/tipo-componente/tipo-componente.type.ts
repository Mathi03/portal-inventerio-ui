export enum TCStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface TipoComponenteType {
  id: number; //id
  label: string; //etiqueta
  name: string; //nombre
  configAttributes: any[]; //atributos_config
  configServices: any[]; //servicios_config
  configRelations: any; //relaciones_config
  status: TCStatusEnum; //estatus
  createdAt: string; //fecha_creacion
  updatedAt: string; //fecha_actualizacion
}

export const TCStatusEnumOptions = [
  {
    label: "Activo",
    value: TCStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: TCStatusEnum.INACTIVO,
  },
];
