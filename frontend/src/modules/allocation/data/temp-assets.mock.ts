/**
 * TEMPORARY — stand-in for the Asset Management module, which is still being
 * built on a separate branch. IDs here must match backend/src/modules/allocation/
 * temp-asset.mock.ts so allocate/transfer requests actually resolve.
 *
 * Once the Asset module merges: replace AssetSearch.tsx's usage of this file
 * with a real `useAssets()` query against the Asset API, then delete this file.
 */
export interface TempAsset {
  id: string;
  name: string;
  assetTag: string;
}

export const TEMP_ASSETS: TempAsset[] = [
  { id: 'temp-asset-1', name: 'Dell Latitude 5420', assetTag: 'AF-0101' },
  { id: 'temp-asset-2', name: 'HP LaserJet Pro M404', assetTag: 'AF-0102' },
  { id: 'temp-asset-3', name: 'Conference Room Projector', assetTag: 'AF-0103' },
  { id: 'temp-asset-4', name: 'MacBook Pro 14"', assetTag: 'AF-0104' },
  { id: 'temp-asset-5', name: 'Company Vehicle - Toyota Innova', assetTag: 'AF-0105' },
];

export const findTempAssetById = (id: string): TempAsset | null =>
  TEMP_ASSETS.find((asset) => asset.id === id) ?? null;
