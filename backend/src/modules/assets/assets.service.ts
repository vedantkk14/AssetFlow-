import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { AssetStatus, AssetCondition, Prisma } from '@prisma/client';
import { CreateAssetInput, UpdateAssetInput, AssetFilters, PaginationQuery } from './assets.types';

export class AssetsService {
  static async createAsset(userId: string, input: CreateAssetInput) {
    // 1. Verify Category exists
    const categoryExists = await prisma.assetCategory.findUnique({
      where: { id: input.categoryId },
    });
    if (!categoryExists) {
      throw ApiError.badRequest(`Asset category with ID ${input.categoryId} does not exist`);
    }

    // 2. Verify Department exists
    const deptExists = await prisma.department.findUnique({
      where: { id: input.departmentId },
    });
    if (!deptExists) {
      throw ApiError.badRequest(`Department with ID ${input.departmentId} does not exist`);
    }

    // 3. Verify Serial Number is unique
    const serialExists = await prisma.asset.findUnique({
      where: { serialNumber: input.serialNumber },
    });
    if (serialExists) {
      throw ApiError.badRequest(`Asset with serial number ${input.serialNumber} already exists`);
    }

    // 4. Auto-generate Asset Tag (AF-XXXXXX)
    const lastAsset = await prisma.asset.findFirst({
      orderBy: { assetTag: 'desc' },
    });
    let nextNum = 1;
    if (lastAsset) {
      const match = lastAsset.assetTag.match(/AF-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const assetTag = `AF-${String(nextNum).padStart(6, '0')}`;

    // 5. Generate QR Code URL
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${assetTag}`;

    // 6. Create Asset in Database
    return await prisma.asset.create({
      data: {
        assetTag,
        name: input.name,
        description: input.description,
        serialNumber: input.serialNumber,
        categoryId: input.categoryId,
        departmentId: input.departmentId,
        location: input.location,
        purchaseDate: new Date(input.purchaseDate),
        purchaseCost: input.purchaseCost,
        condition: input.condition || AssetCondition.NEW,
        status: input.status || AssetStatus.AVAILABLE,
        manufacturer: input.manufacturer,
        model: input.model,
        vendor: input.vendor,
        warrantyStart: input.warrantyStart ? new Date(input.warrantyStart) : null,
        warrantyEnd: input.warrantyEnd ? new Date(input.warrantyEnd) : null,
        imageUrl: input.imageUrl,
        qrCode,
        isBookable: input.isBookable || false,
        createdBy: userId,
      },
      include: {
        category: true,
        department: true,
      },
    });
  }

  static async updateAsset(id: string, input: UpdateAssetInput) {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw ApiError.notFound('Asset not found');
    }

    if (input.categoryId) {
      const categoryExists = await prisma.assetCategory.findUnique({
        where: { id: input.categoryId },
      });
      if (!categoryExists) {
        throw ApiError.badRequest('Asset category does not exist');
      }
    }

    if (input.departmentId) {
      const deptExists = await prisma.department.findUnique({
        where: { id: input.departmentId },
      });
      if (!deptExists) {
        throw ApiError.badRequest('Department does not exist');
      }
    }

    if (input.serialNumber && input.serialNumber !== asset.serialNumber) {
      const serialExists = await prisma.asset.findUnique({
        where: { serialNumber: input.serialNumber },
      });
      if (serialExists) {
        throw ApiError.badRequest('Serial number already in use by another asset');
      }
    }

    return await prisma.asset.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        serialNumber: input.serialNumber,
        categoryId: input.categoryId,
        departmentId: input.departmentId,
        location: input.location,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : undefined,
        purchaseCost: input.purchaseCost,
        condition: input.condition,
        status: input.status,
        manufacturer: input.manufacturer,
        model: input.model,
        vendor: input.vendor,
        warrantyStart: input.warrantyStart === null ? null : input.warrantyStart ? new Date(input.warrantyStart) : undefined,
        warrantyEnd: input.warrantyEnd === null ? null : input.warrantyEnd ? new Date(input.warrantyEnd) : undefined,
        imageUrl: input.imageUrl,
        isBookable: input.isBookable,
      },
      include: {
        category: true,
        department: true,
      },
    });
  }

  static async updateAssetStatus(id: string, status: AssetStatus) {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw ApiError.notFound('Asset not found');
    }

    return await prisma.asset.update({
      where: { id },
      data: { status },
      include: {
        category: true,
        department: true,
      },
    });
  }

  static async deleteAsset(id: string) {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      throw ApiError.notFound('Asset not found');
    }

    // Attempt actual deletion
    try {
      return await prisma.asset.delete({ where: { id } });
    } catch {
      // If references exist, soft delete by retiring it instead
      return await prisma.asset.update({
        where: { id },
        data: { status: AssetStatus.RETIRED },
      });
    }
  }

  static async getAssetById(id: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        category: true,
        department: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!asset) {
      throw ApiError.notFound('Asset not found');
    }

    return asset;
  }

  static async getAllAssets(filters: AssetFilters, pagination: PaginationQuery) {
    const page = Math.max(1, Number(pagination.page || 1));
    const limit = Math.max(1, Number(pagination.limit || 10));
    const skip = (page - 1) * limit;

    const sortBy = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder || 'desc';

    const where: Prisma.AssetWhereInput = {};

    // 1. Search Query (matching tag, name, serial number, location, vendor, model, category, department)
    if (filters.search) {
      const searchLower = filters.search.trim();
      where.OR = [
        { assetTag: { contains: searchLower } },
        { name: { contains: searchLower } },
        { serialNumber: { contains: searchLower } },
        { location: { contains: searchLower } },
        { manufacturer: { contains: searchLower } },
        { model: { contains: searchLower } },
        { category: { name: { contains: searchLower } } },
        { department: { name: { contains: searchLower } } },
      ];
    }

    // 2. Status Filters
    if (filters.status) {
      const statuses = filters.status.split(',') as AssetStatus[];
      where.status = { in: statuses };
    }

    // 3. Condition Filters
    if (filters.condition) {
      const conditions = filters.condition.split(',') as AssetCondition[];
      where.condition = { in: conditions };
    }

    // 4. Department ID
    if (filters.departmentId) {
      where.departmentId = filters.departmentId;
    }

    // 5. Category ID
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // 6. Bookable Toggles
    if (filters.isBookable !== undefined) {
      where.isBookable = filters.isBookable === true || String(filters.isBookable) === 'true';
    }

    // 7. Purchase Date Filter Range
    if (filters.purchaseDateStart || filters.purchaseDateEnd) {
      where.purchaseDate = {};
      if (filters.purchaseDateStart) {
        where.purchaseDate.gte = new Date(filters.purchaseDateStart);
      }
      if (filters.purchaseDateEnd) {
        where.purchaseDate.lte = new Date(filters.purchaseDateEnd);
      }
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: true,
          department: true,
        },
      }),
      prisma.asset.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      assets,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  static async getAssetsByCategory(categoryId: string) {
    return await prisma.asset.findMany({
      where: { categoryId },
      include: {
        category: true,
        department: true,
      },
    });
  }

  static async getAssetsByDepartment(departmentId: string) {
    return await prisma.asset.findMany({
      where: { departmentId },
      include: {
        category: true,
        department: true,
      },
    });
  }
}
