import { cnr } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateFuenteDto as CreateClienteDto } from "./dto/create.dto";
import { QueryClienteDto } from "./dto/search.dto";
import { UpdateFuenteDto } from "./dto/update.dto";
import { ClienteType } from "./cliente.type";

export class ClienteService {
  public async create(createFuente: CreateClienteDto) {
    const response = await cnr.post("/v1/cnr/clients", createFuente);
    return response;
  }

  public async findAll(queryFuente: QueryClienteDto, signal?: AbortSignal) {
    const response = await cnr.get<PaginationDto<ClienteType[]>>(
      "/v1/cnr/clients",
      {
        params: queryFuente,
        signal,
      }
    );
    return response;
  }

  public async getById(id: number) {
    return await cnr.get(`/v1/cnr/clients/${id}`);
  }

  public async update(id: number, updateFuente: UpdateFuenteDto) {
    return await cnr.put(`/v1/cnr/clients/${id}`, updateFuente);
  }

  public async delete(id: number) {
    return await cnr.delete(`/v1/cnr/clients/${id}`);
  }
}
