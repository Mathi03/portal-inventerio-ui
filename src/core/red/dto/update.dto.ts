import { RedType } from "../red.type";

export type UpdateRedDto = Pick<RedType, "label" | "name" | "status">;
