import { AssetStatus, AssetCondition } from '@prisma/client';

export interface CreateAssetInput {
  name: string;
  description?: string | null;
  serialNumber: string;
  categoryId: string;
  departmentId: string;
  location: string;
  purchaseDate: Date;
  purchaseCost: number;
  condition?: AssetCondition;
  status?: AssetStatus;
  manufacturer?: string | null;
  model?: string | null;
  vendor?: string | null;
  warrantyStart?: Date | null;
  warrantyEnd?: Date | null;
  imageUrl?: string | null;
  isBookable?: boolean;
}

export interface UpdateAssetInput {
  name?: string;
  description?: string | null;
  serialNumber?: string;
  categoryId?: string;
  departmentId?: string;
  location?: string;
  purchaseDate?: Date;
  purchaseCost?: number;
  condition?: AssetCondition;
  status?: AssetStatus;
  manufacturer?: string | null;
  model?: string | null;
  vendor?: string | null;
  warrantyStart?: Date | null;
  warrantyEnd?: Date | null;
  imageUrl?: string | null;
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
