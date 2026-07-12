import { z } from 'zod';

export const createTransferSchema = z.object({
  assetId: z.string().trim().min(1, 'Asset is required'),
  newHolderId: z.string().trim().min(1, 'New holder is required'),
  reason: z.string().trim().max(500).optional(),
});

export const transferListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});
