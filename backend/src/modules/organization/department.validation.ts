import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  code: z
    .string()
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(20)
    .regex(/^[A-Za-z0-9_-]+$/, 'Code may only contain letters, numbers, hyphens and underscores'),
  description: z.string().trim().max(500).optional(),
  parentDepartmentId: z.string().trim().min(1).optional().nullable(),
  departmentHeadId: z.string().trim().min(1).optional().nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();
