/**
 * TEMPORARY — stand-in for the Asset Management module, which is still being
 * built on a separate branch. Do NOT add real business logic here.
 *
 * Once that module merges:
 *  - Replace `findTempAssetById` / `listTempAssets` calls in allocation.service.ts
 *    and transfer.service.ts with real `prisma.asset.findUnique` / `findMany` calls.
 *  - Add a proper `assetId` relation on AssetAllocation/TransferRequest in
 *    schema.prisma (see the comment there) and run a migration.
 *  - Delete this file.
 *
 * Note: "is this asset currently available" is intentionally NOT tracked here —
 * that's derived from AssetAllocation records (the real source of truth), so
 * that logic keeps working unchanged after this file is deleted.
 */
export interface TempAsset {
  id: string;
  name: string;
  assetTag: string;
}

const TEMP_ASSETS: TempAsset[] = [
  { id: 'temp-asset-1', name: 'Dell Latitude 5420', assetTag: 'AF-0101' },
  { id: 'temp-asset-2', name: 'HP LaserJet Pro M404', assetTag: 'AF-0102' },
  { id: 'temp-asset-3', name: 'Conference Room Projector', assetTag: 'AF-0103' },
  { id: 'temp-asset-4', name: 'MacBook Pro 14"', assetTag: 'AF-0104' },
  { id: 'temp-asset-5', name: 'Company Vehicle - Toyota Innova', assetTag: 'AF-0105' },
];

export const findTempAssetById = (id: string): TempAsset | null =>
  TEMP_ASSETS.find((asset) => asset.id === id) ?? null;

export const listTempAssets = (): TempAsset[] => TEMP_ASSETS;
