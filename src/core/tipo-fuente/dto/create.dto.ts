import { TipoFuenteType } from "../tipo-fuente.type";

export type CreateTipoFuenteDto = Pick<TipoFuenteType, "label" | "name" | "status">;
