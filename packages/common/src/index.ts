export * from './validators';

export type PaginationResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: null | number;
  hasPrevPage: boolean;
  prevPage: null | number;
};
