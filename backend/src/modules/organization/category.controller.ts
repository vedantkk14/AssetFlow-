import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { paginationQuerySchema } from './organization.validation';
import * as categoryService from './category.service';

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const query = paginationQuerySchema.parse(req.query);
  const result = await categoryService.listCategories(query);
  return sendSuccess(res, 200, 'Asset categories fetched successfully', result);
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return sendSuccess(res, 200, 'Asset category fetched successfully', { category });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  return sendSuccess(res, 201, 'Asset category created successfully', { category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return sendSuccess(res, 200, 'Asset category updated successfully', { category });
});

export const updateCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategoryStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Asset category status updated successfully', { category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.softDeleteCategory(req.params.id);
  return sendSuccess(res, 200, 'Asset category deactivated successfully', { category });
});
