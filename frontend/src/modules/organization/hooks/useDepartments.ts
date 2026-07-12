import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDepartment,
  fetchDepartments,
  updateDepartment,
  updateDepartmentStatus,
} from '../api/organization.api';
import { CreateDepartmentPayload, PaginationParams, UpdateDepartmentPayload } from '../types/organization.types';

const DEPARTMENTS_KEY = 'departments';

export const useDepartments = (params: PaginationParams) => {
  return useQuery({
    queryKey: [DEPARTMENTS_KEY, params],
    queryFn: () => fetchDepartments(params),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_KEY] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentPayload }) => updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_KEY] });
    },
  });
};

export const useUpdateDepartmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) => updateDepartmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_KEY] });
    },
  });
};
