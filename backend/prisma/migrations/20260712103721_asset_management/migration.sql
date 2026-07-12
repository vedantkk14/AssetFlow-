-- CreateTable
CREATE TABLE `assets` (
    `id` VARCHAR(191) NOT NULL,
    `assetTag` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL,
    `purchaseCost` DOUBLE NOT NULL,
    `condition` ENUM('NEW', 'GOOD', 'FAIR', 'DAMAGED') NOT NULL DEFAULT 'NEW',
    `status` ENUM('AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED') NOT NULL DEFAULT 'AVAILABLE',
    `manufacturer` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `vendor` VARCHAR(191) NULL,
    `warrantyStart` DATETIME(3) NULL,
    `warrantyEnd` DATETIME(3) NULL,
    `imageUrl` TEXT NULL,
    `qrCode` TEXT NULL,
    `isBookable` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `assets_assetTag_key`(`assetTag`),
    UNIQUE INDEX `assets_serialNumber_key`(`serialNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `asset_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_allocations` ADD CONSTRAINT `asset_allocations_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_requests` ADD CONSTRAINT `transfer_requests_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
