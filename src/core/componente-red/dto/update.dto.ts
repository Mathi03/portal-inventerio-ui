import { CreateComponenteRedDto } from "./create.dto";

export type UpdateComponenteRedDto = CreateComponenteRedDto & {
  serviceModified: boolean;
  relationModified: boolean;
  approvalComment: string;
};
