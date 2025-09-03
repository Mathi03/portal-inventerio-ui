import { estaciones } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateEstacionDto } from "./dto/create.dto";
import { QueryEstacionDto } from "./dto/search.dto";
import { UpdateEstacionDto } from "./dto/update.dto";
import { EstacionType } from "./estacion.type";

export class EstacionService {
  public async create(createFuente: CreateEstacionDto) {
    const response = await estaciones.post("/v1/estaciones", createFuente);
    return response;
  }

  public async findAll(queryFuente: QueryEstacionDto, signal?: AbortSignal) {
    const response = await estaciones.get<PaginationDto<EstacionType[]>>(
      "/v1/estaciones",
      {
        params: queryFuente,
        signal
      }
    );
    return response;
  }

  public async getById(id: number) {
    return await estaciones.get(`/v1/estaciones/${id}`);
  }

  public async update(id: number, updateFuente: UpdateEstacionDto) {
    return await estaciones.put(`/v1/estaciones/${id}`, updateFuente);
  }

  public async delete(id: number) {
    return await estaciones.delete(`/v1/estaciones/${id}`);
  }
}
