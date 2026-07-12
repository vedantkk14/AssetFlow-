import { Role, Status } from '@prisma/client';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatusUpdateInput {
  status: Status;
}

// Department

export interface CreateDepartmentInput {
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string | null;
  departmentHeadId?: string | null;
}

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

// Asset Category

export interface CreateCategoryInput {
  name: string;
  description?: string;
  defaultWarrantyMonths?: number;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Employee

export interface EmployeeListQuery extends PaginationQuery {
  department?: string;
  role?: Role;
  status?: Status;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PromoteEmployeeInput {
  role: Role;
}
