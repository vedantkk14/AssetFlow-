import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiSuccessResponse } from '@/types/api.types';
import {
  Allocation,
  AllocationHistory,
  AllocationListParams,
  ApproveReturnPayload,
  CreateAllocationPayload,
  PaginatedResult,
  RequestReturnPayload,
} from '../types/allocation.types';

export const fetchAllocations = async (params: AllocationListParams) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<PaginatedResult<Allocation>>>(
    API_ENDPOINTS.ALLOCATIONS,
    { params }
  );
  return data.data;
};

export const fetchAllocation = async (id: string) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<{ allocation: Allocation }>>(
    `${API_ENDPOINTS.ALLOCATIONS}/${id}`
  );
  return data.data.allocation;
};

export const createAllocation = async (payload: CreateAllocationPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse<{ allocation: Allocation }>>(
    API_ENDPOINTS.ALLOCATIONS,
    payload
  );
  return data.data.allocation;
};

export const requestReturn = async (id: string, payload: RequestReturnPayload) => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ allocation: Allocation }>>(
    `${API_ENDPOINTS.ALLOCATIONS}/${id}/return`,
    payload
  );
  return data.data.allocation;
};

export const approveReturn = async (id: string, payload: ApproveReturnPayload) => {
  const { data } = await axiosInstance.patch<ApiSuccessResponse<{ allocation: Allocation }>>(
    `${API_ENDPOINTS.ALLOCATIONS}/${id}/approve-return`,
    payload
  );
  return data.data.allocation;
};

export const fetchAllocationHistory = async (assetId: string) => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<AllocationHistory>>(
    `${API_ENDPOINTS.ALLOCATIONS}/history/${assetId}`
  );
  return data.data;
};
