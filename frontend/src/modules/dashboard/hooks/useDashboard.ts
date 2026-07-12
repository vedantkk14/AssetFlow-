import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminDashboard,
  fetchAssetManagerDashboard,
  fetchDepartmentDashboard,
  fetchEmployeeDashboard,
} from '../api/dashboard.api';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: fetchAdminDashboard,
  });
};

export const useAssetManagerDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'asset-manager'],
    queryFn: fetchAssetManagerDashboard,
  });
};

export const useDepartmentDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'department'],
    queryFn: fetchDepartmentDashboard,
  });
};

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'employee'],
    queryFn: fetchEmployeeDashboard,
  });
};
