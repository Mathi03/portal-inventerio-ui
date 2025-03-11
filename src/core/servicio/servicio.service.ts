import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { QueryServiceDto } from "./dto/query.dto";
import { ServicioType } from "./servicio.type";

export class ServicioService {
  async findAll({ controlId }: QueryServiceDto) {
    const {
      data: {
        data: { data: service },
      },
    } = await bff.get<PaginationDto<ServicioType[]>>("/v1/portal/services", {
      params: {
        controlId,
      },
    });
    return service;
  }
}
