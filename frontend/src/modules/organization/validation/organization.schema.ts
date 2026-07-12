import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  code: z
    .string()
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(20)
    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, hyphens and underscores'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  parentDepartmentId: z.string().optional(),
  departmentHeadId: z.string().optional(),
});
export type DepartmentFormValues = z.infer<typeof departmentSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  defaultWarrantyMonths: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().int().min(0).max(120).optional()
  ),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;

export const promotionSchema = z.object({
  role: z.enum(['DEPARTMENT_HEAD', 'ASSET_MANAGER', 'EMPLOYEE']),
});
export type PromotionFormValues = z.infer<typeof promotionSchema>;
