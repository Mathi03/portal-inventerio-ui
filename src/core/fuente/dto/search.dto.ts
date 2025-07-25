export interface QueryFuenteDto {
  page?: number;
  limit?: number;
  q?: string | null;
  refNetworkId?: number;
  refComponentTypeId?: number;
}
