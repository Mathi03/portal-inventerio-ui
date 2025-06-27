import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateTipoFuenteDto } from "./dto/create.dto";
import { QueryFuenteDto } from "./dto/search.dto";
import { UpdateTipoFuenteDto } from "./dto/update.dto";
import { TipoFuenteType } from "./tipo-fuente.type";

export class TipoFuenteService {
  public async create(createTipoFuente: CreateTipoFuenteDto) {
    const response = await bff.post(
      "/v1/portal/ref-source-types",
      createTipoFuente
    );
    return response;
  }

  public async findAll(queryFuente: QueryFuenteDto) {
    const response = await bff.get<PaginationDto<TipoFuenteType[]>>(
      "/v1/portal/ref-source-types",
      {
        params: queryFuente,
      }
    );
    return response;
  }

  public async getById(id: number) {
    return await bff.get(`/v1/portal/ref-source-types/${id}`);
  }

  public async update(id: number, updateTipoFuente: UpdateTipoFuenteDto) {
    return await bff.put(`/v1/portal/ref-source-types/${id}`, updateTipoFuente);
  }

  public async delete(id: number) {
    return await bff.delete(`/v1/portal/ref-source-types/${id}`);
  }
}
