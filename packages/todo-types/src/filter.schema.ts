export type Filter = {
  query?: string;
  completed?: "true" | "false" | boolean;
  createdAt?: string;
  sort?:
    | "createdAt_desc"
    | "createdAt_asc"
    | "title_desc"
    | "title_asc"
    | "completed_desc"
    | "completed_asc";
  offset?: number;
  limit?: number;
};

export type PaginationInfo = {
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextOffset: number;
  previousOffset: number;
  nextLimit: number;
  previousLimit: number;
};
