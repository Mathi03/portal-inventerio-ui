import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { CreateRedDto } from "./dto/create.dto";
import { QueryRedDto } from "./dto/search.dto";
import { UpdateRedDto } from "./dto/update.dto";
import { RedType } from "./red.type";

export class RedService {
  public async create(createRed: CreateRedDto) {
    const response = await bff.post("/v1/portal/ref-networks", createRed);
    return response;
  }

  public async findAll(queryRed: QueryRedDto) {
    const response = await bff.get<PaginationDto<RedType[]>>(
      "/v1/portal/ref-networks",
      {
        params: queryRed,
      },
    );
    return response;
  }

  public async getById() {
    const {} = await bff.get("/v1/portal/ref-component-type");
  }

  public async update(id: number, updateRed: UpdateRedDto) {
    return await bff.put(`/v1/portal/ref-networks/${id}`, updateRed);
  }

  public async detele(id: number) {
    return await bff.delete(`/v1/portal/ref-networks/${id}`);
  }
}
