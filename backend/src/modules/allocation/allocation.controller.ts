import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/apiError';
import { sendSuccess } from '../../utils/apiResponse';
import { allocationListQuerySchema } from './allocation.validation';
import * as allocationService from './allocation.service';

export const createAllocation = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const allocation = await allocationService.createAllocation(req.body, req.user.id);
  return sendSuccess(res, 201, 'Asset allocated successfully', { allocation });
});

export const listAllocations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const query = allocationListQuerySchema.parse(req.query);
  const result = await allocationService.listAllocations(query, req.user.id, req.user.role);
  return sendSuccess(res, 200, 'Allocations fetched successfully', result);
});

export const getAllocation = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const allocation = await allocationService.getAllocationById(req.params.id, req.user.id, req.user.role);
  return sendSuccess(res, 200, 'Allocation fetched successfully', { allocation });
});

export const requestReturn = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const allocation = await allocationService.requestReturn(req.params.id, req.body, req.user.id, req.user.role);
  return sendSuccess(res, 200, 'Return requested successfully', { allocation });
});

export const approveReturn = asyncHandler(async (req: Request, res: Response) => {
  const allocation = await allocationService.approveReturn(req.params.id, req.body);
  return sendSuccess(res, 200, 'Return approved successfully', { allocation });
});

export const getAllocationHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await allocationService.getAllocationHistory(req.params.assetId);
  return sendSuccess(res, 200, 'Allocation history fetched successfully', history);
});
