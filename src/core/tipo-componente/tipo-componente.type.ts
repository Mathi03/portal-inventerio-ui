export enum TCStatusEnum {
  PORMODIFICAR = 4,
  PORAPROBAR = 3,
  INACTIVO = 2,
  ACTIVO = 1,
}

export enum TCTypeEnum {
  FISICO = 1,
  LOGICO = 0,
}
/*export interface TipoComponenteType {
  id: number; //id
  label: string; //etiqueta
  name: string; //nombre
  type: string; //tipo
  flagAlone:boolean//posee componente padre?
  status: TCStatusEnum; //estatus
  createdAt: string; //fecha_creacion
  updatedAt: string; //fecha_actualizacion
  commentApproval?: string;
}*/

export interface TipoComponenteType {
  id:              number;
  label:           string;
  name:            string;
  status:          number;
  commentApproval: string;
  tipo:            string;
  configData:      ConfigData[];
  configRelation:  ConfigRelation[];
}

interface ConfigData {
  id: number;
  componentTypeId: number;
  networkId: number;
  status: number;
  configAttributes: ConfigDataAttribute[];
  configServices: ConfigDataService[]; // Ajusta según la estructura real
}

interface ConfigDataAttribute {
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  place_holder: string;
  html_form_type: "input" | "select" | "date";
  valores_posibles?: Array<{ name: string; value: string }>;
  atribs_config: ConfigDataAtribs_config[]
}

interface ConfigDataService {
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  place_holder: string;
  html_form_type: "input" | "select" | "date";
  valores_posibles?: Array<{ name: string; value: string }>;
  atribs_config: ConfigDataAtribs_config[]
}

interface ConfigDataAtribs_config {
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  place_holder: string;
  html_form_type: "input" | "select" | "date";
  valores_posibles?: Array<{ name: string; value: string }>;
}


export interface CreateRefComponentTypeRequestDto {
  label: string;
  name: string;
  status: number;
  commentApproval: string;
  tipo: string;
  flagAlone: boolean;
}

export interface ConfigAttribute {
  [key: string]: string;
}

export interface ConfigService {
  [key: string]: string;
}

export interface CreateConfigDataRequestDto {
  componentTypeId: number;
  networkId: number;
  status: number;
  configAttributes: ConfigAttribute[];
  configServices: ConfigService[];
}

export interface CreateConfigRelationRequestDto {
  componentTypeId: number;
  componentTypeFatherId: number;
  networkId: number;
  networkFatherId: number;
  status: number;
}

export interface CreateTipoComponenteRequest {
  createRefComponentTypeRequestDto: CreateRefComponentTypeRequestDto;
  createConfigDataRequestDto: CreateConfigDataRequestDto[];
  createConfigRelationRequestDto: CreateConfigRelationRequestDto[];
}

export interface UpdateTipoComponenteRequest {
  updateRefComponentTypeRequestDto: CreateRefComponentTypeRequestDto;
  updateConfigDataRequestDto: CreateConfigDataRequestDto[];
  updateConfigRelationRequestDto: CreateConfigRelationRequestDto[];
}

export interface AllTipoComponenteResponse {
    id:              number;
    label:           string;
    name:            string;
    status:          number;
    commentApproval: string;
    tipo:            string;
    configData:      ConfigDatum[];
    configRelation:  ConfigRelation[];
}

export interface ConfigDatum {
    id:               number;
    componentTypeId:  number;
    networkId:        number;
    status:           number;
    configAttributes: any[];
    configServices:   any[];
}




export interface ConfigRelation {
    componentTypeId:       number;
    componentTypeFatherId: number;
    networkId:             number;
    networkFatherId:       number;
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
