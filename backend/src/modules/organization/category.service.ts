import { Status } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CreateCategoryInput, PaginatedResult, PaginationQuery, UpdateCategoryInput } from './organization.types';

export const listCategories = async (query: PaginationQuery): Promise<PaginatedResult<unknown>> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const search = query.search;

  const where = search ? { name: { contains: search } } : {};

  const [items, total] = await Promise.all([
    prisma.assetCategory.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.assetCategory.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.assetCategory.findUnique({ where: { id } });

  if (!category) {
    throw ApiError.notFound('Asset category not found');
  }

  return category;
};

export const createCategory = async (input: CreateCategoryInput) => {
  const duplicate = await prisma.assetCategory.findUnique({ where: { name: input.name } });

  if (duplicate) {
    throw ApiError.conflict('An asset category with this name already exists');
  }

  return prisma.assetCategory.create({
    data: {
      name: input.name,
      description: input.description,
      defaultWarrantyMonths: input.defaultWarrantyMonths,
    },
  });
};

export const updateCategory = async (id: string, input: UpdateCategoryInput) => {
  const existing = await prisma.assetCategory.findUnique({ where: { id } });

  if (!existing) {
    throw ApiError.notFound('Asset category not found');
  }

  if (input.name && input.name !== existing.name) {
    const duplicate = await prisma.assetCategory.findUnique({ where: { name: input.name } });
    if (duplicate) {
      throw ApiError.conflict('An asset category with this name already exists');
    }
  }

  return prisma.assetCategory.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      defaultWarrantyMonths: input.defaultWarrantyMonths,
    },
  });
};

export const updateCategoryStatus = async (id: string, status: Status) => {
  const existing = await prisma.assetCategory.findUnique({ where: { id } });

  if (!existing) {
    throw ApiError.notFound('Asset category not found');
  }

  return prisma.assetCategory.update({ where: { id }, data: { status } });
};

export const softDeleteCategory = async (id: string) => {
  return updateCategoryStatus(id, 'INACTIVE');
};
