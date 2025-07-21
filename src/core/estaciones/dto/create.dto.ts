import { EstacionType } from "../estacion.type";

export type CreateEstacionDto = Pick<
  EstacionType,
  | "codigo"
  | "nombre"
  | "regionId"
  | "estadoId"
  | "municipioId"
  | "parroquiaId"
  | "direccion"
  | "codigoPais"
>;
