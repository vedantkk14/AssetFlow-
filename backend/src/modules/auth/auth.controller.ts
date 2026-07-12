import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/apiError';
import { sendSuccess } from '../../utils/apiResponse';
import * as authService from './auth.service';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.signup(req.body);
  return sendSuccess(res, 201, 'Account created successfully', { user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, 200, 'Login successful', result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const user = await authService.getCurrentUser(req.user.id);
  return sendSuccess(res, 200, 'Current user fetched successfully', { user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, 200, 'Logged out successfully');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body);
  return sendSuccess(res, 200, 'If that email is registered, a reset link has been sent');
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);
  return sendSuccess(res, 200, 'Password has been reset successfully');
});
