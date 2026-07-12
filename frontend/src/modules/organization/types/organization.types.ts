import { Role } from '@/types/role.types';

export type EntityStatus = 'ACTIVE' | 'INACTIVE';

export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
}

export interface DepartmentHeadSummary {
  id: string;
  name: string;
  email: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  parentDepartmentId: string | null;
  parentDepartment: DepartmentSummary | null;
  departmentHeadId: string | null;
  departmentHead: DepartmentHeadSummary | null;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  _count: { employees: number };
}

export interface CreateDepartmentPayload {
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string | null;
  departmentHeadId?: string | null;
}

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;

export interface AssetCategory {
  id: string;
  name: string;
  description: string | null;
  defaultWarrantyMonths: number | null;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  defaultWarrantyMonths?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  department: DepartmentSummary | null;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface EmployeeListParams extends PaginationParams {
  department?: string;
  role?: Role;
  status?: EntityStatus;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
