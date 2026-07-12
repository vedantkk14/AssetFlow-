import { Role } from '@/types/role.types';

export type AllocationStatus = 'ACTIVE' | 'RETURN_REQUESTED' | 'RETURNED' | 'OVERDUE' | 'TRANSFER_PENDING' | 'TRANSFERRED';
export type TransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface EnrichedUser {
  id: string;
  name: string;
  email: string;
}

export interface EnrichedAsset {
  id: string;
  name: string;
  assetTag: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  employeeId: string;
  allocatedBy: string;
  allocatedDate: string;
  expectedReturnDate: string | null;
  actualReturnDate: string | null;
  status: AllocationStatus;
  conditionAtIssue: string | null;
  conditionAtReturn: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  employee: EnrichedUser | null;
  allocatedByUser: EnrichedUser | null;
  asset: EnrichedAsset | null;
}

export interface TransferRequest {
  id: string;
  assetId: string;
  requestedBy: string;
  currentHolder: string;
  newHolder: string;
  reason: string | null;
  status: TransferStatus;
  approvedBy: string | null;
  requestedAt: string;
  approvedAt: string | null;
  requestedByUser: EnrichedUser | null;
  currentHolderUser: EnrichedUser | null;
  newHolderUser: EnrichedUser | null;
  approvedByUser: EnrichedUser | null;
  asset: EnrichedAsset | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AllocationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AllocationStatus;
  employeeId?: string;
}

export interface TransferListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TransferStatus;
}

export interface CreateAllocationPayload {
  assetId: string;
  employeeId: string;
  allocatedDate?: string;
  expectedReturnDate?: string;
  conditionAtIssue?: string;
  notes?: string;
}

export interface RequestReturnPayload {
  notes?: string;
}

export interface ApproveReturnPayload {
  conditionAtReturn?: string;
  notes?: string;
}

export interface CreateTransferPayload {
  assetId: string;
  newHolderId: string;
  reason?: string;
}

export interface AllocationHistory {
  asset: EnrichedAsset;
  allocations: Allocation[];
}

// Role is re-exported for convenience within this module's components.
export type { Role };
