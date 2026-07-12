import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { paginationQuerySchema } from './organization.validation';
import * as departmentService from './department.service';

export const listDepartments = asyncHandler(async (req: Request, res: Response) => {
  const query = paginationQuerySchema.parse(req.query);
  const result = await departmentService.listDepartments(query);
  return sendSuccess(res, 200, 'Departments fetched successfully', result);
});

export const getDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.getDepartmentById(req.params.id);
  return sendSuccess(res, 200, 'Department fetched successfully', { department });
});

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.createDepartment(req.body);
  return sendSuccess(res, 201, 'Department created successfully', { department });
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body);
  return sendSuccess(res, 200, 'Department updated successfully', { department });
});

export const updateDepartmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.updateDepartmentStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Department status updated successfully', { department });
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.softDeleteDepartment(req.params.id);
  return sendSuccess(res, 200, 'Department deactivated successfully', { department });
});
