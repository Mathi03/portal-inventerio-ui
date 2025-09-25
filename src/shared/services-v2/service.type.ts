export interface GetAllResponse<T> {
  success: boolean;
  data: {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
    next: number;
    prev: number;
    pages: number;
    last: number;
    first: number;
  };
  timestamp: number;
}

export interface UpdateApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: number;
}