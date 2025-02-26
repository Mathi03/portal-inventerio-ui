import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { ComponenteRedType } from "./componente-red.type";
import { CreateComponenteRedDto } from "./dto/create.dto";
import { QueryComponenteRedDto } from "./dto/search.dto";
import { UpdateComponenteRedDto } from "./dto/update.dto";

export class ComponenteRedService {
  public async create(createComponenteRed: CreateComponenteRedDto) {
    const response = await bff.post(
      "/v1/portal/components",
      createComponenteRed,
    );
    return response;
  }

  public async findAll(queryComponenteRed: QueryComponenteRedDto) {
    const response = await bff.get<PaginationDto<ComponenteRedType[]>>(
      "/v1/portal/components",
      {
        params: queryComponenteRed,
      },
    );
    return response;
  }

  public async getById(id: number) {
    const { data } = await bff.get(`/v1/portal/components/${id}`);
    return data;
  }

  public async update(id: number, updateComponenteRed: UpdateComponenteRedDto) {
    return await bff.put(`/v1/portal/components/${id}`, updateComponenteRed);
  }

  public async detele(id: number) {
    return await bff.delete(`/v1/portal/components/${id}`);
  }

  public async approve(
    id: number,
    approvalComment: string,
    observation: string,
  ) {
    return await bff.put(`/v1/portal/components/${id}/APPROVE`, {
      approvalComment,
      observation,
    });
  }
}
