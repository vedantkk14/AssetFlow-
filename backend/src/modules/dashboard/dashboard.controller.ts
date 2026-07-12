import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { DashboardService } from './dashboard.service';

export const getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = DashboardService.getAdminDashboard();
  return sendSuccess(res, 200, 'Admin dashboard data retrieved successfully', data);
});

export const getAssetManagerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = DashboardService.getAssetManagerDashboard();
  return sendSuccess(res, 200, 'Asset manager dashboard data retrieved successfully', data);
});

export const getDepartmentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = DashboardService.getDepartmentHeadDashboard();
  return sendSuccess(res, 200, 'Department head dashboard data retrieved successfully', data);
});

export const getEmployeeDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = DashboardService.getEmployeeDashboard();
  return sendSuccess(res, 200, 'Employee dashboard data retrieved successfully', data);
});

