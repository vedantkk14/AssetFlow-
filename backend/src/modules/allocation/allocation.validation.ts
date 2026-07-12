import { z } from 'zod';

export const createAllocationSchema = z.object({
  assetId: z.string().trim().min(1, 'Asset is required'),
  employeeId: z.string().trim().min(1, 'Employee is required'),
  allocatedDate: z.coerce.date().optional(),
  expectedReturnDate: z.coerce.date().optional(),
  conditionAtIssue: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const requestReturnSchema = z.object({
  notes: z.string().trim().max(1000).optional(),
});

export const approveReturnSchema = z.object({
  conditionAtReturn: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const allocationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['ACTIVE', 'RETURN_REQUESTED', 'RETURNED', 'OVERDUE', 'TRANSFER_PENDING', 'TRANSFERRED']).optional(),
  employeeId: z.string().trim().optional(),
});
