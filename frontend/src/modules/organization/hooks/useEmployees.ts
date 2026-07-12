import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEmployees, promoteEmployee, updateEmployeeStatus } from '../api/organization.api';
import { EmployeeListParams } from '../types/organization.types';

const EMPLOYEES_KEY = 'employees';

export const useEmployees = (params: EmployeeListParams) => {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, params],
    queryFn: () => fetchEmployees(params),
  });
};

export const usePromoteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'DEPARTMENT_HEAD' | 'ASSET_MANAGER' | 'EMPLOYEE' }) =>
      promoteEmployee(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) => updateEmployeeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
};
