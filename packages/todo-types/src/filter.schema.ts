export type Filter = {
  query?: string;
  completed?: "true" | "false" | boolean;
  createdAt?: string;
  sort?: string;
  offset?: number;
  limit?: number;
};

export type PaginationInfo = {
  hasNext: boolean;
  hasPrevious: boolean;
  nextOffset: number;
  previousOffset: number;
  nextLimit: number;
  previousLimit: number;
};
