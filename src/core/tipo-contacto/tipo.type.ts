export interface Tipo {
  id: number;
  name?: string;
  abbreviation?: string;
  description?: string;
  status?: number;
}

export interface TipoFilter {
  page?: number;
  limit?: number;
  defaults?: boolean;
  fields?: string;

  name?: string;
  abbreviation?: string;
  status?: number;
}
