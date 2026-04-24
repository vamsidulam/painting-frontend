export type ProjectRecord = {
  id: string;
  name: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};
