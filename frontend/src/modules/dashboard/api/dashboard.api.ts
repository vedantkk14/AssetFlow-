import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { useQuery } from '@tanstack/react-query';
import {
  AdminDashboardData,
  AssetManagerDashboardData,
  DepartmentHeadDashboardData,
  EmployeeDashboardData
} from '../types/dashboard.types';

// Admin API
export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const response = await axiosInstance.get<{ data: AdminDashboardData }>(API_ENDPOINTS.DASHBOARD.ADMIN);
  return response.data.data;
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: getAdminDashboardData,
  });
};

// Asset Manager API
export const getAssetManagerDashboardData = async (): Promise<AssetManagerDashboardData> => {
  const response = await axiosInstance.get<{ data: AssetManagerDashboardData }>(API_ENDPOINTS.DASHBOARD.ASSET_MANAGER);
  return response.data.data;
};

export const useAssetManagerDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'asset-manager'],
    queryFn: getAssetManagerDashboardData,
  });
};

// Department Head API
export const getDepartmentDashboardData = async (): Promise<DepartmentHeadDashboardData> => {
  const response = await axiosInstance.get<{ data: DepartmentHeadDashboardData }>(API_ENDPOINTS.DASHBOARD.DEPARTMENT_HEAD);
  return response.data.data;
};

export const useDepartmentDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'department'],
    queryFn: getDepartmentDashboardData,
  });
};

// Employee API
export const getEmployeeDashboardData = async (): Promise<EmployeeDashboardData> => {
  const response = await axiosInstance.get<{ data: EmployeeDashboardData }>(API_ENDPOINTS.DASHBOARD.EMPLOYEE);
  return response.data.data;
};

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'employee'],
    queryFn: getEmployeeDashboardData,
  });
};
