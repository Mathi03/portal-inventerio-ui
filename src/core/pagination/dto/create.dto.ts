export interface PaginationDto<T> {
  data: {
    data: T;
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
    prev: number;
    next: number;
    pages: number;
    last: number;
    first: number;
  };
}
