import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { AssetsService } from './assets.service';
import { createAssetSchema, updateAssetSchema, patchAssetStatusSchema } from './assets.validation';
import { ApiError } from '../../utils/apiError';

export const createAsset = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  
  // Validate request body
  const validationResult = createAssetSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw ApiError.badRequest('Validation failed', validationResult.error.format());
  }

  const asset = await AssetsService.createAsset(userId, validationResult.data);
  return sendSuccess(res, 201, 'Asset created successfully', asset);
});

export const updateAsset = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const validationResult = updateAssetSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw ApiError.badRequest('Validation failed', validationResult.error.format());
  }

  const asset = await AssetsService.updateAsset(id, validationResult.data);
  return sendSuccess(res, 200, 'Asset updated successfully', asset);
});

export const updateAssetStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const validationResult = patchAssetStatusSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw ApiError.badRequest('Validation failed', validationResult.error.format());
  }

  const asset = await AssetsService.updateAssetStatus(id, validationResult.data.status);
  return sendSuccess(res, 200, 'Asset status updated successfully', asset);
});

export const deleteAsset = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const asset = await AssetsService.deleteAsset(id);
  return sendSuccess(res, 200, 'Asset archived successfully', asset);
});

export const getAssetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const asset = await AssetsService.getAssetById(id);
  return sendSuccess(res, 200, 'Asset details retrieved successfully', asset);
});

export const getAllAssets = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    search: req.query.search as string,
    status: req.query.status as string,
    condition: req.query.condition as string,
    departmentId: req.query.departmentId as string,
    categoryId: req.query.categoryId as string,
    isBookable: req.query.isBookable !== undefined ? req.query.isBookable === 'true' : undefined,
    purchaseDateStart: req.query.purchaseDateStart as string,
    purchaseDateEnd: req.query.purchaseDateEnd as string,
  };

  const pagination = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await AssetsService.getAllAssets(filters, pagination);
  return sendSuccess(res, 200, 'Assets retrieved successfully', result);
});

export const getAssetsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const assets = await AssetsService.getAssetsByCategory(categoryId);
  return sendSuccess(res, 200, 'Assets retrieved successfully by category', assets);
});

export const getAssetsByDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { departmentId } = req.params;
  const assets = await AssetsService.getAssetsByDepartment(departmentId);
  return sendSuccess(res, 200, 'Assets retrieved successfully by department', assets);
});
