import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Asset, AssetResponse, Category, Department, AssetStatus } from '../types/assets.types';

// Fetch assets list with filters and pagination
export const getAssets = async (params?: Record<string, any>): Promise<AssetResponse> => {
  const response = await axiosInstance.get<{ data: AssetResponse }>(API_ENDPOINTS.ASSETS.BASE, { params });
  return response.data.data;
};

export const useAssets = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: () => getAssets(params),
  });
};

// Fetch single asset details
export const getAssetById = async (id: string): Promise<Asset> => {
  const response = await axiosInstance.get<{ data: Asset }>(API_ENDPOINTS.ASSETS.DETAILS(id));
  return response.data.data;
};

export const useAssetDetails = (id: string) => {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });
};

// Create new asset (FormData for image upload support)
export const createAsset = async (formData: FormData): Promise<Asset> => {
  const response = await axiosInstance.post<{ data: Asset }>(API_ENDPOINTS.ASSETS.BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

// Update asset
export const updateAsset = async ({ id, formData }: { id: string; formData: FormData }): Promise<Asset> => {
  const response = await axiosInstance.put<{ data: Asset }>(API_ENDPOINTS.ASSETS.DETAILS(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAsset,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', data.id] });
    },
  });
};

// Delete/Archive asset
export const deleteAsset = async (id: string): Promise<Asset> => {
  const response = await axiosInstance.delete<{ data: Asset }>(API_ENDPOINTS.ASSETS.DETAILS(id));
  return response.data.data;
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

// Patch asset status
export const patchAssetStatus = async ({ id, status }: { id: string; status: AssetStatus }): Promise<Asset> => {
  const response = await axiosInstance.patch<{ data: Asset }>(API_ENDPOINTS.ASSETS.STATUS(id), { status });
  return response.data.data;
};

export const usePatchAssetStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchAssetStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', data.id] });
    },
  });
};

// Fetch Categories & Departments (helper hooks for lists)
// Both endpoints are paginated ({ items, total, page, limit, totalPages }),
// not plain arrays - request a high limit so every active option shows up
// in the Register/Edit Asset form's dropdowns.
export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<{ data: { items: Category[] } }>(API_ENDPOINTS.CATEGORIES, {
    params: { limit: 100, status: 'ACTIVE' },
  });
  return response.data.data.items;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await axiosInstance.get<{ data: { items: Department[] } }>(API_ENDPOINTS.DEPARTMENTS, {
    params: { limit: 100, status: 'ACTIVE' },
  });
  return response.data.data.items;
};

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};
