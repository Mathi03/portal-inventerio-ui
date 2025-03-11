import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateFuenteDto } from "./dto/create.dto";
import { QueryFuenteDto } from "./dto/search.dto";
import { UpdateFuenteDto } from "./dto/update.dto";
import { FuenteType } from "./fuente.type";

export class FuenteService {
  public async create(createFuente: CreateFuenteDto) {
    const response = await bff.post("/v1/portal/ref-sources", createFuente);
    return response;
  }

  public async findAll(queryFuente: QueryFuenteDto) {
    const response = await bff.get<PaginationDto<FuenteType[]>>(
      "/v1/portal/ref-sources",
      {
        params: queryFuente,
      },
    );
    return response;
  }

  public async getById(id: number) {
    return await bff.get(`/v1/portal/ref-sources/${id}`);
  }

  public async update(id: number, updateFuente: UpdateFuenteDto) {
    return await bff.put(`/v1/portal/ref-sources/${id}`, updateFuente);
  }

  public async detele(id: number) {
    return await bff.delete(`/v1/portal/ref-sources/${id}`);
  }
}
