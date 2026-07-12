import { z } from 'zod';

export const allocateAssetSchema = z.object({
  assetId: z.string().trim().min(1, 'Select an asset'),
  employeeId: z.string().trim().min(1, 'Select an employee'),
  allocatedDate: z.string().trim().optional(),
  expectedReturnDate: z.string().trim().optional(),
  conditionAtIssue: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
});
export type AllocateAssetFormValues = z.infer<typeof allocateAssetSchema>;

export const transferRequestSchema = z.object({
  newHolderId: z.string().trim().min(1, 'Select the new holder'),
  reason: z.string().trim().max(500).optional(),
});
export type TransferRequestFormValues = z.infer<typeof transferRequestSchema>;

export const returnRequestSchema = z.object({
  notes: z.string().trim().max(1000).optional(),
});
export type ReturnRequestFormValues = z.infer<typeof returnRequestSchema>;

export const approveReturnSchema = z.object({
  conditionAtReturn: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
});
export type ApproveReturnFormValues = z.infer<typeof approveReturnSchema>;
