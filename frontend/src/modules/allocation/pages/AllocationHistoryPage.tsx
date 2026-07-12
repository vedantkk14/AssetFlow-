import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AssetSearch from '../components/AssetSearch';
import AllocationTimeline from '../components/AllocationTimeline';
import { useAllocationHistory } from '../hooks/useAllocations';

const AllocationHistoryPage = () => {
  const [assetId, setAssetId] = useState<string | undefined>();
  const { data, isLoading, isError } = useAllocationHistory(assetId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-sm">
          <AssetSearch value={assetId} onChange={setAssetId} placeholder="Select an asset to view its history" />
        </div>

        {!assetId && <p className="text-sm text-muted-foreground">Select an asset above to see its full timeline.</p>}
        {assetId && isLoading && <p className="text-sm text-muted-foreground">Loading history...</p>}
        {assetId && isError && <p className="text-sm text-destructive">Unable to load history for this asset.</p>}
        {assetId && data && <AllocationTimeline allocations={data.allocations} />}
      </CardContent>
    </Card>
  );
};

export default AllocationHistoryPage;
