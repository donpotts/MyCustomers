export interface Customer {
  id: string;
  name: string;
  email: string;
  number?: string;
  notes?: string;
  createdDate: string;
  updatedDate: string;
  firstName?: string;
  lastName?: string;
}

export interface CreateUpdateCustomerDto {
  name: string;
  email: string;
  number?: string;
  notes?: string;
  createdDate: string;
  updatedDate: string;
  firstName?: string;
  lastName?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}