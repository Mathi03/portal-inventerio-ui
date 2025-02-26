import { bff } from "../config";
import { PaginationDto } from "../pagination/dto/create.dto";
import { ControlType } from "./control.type";

export class ControlService {
  async findAll() {
    const response = await bff.get<PaginationDto<ControlType[]>>(
      "/v1/portal/controls",
    );
    return response;
  }
}
