import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { employeeListQuerySchema } from './employee.validation';
import * as employeeService from './employee.service';

export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const query = employeeListQuerySchema.parse(req.query);
  const result = await employeeService.listEmployees(query);
  return sendSuccess(res, 200, 'Employees fetched successfully', result);
});

export const getEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  return sendSuccess(res, 200, 'Employee fetched successfully', { employee });
});

export const promoteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.promoteEmployee(req.params.id, req.body.role);
  return sendSuccess(res, 200, 'Employee role updated successfully', { employee });
});

export const updateEmployeeStatus = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.updateEmployeeStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Employee status updated successfully', { employee });
});
