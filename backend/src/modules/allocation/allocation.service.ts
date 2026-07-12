import { AllocationStatus, Role } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import * as allocationRepository from './allocation.repository';
import { findTempAssetById, listTempAssets } from './temp-asset.mock';
import {
  AllocationListQuery,
  ApproveReturnInput,
  CreateAllocationInput,
  EnrichedAsset,
  EnrichedUser,
  RequestReturnInput,
} from './allocation.types';

const OPEN_STATUSES: AllocationStatus[] = ['ACTIVE', 'RETURN_REQUESTED', 'OVERDUE', 'TRANSFER_PENDING'];

export const getEmployeesByIds = async (ids: string[]): Promise<Map<string, EnrichedUser>> => {
  if (ids.length === 0) return new Map();

  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, email: true },
  });

  return new Map(users.map((user) => [user.id, user]));
};

export const getAssetsByIds = (ids: string[]): Map<string, EnrichedAsset> => {
  const map = new Map<string, EnrichedAsset>();

  for (const id of new Set(ids)) {
    const asset = findTempAssetById(id);
    if (asset) map.set(id, asset);
  }

  return map;
};

const findTempAssetIdsMatching = (search: string): string[] => {
  const term = search.toLowerCase();
  return listTempAssets()
    .filter((asset) => asset.name.toLowerCase().includes(term) || asset.assetTag.toLowerCase().includes(term))
    .map((asset) => asset.id);
};

// Resolves the requesting Department Head's own department's employee ids, for
// scoping list/detail queries.
export const getDepartmentEmployeeIds = async (userId: string): Promise<string[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.departmentId) return [];

  const employees = await prisma.user.findMany({
    where: { departmentId: user.departmentId },
    select: { id: true },
  });

  return employees.map((employee) => employee.id);
};

const enrichAllocation = async <T extends { employeeId: string; allocatedBy: string; assetId: string }>(
  allocation: T
) => {
  const employees = await getEmployeesByIds([allocation.employeeId, allocation.allocatedBy]);
  const assets = getAssetsByIds([allocation.assetId]);

  return {
    ...allocation,
    employee: employees.get(allocation.employeeId) ?? null,
    allocatedByUser: employees.get(allocation.allocatedBy) ?? null,
    asset: assets.get(allocation.assetId) ?? null,
  };
};

const enrichAllocationList = async <T extends { employeeId: string; allocatedBy: string; assetId: string }>(
  allocations: T[]
) => {
  const userIds = new Set<string>();
  const assetIds = new Set<string>();

  allocations.forEach((allocation) => {
    userIds.add(allocation.employeeId);
    userIds.add(allocation.allocatedBy);
    assetIds.add(allocation.assetId);
  });

  const employees = await getEmployeesByIds(Array.from(userIds));
  const assets = getAssetsByIds(Array.from(assetIds));

  return allocations.map((allocation) => ({
    ...allocation,
    employee: employees.get(allocation.employeeId) ?? null,
    allocatedByUser: employees.get(allocation.allocatedBy) ?? null,
    asset: assets.get(allocation.assetId) ?? null,
  }));
};

export const createAllocation = async (input: CreateAllocationInput, allocatedBy: string) => {
  const asset = findTempAssetById(input.assetId);
  if (!asset) {
    throw ApiError.badRequest('Asset not found');
  }

  const employee = await prisma.user.findUnique({ where: { id: input.employeeId } });
  if (!employee) {
    throw ApiError.badRequest('Employee not found');
  }
  if (employee.status !== 'ACTIVE') {
    throw ApiError.badRequest('Cannot allocate an asset to an inactive employee');
  }

  const existing = await allocationRepository.findOpenAllocationByAsset(input.assetId);
  if (existing) {
    const holder = await prisma.user.findUnique({ where: { id: existing.employeeId } });
    throw ApiError.conflict(
      `Already allocated to ${holder?.name ?? 'another employee'}. Create a transfer request instead.`
    );
  }

  const allocation = await allocationRepository.createAllocation({
    assetId: input.assetId,
    employeeId: input.employeeId,
    allocatedBy,
    allocatedDate: input.allocatedDate ?? new Date(),
    expectedReturnDate: input.expectedReturnDate,
    conditionAtIssue: input.conditionAtIssue,
    notes: input.notes,
    status: 'ACTIVE',
  });

  return enrichAllocation(allocation);
};

