import { ComponenteRedType } from "../componente-red.type";

export interface QueryComponenteRedDto {
  page?: number;
  limit?: number;
  q?: string | null;
  control_id?: string;
  id?: string;
  controlLabel?: string;
  label?: string;
  name?: string;
  ref_component_type_id?: string;
  ref_network_id?: string;
  ref_source_id?: string;
  region_id?: string;
  station_id?: string;
  client_id?: string;
  id_tipo_circuito?: string;
}

export interface ParamsByAttribute {
  page?: number;
  limit?: number;
  ref_component_type_id?: string;
  ref_network_id?: string;
  region_id?: string;
  station_id?: string;
  attributes?: string;
  attributes2?: string;
  attributesId?: string;
  attributesId2?: string;
}

export interface ParamsByGetHierarchyRelations {
  limit_children?: number;
  limit_parent?: number;
  page_children?: number;
  page_parent?: number;
}

interface RelationPaginationData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  prev: number;
  next: number;
  pages: number;
  last: number;
  first: number;
}

export interface HierarchyRelationsResponse {
  success: boolean;
  data: {
    componentId: number;
    parents: RelationPaginationData<ComponenteRedType>;
    children: RelationPaginationData<ComponenteRedType>;
  };
  timestamp: number;
}