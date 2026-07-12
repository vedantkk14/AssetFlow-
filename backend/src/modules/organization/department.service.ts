import { Status } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CreateDepartmentInput, PaginatedResult, PaginationQuery, UpdateDepartmentInput } from './organization.types';

const departmentSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  parentDepartmentId: true,
  parentDepartment: { select: { id: true, name: true, code: true } },
  departmentHeadId: true,
  departmentHead: { select: { id: true, name: true, email: true } },
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { employees: true } },
};

const assertDepartmentHeadIsEligible = async (departmentHeadId: string, currentDepartmentId?: string) => {
  const head = await prisma.user.findUnique({
    where: { id: departmentHeadId },
    include: { headOfDepartment: true },
  });

  if (!head) {
    throw ApiError.badRequest('Department Head must be an existing employee');
  }

  if (head.status !== 'ACTIVE') {
    throw ApiError.badRequest('Department Head must be an active employee');
  }

  if (head.headOfDepartment && head.headOfDepartment.id !== currentDepartmentId) {
    throw ApiError.conflict(`${head.name} is already the head of another department`);
  }
};

export const listDepartments = async (query: PaginationQuery): Promise<PaginatedResult<unknown>> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const search = query.search;

  const where = search
    ? {
        OR: [{ name: { contains: search } }, { code: { contains: search } }],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.department.findMany({
      where,
      select: departmentSelect,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.department.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
};

export const getDepartmentById = async (id: string) => {
  const department = await prisma.department.findUnique({ where: { id }, select: departmentSelect });

  if (!department) {
    throw ApiError.notFound('Department not found');
  }

  return department;
};

export const createDepartment = async (input: CreateDepartmentInput) => {
  const [duplicateName, duplicateCode] = await Promise.all([
    prisma.department.findUnique({ where: { name: input.name } }),
    prisma.department.findUnique({ where: { code: input.code } }),
  ]);

  if (duplicateName) {
    throw ApiError.conflict('A department with this name already exists');
  }

  if (duplicateCode) {
    throw ApiError.conflict('A department with this code already exists');
  }

  if (input.parentDepartmentId) {
    const parent = await prisma.department.findUnique({ where: { id: input.parentDepartmentId } });
    if (!parent) {
      throw ApiError.badRequest('Parent department does not exist');
    }
  }

  if (input.departmentHeadId) {
    await assertDepartmentHeadIsEligible(input.departmentHeadId);
  }

  return prisma.department.create({
    data: {
      name: input.name,
      code: input.code,
      description: input.description,
      parentDepartmentId: input.parentDepartmentId ?? null,
      departmentHeadId: input.departmentHeadId ?? null,
    },
    select: departmentSelect,
  });
};

export const updateDepartment = async (id: string, input: UpdateDepartmentInput) => {
  const existing = await prisma.department.findUnique({ where: { id } });

  if (!existing) {
    throw ApiError.notFound('Department not found');
  }

  if (input.name && input.name !== existing.name) {
    const duplicateName = await prisma.department.findUnique({ where: { name: input.name } });
    if (duplicateName) {
      throw ApiError.conflict('A department with this name already exists');
    }
  }

  if (input.code && input.code !== existing.code) {
    const duplicateCode = await prisma.department.findUnique({ where: { code: input.code } });
    if (duplicateCode) {
      throw ApiError.conflict('A department with this code already exists');
    }
  }

  if (input.parentDepartmentId) {
    if (input.parentDepartmentId === id) {
      throw ApiError.badRequest('A department cannot be its own parent');
    }

    const parent = await prisma.department.findUnique({ where: { id: input.parentDepartmentId } });
    if (!parent) {
      throw ApiError.badRequest('Parent department does not exist');
    }
  }

  if (input.departmentHeadId) {
    await assertDepartmentHeadIsEligible(input.departmentHeadId, id);
  }

  return prisma.department.update({
    where: { id },
    data: {
      name: input.name,
      code: input.code,
      description: input.description,
      parentDepartmentId: input.parentDepartmentId === undefined ? undefined : input.parentDepartmentId,
      departmentHeadId: input.departmentHeadId === undefined ? undefined : input.departmentHeadId,
    },
    select: departmentSelect,
  });
};

export const updateDepartmentStatus = async (id: string, status: Status) => {
  const existing = await prisma.department.findUnique({ where: { id } });

  if (!existing) {
    throw ApiError.notFound('Department not found');
  }

  return prisma.department.update({ where: { id }, data: { status }, select: departmentSelect });
};

export const softDeleteDepartment = async (id: string) => {
  return updateDepartmentStatus(id, 'INACTIVE');
};
