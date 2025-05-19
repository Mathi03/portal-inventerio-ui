export enum TCStatusEnum {
  PORMODIFICAR = 3,
  PORAPROBAR = 2,
  ACTIVO = 1,
  INACTIVO = 0,
}

export enum TCTypeEnum {
  FISICO = 1,
  LOGICO = 0,
}
export interface TipoComponenteType {
  id: number; //id
  label: string; //etiqueta
  name: string; //nombre
  configAttributes: any[]; //atributos_config
  configServices: any[]; //servicios_config
  status: TCStatusEnum; //estatus
  createdAt: string; //fecha_creacion
  updatedAt: string; //fecha_actualizacion
  commentApproval?: string;
}

export interface TipoComponenteRed {
  red: string; //etiqueta
  configAttributes: any[]; //atributos_config
  configServices: any[]; //servicios_config
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
    {
    label: "Por aprobar",
    value: TCStatusEnum.PORAPROBAR,
  },
    {
    label: "Por modificar",
    value: TCStatusEnum.PORMODIFICAR,
  }
];
export const TCTypeEnumOptions = [
  {
    label: "Logico",
    value: TCTypeEnum.FISICO,
  },
  {
    label: "Fisico",
    value: TCTypeEnum.LOGICO,
  }
];
