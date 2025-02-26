import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { ServicioType } from "./servicio.type";

export class ServicioService {
  async findAll() {
    const response = await bff.get<PaginationDto<ServicioType[]>>(
      "/v1/portal/services",
    );
    return response;
  }
}
