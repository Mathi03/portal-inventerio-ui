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

  async findById(id: number) {
    const {
      data: { data: control },
    } = await bff.get<{ data: ControlType }>(`/v1/portal/controls/${id}`);
    return control;
  }
}
