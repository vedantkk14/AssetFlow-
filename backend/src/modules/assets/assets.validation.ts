import { z } from 'zod';
import { AssetStatus, AssetCondition } from '@prisma/client';

export const createAssetSchema = z.object({
  name: z.string({ required_error: 'Asset Name is required' }).min(1, 'Asset Name cannot be empty'),
  description: z.string().optional().nullable(),
  serialNumber: z.string({ required_error: 'Serial Number is required' }).min(1, 'Serial Number cannot be empty'),
  categoryId: z.string({ required_error: 'Category is required' }).min(1, 'Category must exist'),
  departmentId: z.string({ required_error: 'Department is required' }).min(1, 'Department must exist'),
  location: z.string({ required_error: 'Location is required' }).min(1, 'Location cannot be empty'),
  purchaseDate: z.preprocess(
    (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
    z.date({ required_error: 'Purchase Date is required' })
  ),
  purchaseCost: z.preprocess(
    (arg) => (typeof arg === 'string' ? parseFloat(arg) : arg),
    z.number({ required_error: 'Purchase Cost is required' }).nonnegative('Purchase Cost must be positive')
  ),
  condition: z.nativeEnum(AssetCondition).default(AssetCondition.NEW),
  status: z.nativeEnum(AssetStatus).default(AssetStatus.AVAILABLE),
  manufacturer: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  warrantyStart: z.preprocess(
    (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
    z.date().optional()
  ).optional().nullable(),
  warrantyEnd: z.preprocess(
    (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
    z.date().optional()
  ).optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')).nullable(),
  isBookable: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
}).refine(
  (data) => {
    if (data.warrantyStart && data.warrantyEnd) {
      return data.warrantyEnd >= data.warrantyStart;
    }
    return true;
  },
  {
    message: 'Warranty end date must be after warranty start date',
    path: ['warrantyEnd'],
  }
).refine(
  (data) => {
    if (data.warrantyStart) {
      return data.warrantyStart >= data.purchaseDate;
    }
    return true;
  },
  {
    message: 'Warranty start date must be after or equal to purchase date',
    path: ['warrantyStart'],
  }
);

export const updateAssetSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  serialNumber: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  departmentId: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  purchaseDate: z.preprocess(
    (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
    z.date().optional()
  ).optional(),
  purchaseCost: z.preprocess(
    (arg) => (typeof arg === 'string' ? parseFloat(arg) : arg),
    z.number().nonnegative().optional()
  ).optional(),
  condition: z.nativeEnum(AssetCondition).optional(),
  status: z.nativeEnum(AssetStatus).optional(),
  manufacturer: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  warrantyStart: z.preprocess(
    (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
    z.date().optional()
  ).optional().nullable(),
  warrantyEnd: z.preprocess(
    (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
    z.date().optional()
  ).optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')).nullable(),
  isBookable: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().optional()
  ).optional(),
}).refine(
  (data) => {
    if (data.warrantyStart && data.warrantyEnd) {
      return data.warrantyEnd >= data.warrantyStart;
    }
    return true;
  },
  {
    message: 'Warranty end date must be after warranty start date',
    path: ['warrantyEnd'],
  }
);

export const patchAssetStatusSchema = z.object({
  status: z.nativeEnum(AssetStatus, {
    errorMap: () => ({ message: 'Invalid asset status' }),
  }),
});
