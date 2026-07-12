import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiSuccessResponse } from '@/types/api.types';
import {
  AssetCategory,
  CreateCategoryPayload,
  CreateDepartmentPayload,
  Department,
  Employee,
  EmployeeListParams,
  PaginatedResult,
  PaginationParams,
  UpdateCategoryPayload,
  UpdateDepartmentPayload,
} from '../types/organization.types';

// Departments

export const fetchDepartments = async (params: PaginationParams) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<PaginatedResult<Department>>>(
    API_ENDPOINTS.DEPARTMENTS,
    { params }
  );
  return data.data;
};

export const createDepartment = async (payload: CreateDepartmentPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse<{ department: Department }>>(
    API_ENDPOINTS.DEPARTMENTS,
    payload
  );
  return data.data.department;
};

export const updateDepartment = async (id: string, payload: UpdateDepartmentPayload) => {
  const { data } = await axiosInstance.put<ApiSuccessResponse<{ department: Department }>>(
    `${API_ENDPOINTS.DEPARTMENTS}/${id}`,
    payload
  );
  return data.data.department;
};

export const updateDepartmentStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ department: Department }>>(
    `${API_ENDPOINTS.DEPARTMENTS}/${id}/status`,
    { status }
  );
  return data.data.department;
};

// Asset Categories

export const fetchCategories = async (params: PaginationParams) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<PaginatedResult<AssetCategory>>>(
    API_ENDPOINTS.CATEGORIES,
    { params }
  );
  return data.data;
};

export const createCategory = async (payload: CreateCategoryPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse<{ category: AssetCategory }>>(
    API_ENDPOINTS.CATEGORIES,
    payload
  );
  return data.data.category;
};

export const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
  const { data } = await axiosInstance.put<ApiSuccessResponse<{ category: AssetCategory }>>(
    `${API_ENDPOINTS.CATEGORIES}/${id}`,
    payload
  );
  return data.data.category;
};

export const updateCategoryStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ category: AssetCategory }>>(
    `${API_ENDPOINTS.CATEGORIES}/${id}/status`,
    { status }
  );
  return data.data.category;
};

// Employees

export const fetchEmployees = async (params: EmployeeListParams) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<PaginatedResult<Employee>>>(
    API_ENDPOINTS.EMPLOYEES,
    { params }
  );
  return data.data;
};

export const promoteEmployee = async (id: string, role: 'DEPARTMENT_HEAD' | 'ASSET_MANAGER' | 'EMPLOYEE') => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ employee: Employee }>>(
    `${API_ENDPOINTS.EMPLOYEES}/${id}/promote`,
    { role }
  );
  return data.data.employee;
};

export const updateEmployeeStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ employee: Employee }>>(
    `${API_ENDPOINTS.EMPLOYEES}/${id}/status`,
    { status }
  );
  return data.data.employee;
};
