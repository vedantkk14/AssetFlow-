import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).optional(),
  defaultWarrantyMonths: z.coerce.number().int().min(0).max(120).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
