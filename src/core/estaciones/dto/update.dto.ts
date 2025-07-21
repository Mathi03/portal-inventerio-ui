import { EstacionType } from "../estacion.type";

export type UpdateEstacionDto = Pick<
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
