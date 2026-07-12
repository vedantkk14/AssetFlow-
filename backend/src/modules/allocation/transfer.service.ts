import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import * as allocationRepository from './allocation.repository';
import * as transferRepository from './transfer.repository';
import { findTempAssetById } from './temp-asset.mock';
import { getAssetsByIds, getDepartmentEmployeeIds, getEmployeesByIds } from './allocation.service';
import { CreateTransferInput, TransferListQuery } from './allocation.types';

const enrichTransfer = async <
  T extends { requestedBy: string; currentHolder: string; newHolder: string; approvedBy: string | null; assetId: string }
>(
  transfer: T
) => {
  const userIds = [transfer.requestedBy, transfer.currentHolder, transfer.newHolder];
  if (transfer.approvedBy) userIds.push(transfer.approvedBy);

  const employees = await getEmployeesByIds(userIds);
  const assets = getAssetsByIds([transfer.assetId]);

  return {
    ...transfer,
    requestedByUser: employees.get(transfer.requestedBy) ?? null,
    currentHolderUser: employees.get(transfer.currentHolder) ?? null,
    newHolderUser: employees.get(transfer.newHolder) ?? null,
    approvedByUser: transfer.approvedBy ? employees.get(transfer.approvedBy) ?? null : null,
    asset: assets.get(transfer.assetId) ?? null,
  };
};

const enrichTransferList = async <
  T extends { requestedBy: string; currentHolder: string; newHolder: string; approvedBy: string | null; assetId: string }
>(
  transfers: T[]
) => Promise.all(transfers.map(enrichTransfer));

export const createTransfer = async (input: CreateTransferInput, requestedBy: string) => {
  const asset = findTempAssetById(input.assetId);
  if (!asset) {
    throw ApiError.badRequest('Asset not found');
  }

  const newHolder = await prisma.user.findUnique({ where: { id: input.newHolderId } });
  if (!newHolder) {
    throw ApiError.badRequest('New holder not found');
  }
  if (newHolder.status !== 'ACTIVE') {
    throw ApiError.badRequest('Cannot transfer an asset to an inactive employee');
  }

  const existingPending = await transferRepository.findPendingTransferByAsset(input.assetId);
  if (existingPending) {
    throw ApiError.conflict('A transfer request for this asset is already pending');
  }

  const activeAllocation = await allocationRepository.findOpenAllocationByAsset(input.assetId);
  if (!activeAllocation || activeAllocation.status === 'TRANSFER_PENDING') {
    throw ApiError.badRequest('Asset must be currently allocated to request a transfer');
  }

  if (activeAllocation.employeeId === input.newHolderId) {
    throw ApiError.badRequest('Asset is already allocated to this employee');
  }

  const [transfer] = await prisma.$transaction([
    prisma.transferRequest.create({
      data: {
        assetId: input.assetId,
        requestedBy,
        currentHolder: activeAllocation.employeeId,
        newHolder: input.newHolderId,
        reason: input.reason,
        status: 'PENDING',
      },
    }),
    prisma.assetAllocation.update({
      where: { id: activeAllocation.id },
      data: { status: 'TRANSFER_PENDING' },
    }),
  ]);

  return enrichTransfer(transfer);
};

export const listTransfers = async (query: TransferListQuery, requesterId: string, requesterRole: Role) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const where: Record<string, unknown> = {};

  if (query.status) where.status = query.status;

  if (requesterRole === 'EMPLOYEE') {
    where.OR = [{ requestedBy: requesterId }, { currentHolder: requesterId }, { newHolder: requesterId }];
  } else if (requesterRole === 'DEPARTMENT_HEAD') {
    const employeeIds = await getDepartmentEmployeeIds(requesterId);
    where.OR = [{ currentHolder: { in: employeeIds } }, { newHolder: { in: employeeIds } }];
  }

  if (query.search) {
    const matchingEmployees = await prisma.user.findMany({
      where: { OR: [{ name: { contains: query.search } }, { email: { contains: query.search } }] },
      select: { id: true },
    });
    const employeeIds = matchingEmployees.map((user) => user.id);
    const searchOr = [{ currentHolder: { in: employeeIds } }, { newHolder: { in: employeeIds } }];

    where.AND = where.OR ? [{ OR: where.OR }, { OR: searchOr }] : undefined;
    if (!where.AND) where.OR = searchOr;
  }

  const [items, total] = await transferRepository.listTransfers(where, (page - 1) * limit, limit);
  const enrichedItems = await enrichTransferList(items);

  return { items: enrichedItems, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
};

export const approveTransfer = async (id: string, approvedBy: string) => {
  const transfer = await transferRepository.findTransferById(id);

  if (!transfer) {
    throw ApiError.notFound('Transfer request not found');
  }

  if (transfer.status !== 'PENDING') {
    throw ApiError.badRequest('This transfer request has already been resolved');
  }

  const currentAllocation = await allocationRepository.findOpenAllocationByAsset(transfer.assetId);
  if (!currentAllocation) {
    throw ApiError.badRequest('No open allocation found for this asset');
  }

  const [, , newAllocation] = await prisma.$transaction([
    prisma.transferRequest.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy, approvedAt: new Date() },
    }),
    prisma.assetAllocation.update({
      where: { id: currentAllocation.id },
      data: { status: 'TRANSFERRED', actualReturnDate: new Date() },
    }),
    prisma.assetAllocation.create({
      data: {
        assetId: transfer.assetId,
        employeeId: transfer.newHolder,
        allocatedBy: approvedBy,
        allocatedDate: new Date(),
        conditionAtIssue: currentAllocation.conditionAtReturn ?? currentAllocation.conditionAtIssue,
        status: 'ACTIVE',
      },
    }),
  ]);

  const updatedTransfer = await transferRepository.findTransferById(id);
  return { transfer: await enrichTransfer(updatedTransfer!), allocation: newAllocation };
};

export const rejectTransfer = async (id: string, approvedBy: string) => {
  const transfer = await transferRepository.findTransferById(id);

  if (!transfer) {
    throw ApiError.notFound('Transfer request not found');
  }

  if (transfer.status !== 'PENDING') {
    throw ApiError.badRequest('This transfer request has already been resolved');
  }

  const currentAllocation = await allocationRepository.findOpenAllocationByAsset(transfer.assetId);

  const updates: Prisma.PrismaPromise<unknown>[] = [
    prisma.transferRequest.update({
      where: { id },
      data: { status: 'REJECTED', approvedBy, approvedAt: new Date() },
    }),
  ];

  if (currentAllocation && currentAllocation.status === 'TRANSFER_PENDING') {
    updates.push(
      prisma.assetAllocation.update({
        where: { id: currentAllocation.id },
        data: { status: 'ACTIVE' },
      })
    );
  }

  await prisma.$transaction(updates);

  const updatedTransfer = await transferRepository.findTransferById(id);
  return enrichTransfer(updatedTransfer!);
};
