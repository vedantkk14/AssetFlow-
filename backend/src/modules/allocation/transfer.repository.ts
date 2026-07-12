import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';

export const findPendingTransferByAsset = (assetId: string) =>
  prisma.transferRequest.findFirst({ where: { assetId, status: 'PENDING' } });

export const findTransferById = (id: string) => prisma.transferRequest.findUnique({ where: { id } });

export const createTransfer = (data: Prisma.TransferRequestUncheckedCreateInput) =>
  prisma.transferRequest.create({ data });

export const updateTransfer = (id: string, data: Prisma.TransferRequestUncheckedUpdateInput) =>
  prisma.transferRequest.update({ where: { id }, data });

export const listTransfers = (where: Prisma.TransferRequestWhereInput, skip: number, take: number) =>
  Promise.all([
    prisma.transferRequest.findMany({
      where,
      orderBy: { requestedAt: 'desc' },
      skip,
      take,
    }),
    prisma.transferRequest.count({ where }),
  ]);

export const listTransfersByAsset = (assetId: string) =>
  prisma.transferRequest.findMany({ where: { assetId }, orderBy: { requestedAt: 'asc' } });
