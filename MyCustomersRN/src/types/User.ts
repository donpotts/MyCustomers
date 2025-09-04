export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface UpdateUserDto {
  newEmail?: string;
  newPassword?: string;
  isAdmin?: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}