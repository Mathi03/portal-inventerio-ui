export interface Contacto {
  id?: number;
  names?: string;
  lastNames?: string;
  email?: string;
}

export interface ContactoFilter {
  page?: number;
  limit?: number;
  defaults?: boolean;
  fields?: string;
  id?: number;
  nombre?: string;

  apellido?: string;
  email?: string;
  tmve_app_id?: number;
}
