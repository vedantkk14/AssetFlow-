import { AllocationStatus, Prisma } from '@prisma/client';
import { prisma } from '../../config/db';

const OPEN_STATUSES: AllocationStatus[] = ['ACTIVE', 'RETURN_REQUESTED', 'OVERDUE', 'TRANSFER_PENDING'];

export const findOpenAllocationByAsset = (assetId: string) =>
  prisma.assetAllocation.findFirst({
    where: { assetId, status: { in: OPEN_STATUSES } },
  });

export const findAllocationById = (id: string) => prisma.assetAllocation.findUnique({ where: { id } });

export const createAllocation = (data: Prisma.AssetAllocationUncheckedCreateInput) =>
  prisma.assetAllocation.create({ data });

export const updateAllocation = (id: string, data: Prisma.AssetAllocationUncheckedUpdateInput) =>
  prisma.assetAllocation.update({ where: { id }, data });

export const listAllocations = (where: Prisma.AssetAllocationWhereInput, skip: number, take: number) =>
  Promise.all([
    prisma.assetAllocation.findMany({
      where,
      orderBy: { allocatedDate: 'desc' },
      skip,
      take,
    }),
    prisma.assetAllocation.count({ where }),
  ]);

export const listAllocationsByAsset = (assetId: string) =>
  prisma.assetAllocation.findMany({ where: { assetId }, orderBy: { allocatedDate: 'asc' } });

export const syncOverdueAllocations = () =>
  prisma.assetAllocation.updateMany({
    where: { status: 'ACTIVE', expectedReturnDate: { lt: new Date() } },
    data: { status: 'OVERDUE' },
  });
