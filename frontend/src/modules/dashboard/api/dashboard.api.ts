import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiSuccessResponse } from '@/types/api.types';
import {
  AdminDashboardData,
  AssetManagerDashboardData,
  DepartmentHeadDashboardData,
  EmployeeDashboardData,
} from '../types/dashboard.types';

export const fetchAdminDashboard = async () => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<AdminDashboardData>>(API_ENDPOINTS.DASHBOARD.ADMIN);
  return data.data;
};

export const fetchAssetManagerDashboard = async () => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<AssetManagerDashboardData>>(
    API_ENDPOINTS.DASHBOARD.ASSET_MANAGER
  );
  return data.data;
};

export const fetchDepartmentDashboard = async () => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<DepartmentHeadDashboardData>>(
    API_ENDPOINTS.DASHBOARD.DEPARTMENT_HEAD
  );
  return data.data;
};

export const fetchEmployeeDashboard = async () => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<EmployeeDashboardData>>(
    API_ENDPOINTS.DASHBOARD.EMPLOYEE
  );
  return data.data;
};
