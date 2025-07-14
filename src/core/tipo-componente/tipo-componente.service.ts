import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateTipoComponenteDto } from "./dto/create.dto";
import { QueryTipoComponenteDto } from "./dto/search.dto";
import { TipoComponenteType } from "./tipo-componente.type";
import { AllTipoComponenteResponse } from "./tipo-componente.type";

export class TipoComponenteService {
  public async create(createTipoComponente: CreateTipoComponenteDto) {
    const response = await bff.post(
      "/v1/portal/ref-component-type",
      createTipoComponente,
    );
    return response;
  }

  public async findAll(queryTipoComponente: QueryTipoComponenteDto) {
    const response = await bff.get<PaginationDto<AllTipoComponenteResponse[]>>(
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
    public async All(
    idList:any,
  ) {
    return await bff.post(
      `/v1/portal/ref-component-type/ALL`,
      idList,
    );
  }

  public async update(
    id: number,
    dto: CreateTipoComponenteDto,
  ) {
    return await bff.put(
      `/v1/portal/ref-component-type/${id}`,
      dto,
    );
  }

  public async detele(id: number) {
    return await bff.delete(`/v1/portal/ref-component-type/${id}`);
  }

  public async approval(id: number, commentApproval: string) {
    return await bff.patch(`/v1/portal/ref-component-type/${id}`, {
      status: 1,
      commentApproval,
    });
  }
}
