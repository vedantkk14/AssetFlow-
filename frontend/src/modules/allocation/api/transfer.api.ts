import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiSuccessResponse } from '@/types/api.types';
import {
  Allocation,
  CreateTransferPayload,
  PaginatedResult,
  TransferListParams,
  TransferRequest,
} from '../types/allocation.types';

export const fetchTransfers = async (params: TransferListParams) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<PaginatedResult<TransferRequest>>>(
    API_ENDPOINTS.TRANSFERS,
    { params }
  );
  return data.data;
};

export const createTransfer = async (payload: CreateTransferPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse<{ transfer: TransferRequest }>>(
    API_ENDPOINTS.TRANSFERS,
    payload
  );
  return data.data.transfer;
};

export const approveTransfer = async (id: string) => {
  const { data } = await axiosInstance.patch<
    ApiSuccessResponse<{ transfer: TransferRequest; allocation: Allocation }>
  >(`${API_ENDPOINTS.TRANSFERS}/${id}/approve`);
  return data.data;
};

export const rejectTransfer = async (id: string) => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ transfer: TransferRequest }>>(
    `${API_ENDPOINTS.TRANSFERS}/${id}/reject`
  );
  return data.data.transfer;
};
