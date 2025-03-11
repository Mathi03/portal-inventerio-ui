export interface QueryComponenteRedDto {
  page?: number;
  limit?: number;
  q?: string | null;
  control_id: string;
  id: string;
  label: string;
  name: string;
  ref_component_type_id: string;
  ref_network_id: string;
  ref_source_id: string;
  region_id: string;
  station_id: string;
}
