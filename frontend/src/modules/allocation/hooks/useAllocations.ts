import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveReturn,
  createAllocation,
  fetchAllocation,
  fetchAllocationHistory,
  fetchAllocations,
  requestReturn,
} from '../api/allocation.api';
import { AllocationListParams, ApproveReturnPayload, CreateAllocationPayload, RequestReturnPayload } from '../types/allocation.types';

const ALLOCATIONS_KEY = 'allocations';

export const useAllocations = (params: AllocationListParams) => {
  return useQuery({
    queryKey: [ALLOCATIONS_KEY, params],
    queryFn: () => fetchAllocations(params),
  });
};

export const useAllocation = (id: string | undefined) => {
  return useQuery({
    queryKey: [ALLOCATIONS_KEY, id],
    queryFn: () => fetchAllocation(id as string),
    enabled: Boolean(id),
  });
};

export const useAllocationHistory = (assetId: string | undefined) => {
  return useQuery({
    queryKey: [ALLOCATIONS_KEY, 'history', assetId],
    queryFn: () => fetchAllocationHistory(assetId as string),
    enabled: Boolean(assetId),
  });
};

export const useCreateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAllocationPayload) => createAllocation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALLOCATIONS_KEY] });
    },
  });
};

export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RequestReturnPayload }) => requestReturn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALLOCATIONS_KEY] });
    },
  });
};

export const useApproveReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveReturnPayload }) => approveReturn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALLOCATIONS_KEY] });
    },
  });
};
