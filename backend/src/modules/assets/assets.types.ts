import { AssetStatus, AssetCondition } from '@prisma/client';

export interface CreateAssetInput {
  name: string;
  description?: string;
  serialNumber: string;
  categoryId: string;
  departmentId: string;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
  condition?: AssetCondition;
  status?: AssetStatus;
  manufacturer?: string;
  model?: string;
  vendor?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  imageUrl?: string;
  isBookable?: boolean;
}

export interface UpdateAssetInput {
  name?: string;
  description?: string;
  serialNumber?: string;
  categoryId?: string;
  departmentId?: string;
  location?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  condition?: AssetCondition;
  status?: AssetStatus;
  manufacturer?: string;
  model?: string;
  vendor?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  imageUrl?: string;
  isBookable?: boolean;
}

export interface AssetFilters {
  search?: string;
  status?: string; // comma-separated
  condition?: string; // comma-separated
  departmentId?: string;
  categoryId?: string;
  isBookable?: boolean;
  purchaseDateStart?: string;
  purchaseDateEnd?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
