import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateRelacionJerarquicaDto } from "./dto/create.dto";
import { QueryRelacionJerarquicaDto } from "./dto/search.dto";
import { UpdateRelacionJerarquicaeDto } from "./dto/update.dto";
import { RelacionJerarquicaType } from "./relacion-jerarquica.type";

export class RelacionJerarquicaService {
  public async create(createRelacionJerarquica: CreateRelacionJerarquicaDto) {
    const response = await bff.post(
      "/v1/portal/hierarchy-relations",
      createRelacionJerarquica,
    );
    return response;
  }

  public async findAll(queryRelacionJerarquica: QueryRelacionJerarquicaDto) {
    const response = await bff.get<PaginationDto<RelacionJerarquicaType[]>>(
      "/v1/portal/hierarchy-relations",
      {
        params: queryRelacionJerarquica,
      },
    );
    return response;
  }

  public async getById() {
    const {} = await bff.get("/v1/portal/hierarchy-relations");
  }

  public async update(
    id: number,
    updateRelacionJerarquicae: UpdateRelacionJerarquicaeDto,
  ) {
    return await bff.put(
      `/v1/portal/hierarchy-relations/${id}`,
      updateRelacionJerarquicae,
    );
  }

  public async detele(id: number) {
    return await bff.delete(`/v1/portal/hierarchy-relations/${id}`);
  }
}
