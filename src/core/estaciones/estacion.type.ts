export enum EstacionStatusEnum {
  ACTIVO = 1,
  INACTIVO = 0,
}
export interface EstacionType {
  id: number;
  idEstacion: number;
  codigo: string;
  nombre: string;
  regionId: number;
  estadoId: number;
  municipioId: number;
  parroquiaId: number;
  direccion: string;
  codigoPais: string;
  mercadoId: number;
  clusterId: number;
  atributos: Atributo[];
  comentAprobacion: string;
  tmveOwner: boolean;
  estatus: number;
  estatusMorinre: number;
  createdBy: string;
  region: Region;
  mercado: Mercado;
  cluster: Cluster;
}

interface Atributo {
  [key: string]: any;
}

interface Region {
  id: number;
  nombre: string;
  descripcion: string;
  estatus: number;
  fechaModificacion: string;
  fechaCreacion: string;
}

interface Mercado {
  id: number;
  nombre: string;
  descripcion: string;
  estatus: number;
  fechaModificacion: string;
  fechaCreacion: string;
}

interface Cluster {
  id: number;
  label: string;
  name: string;
  refClusterStatus: number;
  idCluster: number;
  regionId: number;
}

export const EstacionStatusEnumOptions = [
  {
    label: "Activo",
    value: EstacionStatusEnum.ACTIVO,
  },
  {
    label: "Inactivo",
    value: EstacionStatusEnum.INACTIVO,
  },
];
