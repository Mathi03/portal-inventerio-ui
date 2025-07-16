import { bff } from "../config";
import { ControlService } from "../control/control.service";
import { PaginationDto } from "../pagination/dto/create.dto";
import { ServicioService } from "../servicio/servicio.service";
import { ComponenteRedType } from "./componente-red.type";
import { CreateComponenteRedDto } from "./dto/create.dto";
import { QueryComponenteRedDto } from "./dto/search.dto";
import { UpdateComponenteRedDto } from "./dto/update.dto";

export class ComponenteRedService {
  private controlService = new ControlService();
  private servicioService = new ServicioService();
  public async create(createComponenteRed: CreateComponenteRedDto) {
    const response = await bff.post(
      "/v1/portal/components",
      createComponenteRed
    );
    return response;
  }

  public async findAll(queryComponenteRed: QueryComponenteRedDto) {
    const response = await bff.get<PaginationDto<ComponenteRedType[]>>(
      "/v1/portal/components",
      {
        params: queryComponenteRed,
      }
    );
    response.data.data.data = response.data.data.data.filter(
      (componente) => !componente.disabledAt
    );
    return response;
  }

  public async getById(id: number) {
    const {
      data: { data: componenteRed },
    } = await bff.get<{ data: ComponenteRedType }>(
      `/v1/portal/components/${id}`
    );
    /*Guillermo ojooooo const [control, services, relations] = await Promise.all([
      this.controlService.findById(componenteRed.controlId),
      this.servicioService.findAll({ controlId: componenteRed.controlId }),
      this.getRelations(componenteRed.id),
    ]);
    componenteRed.control = control;
    //GuillermocomponenteRed.service = services;
    componenteRed.relations = relations;*/
    console.log("getId ===> ", componenteRed)
    return componenteRed;
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
    observation: string
  ) {
    return await bff.patch(`/v1/portal/components/${id}`, {
      approvalComment,
      observation,
    });
  }
  public async getRelations(id: number) {
    const { data } = await bff
      .get<{
        data: { data: ComponenteRedType };
      }>(`/v1/portal/components/${id}/relation`)
      .catch((err) => err);
    return data?.data;
  }

  public async getByClientId(id: number, params: QueryComponenteRedDto) {
    const response = await bff.get<PaginationDto<ComponenteRedType[]>>(
      `/v1/portal/components/${id}/client`,
      {
        params,
      }
    );
    response.data.data.data = response.data.data.data.filter(
      (componente) => !componente.disabledAt
    );
    return response;
  }
}
