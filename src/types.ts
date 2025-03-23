export type User = {
  id: string;
  name: string;
  email: string;
};

export type ApiError = {
  success: boolean;
  code: number;
  data: [];
  errors: Record<string, string[]>;
  message: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  category: Category;
};

export type PaginationType = {
  has_pages: boolean;
  current_page: number;
  last_page: number;
  per_page: number;
  total_records: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
};
