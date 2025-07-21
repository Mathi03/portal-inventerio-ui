export interface QueryEstacionDto {
  page?: number;
  limit?: number;
  q?: string | null;
  codigo?: string;
  estatus?: string;
  estatusMorinre?: string;
  fields?: string;
  id?: string;
  nombre?: string;
}
