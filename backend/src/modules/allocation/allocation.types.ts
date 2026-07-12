import { AllocationStatus, TransferStatus } from '@prisma/client';

export interface CreateAllocationInput {
  assetId: string;
  employeeId: string;
  allocatedDate?: Date;
  expectedReturnDate?: Date;
  conditionAtIssue?: string;
  notes?: string;
}

export interface RequestReturnInput {
  notes?: string;
}

export interface ApproveReturnInput {
  conditionAtReturn?: string;
  notes?: string;
}

export interface AllocationListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AllocationStatus;
  employeeId?: string;
}

export interface CreateTransferInput {
  assetId: string;
  newHolderId: string;
  reason?: string;
}

export interface TransferListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TransferStatus;
}

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
