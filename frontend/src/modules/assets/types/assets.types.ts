export type AssetStatus = 'AVAILABLE' | 'ALLOCATED' | 'RESERVED' | 'UNDER_MAINTENANCE' | 'LOST' | 'RETIRED' | 'DISPOSED';
export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'DAMAGED';

export interface Category {
  id: string;
  name: string;
  description?: string;
  defaultWarrantyMonths?: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface AssetCreator {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  description?: string;
  serialNumber: string;
  categoryId: string;
  category: Category;
  departmentId: string;
  department: Department;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
  condition: AssetCondition;
  status: AssetStatus;
  manufacturer?: string;
  model?: string;
  vendor?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  imageUrl?: string;
  qrCode?: string;
  isBookable: boolean;
  createdBy: string;
  creator?: AssetCreator;
  createdAt: string;
  updatedAt: string;
}

export interface AssetResponse {
  assets: Asset[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
