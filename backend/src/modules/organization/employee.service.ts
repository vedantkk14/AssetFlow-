import { Status } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { EmployeeListQuery, PaginatedResult } from './organization.types';

const employeeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  departmentId: true,
  department: { select: { id: true, name: true, code: true } },
  status: true,
  createdAt: true,
  updatedAt: true,
};

export const listEmployees = async (query: EmployeeListQuery): Promise<PaginatedResult<unknown>> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const where = {
    ...(query.search
      ? { OR: [{ name: { contains: query.search } }, { email: { contains: query.search } }] }
      : {}),
    ...(query.department ? { departmentId: query.department } : {}),
    ...(query.role ? { role: query.role } : {}),
    ...(query.status ? { status: query.status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: employeeSelect,
      orderBy: { [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
};

export const getEmployeeById = async (id: string) => {
  const employee = await prisma.user.findUnique({ where: { id }, select: employeeSelect });

  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  return employee;
};

export const promoteEmployee = async (id: string, role: 'DEPARTMENT_HEAD' | 'ASSET_MANAGER' | 'EMPLOYEE') => {
  const employee = await prisma.user.findUnique({ where: { id } });

  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  if (employee.status !== 'ACTIVE') {
    throw ApiError.badRequest('Only active employees can be promoted');
  }

  if (employee.role === 'ADMIN') {
    throw ApiError.badRequest('Admin role cannot be changed');
  }

  return prisma.user.update({ where: { id }, data: { role }, select: employeeSelect });
};

export const updateEmployeeStatus = async (id: string, status: Status) => {
  const employee = await prisma.user.findUnique({ where: { id } });

  if (!employee) {
    throw ApiError.notFound('Employee not found');
  }

  if (employee.role === 'ADMIN') {
    throw ApiError.badRequest('Admin accounts cannot be deactivated');
  }

  return prisma.user.update({ where: { id }, data: { status }, select: employeeSelect });
};
