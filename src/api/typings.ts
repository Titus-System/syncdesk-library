export interface ApiResponse<T> {
  data: T;
  meta?: any;
}

export type PaginatedRequest = {
  page?: number;
  limit?: number;
};