export const listAllocations = async (query: AllocationListQuery, requesterId: string, requesterRole: Role) => {
  await allocationRepository.syncOverdueAllocations();

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const where: Record<string, unknown> = {};

  if (query.status) where.status = query.status;
  if (query.employeeId) where.employeeId = query.employeeId;

  if (requesterRole === 'EMPLOYEE') {
    where.employeeId = requesterId;
  } else if (requesterRole === 'DEPARTMENT_HEAD') {
    const employeeIds = await getDepartmentEmployeeIds(requesterId);
    where.employeeId = { in: employeeIds };
  }

  if (query.search) {
    const [matchingEmployees, matchingAssetIds] = [
      await prisma.user.findMany({
        where: { OR: [{ name: { contains: query.search } }, { email: { contains: query.search } }] },
        select: { id: true },
      }),
      findTempAssetIdsMatching(query.search),
    ];

    const employeeIds = matchingEmployees.map((user) => user.id);
    where.OR = [{ employeeId: { in: employeeIds } }, { assetId: { in: matchingAssetIds } }];
  }

  const [items, total] = await allocationRepository.listAllocations(where, (page - 1) * limit, limit);
  const enrichedItems = await enrichAllocationList(items);

  return { items: enrichedItems, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
};

export const getAllocationById = async (id: string, requesterId: string, requesterRole: Role) => {
  const allocation = await allocationRepository.findAllocationById(id);

  if (!allocation) {
    throw ApiError.notFound('Allocation not found');
  }

  if (requesterRole === 'EMPLOYEE' && allocation.employeeId !== requesterId) {
    throw ApiError.forbidden('You can only view your own allocations');
  }

  if (requesterRole === 'DEPARTMENT_HEAD') {
    const employeeIds = await getDepartmentEmployeeIds(requesterId);
    if (!employeeIds.includes(allocation.employeeId)) {
      throw ApiError.forbidden('This allocation is outside your department');
    }
  }

  return enrichAllocation(allocation);
};

export const requestReturn = async (
  id: string,
  input: RequestReturnInput,
  requesterId: string,
  requesterRole: Role
) => {
  const allocation = await allocationRepository.findAllocationById(id);

  if (!allocation) {
    throw ApiError.notFound('Allocation not found');
  }

  if (requesterRole === 'EMPLOYEE' && allocation.employeeId !== requesterId) {
    throw ApiError.forbidden('You can only request a return for your own allocation');
  }

  if (!['ACTIVE', 'OVERDUE'].includes(allocation.status)) {
    throw ApiError.badRequest('Only an active allocation can have a return requested');
  }

  const updated = await allocationRepository.updateAllocation(id, {
    status: 'RETURN_REQUESTED',
    notes: input.notes ?? allocation.notes,
  });

  return enrichAllocation(updated);
};

// Also serves as "Force Return" for ADMIN/ASSET_MANAGER: callable directly from
// ACTIVE/OVERDUE, not only from RETURN_REQUESTED.
export const approveReturn = async (id: string, input: ApproveReturnInput) => {
  const allocation = await allocationRepository.findAllocationById(id);

  if (!allocation) {
    throw ApiError.notFound('Allocation not found');
  }

  if (!OPEN_STATUSES.includes(allocation.status) || allocation.status === 'TRANSFER_PENDING') {
    throw ApiError.badRequest('This allocation cannot be returned in its current state');
  }

  const updated = await allocationRepository.updateAllocation(id, {
    status: 'RETURNED',
    actualReturnDate: new Date(),
    conditionAtReturn: input.conditionAtReturn ?? allocation.conditionAtReturn,
    notes: input.notes ?? allocation.notes,
  });

  return enrichAllocation(updated);
};

export const getAllocationHistory = async (assetId: string) => {
  const asset = findTempAssetById(assetId);
  if (!asset) {
    throw ApiError.badRequest('Asset not found');
  }

  const allocations = await allocationRepository.listAllocationsByAsset(assetId);
  const enrichedAllocations = await enrichAllocationList(allocations);

  return { asset, allocations: enrichedAllocations };
};
