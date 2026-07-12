import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { approveTransfer, createTransfer, fetchTransfers, rejectTransfer } from '../api/transfer.api';
import { CreateTransferPayload, TransferListParams } from '../types/allocation.types';

const TRANSFERS_KEY = 'transfers';
const ALLOCATIONS_KEY = 'allocations';

export const useTransfers = (params: TransferListParams) => {
  return useQuery({
    queryKey: [TRANSFERS_KEY, params],
    queryFn: () => fetchTransfers(params),
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransferPayload) => createTransfer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSFERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ALLOCATIONS_KEY] });
    },
  });
};

export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSFERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ALLOCATIONS_KEY] });
    },
  });
};

export const useRejectTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSFERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ALLOCATIONS_KEY] });
    },
  });
};
