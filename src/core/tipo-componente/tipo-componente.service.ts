import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateTipoComponenteDto } from "./dto/create.dto";
import { QueryTipoComponenteDto } from "./dto/search.dto";
import { UpdateTipoComponenteDto } from "./dto/update.dto";
import { TipoComponenteType } from "./tipo-componente.type";

export class TipoComponenteService {
  public async create(createTipoComponente: CreateTipoComponenteDto) {
    const response = await bff.post(
      "/v1/portal/ref-component-type",
      createTipoComponente,
    );
    return response;
  }

  public async findAll(queryTipoComponente: QueryTipoComponenteDto) {
    const response = await bff.get<PaginationDto<TipoComponenteType[]>>(
      "/v1/portal/ref-component-type",
      {
        params: queryTipoComponente,
      },
    );
    return response;
  }

  public async getById(id: number) {
    return await bff.get(`/v1/portal/ref-component-type/${id}`);
  }

  public async update(
    id: number,
    updateTipoComponente: UpdateTipoComponenteDto,
  ) {
    return await bff.put(
      `/v1/portal/ref-component-type/${id}`,
      updateTipoComponente,
    );
  }

  public async detele(id: number) {
    return await bff.delete(`/v1/portal/ref-component-type/${id}`);
  }

  public async approval(id: number, commentApproval: string) {
    return await bff.patch(`/v1/portal/ref-component-type/approval/${id}`, {
      status: 1,
      commentApproval,
    });
  }
}
