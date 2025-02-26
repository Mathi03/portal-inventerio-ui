import { RedType } from "../red.type";

export type CreateRedDto = Pick<RedType, "label" | "name" | "status">;
