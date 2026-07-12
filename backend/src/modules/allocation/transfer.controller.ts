import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/apiError';
import { sendSuccess } from '../../utils/apiResponse';
import { transferListQuerySchema } from './transfer.validation';
import * as transferService from './transfer.service';

export const createTransfer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const transfer = await transferService.createTransfer(req.body, req.user.id);
  return sendSuccess(res, 201, 'Transfer request created successfully', { transfer });
});

export const listTransfers = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const query = transferListQuerySchema.parse(req.query);
  const result = await transferService.listTransfers(query, req.user.id, req.user.role);
  return sendSuccess(res, 200, 'Transfer requests fetched successfully', result);
});

export const approveTransfer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const result = await transferService.approveTransfer(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Transfer approved successfully', result);
});

export const rejectTransfer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const transfer = await transferService.rejectTransfer(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Transfer rejected successfully', { transfer });
});
