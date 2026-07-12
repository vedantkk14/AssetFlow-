import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import AllocationTable from '../components/AllocationTable';
import ReturnDialog from '../components/ReturnDialog';
import TransferRequestDialog from '../components/TransferRequestDialog';
import { useAllocations } from '../hooks/useAllocations';
import type { Allocation } from '../types/allocation.types';

const MyAllocationsPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [returnTarget, setReturnTarget] = useState<Allocation | null>(null);
  const [transferTarget, setTransferTarget] = useState<Allocation | null>(null);

  const { data, isLoading, isError } = useAllocations({ page, limit: 10, employeeId: user?.id });

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Allocations</CardTitle>
      </CardHeader>
      <CardContent>
        <AllocationTable
          allocations={data?.items ?? []}
          isLoading={isLoading}
          error={isError ? 'Unable to load your allocations.' : null}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onRequestReturn={setReturnTarget}
          onRequestTransfer={setTransferTarget}
        />
      </CardContent>

      <ReturnDialog
        open={Boolean(returnTarget)}
        onOpenChange={(open) => !open && setReturnTarget(null)}
        allocation={returnTarget}
        mode="request"
      />

      <TransferRequestDialog
        open={Boolean(transferTarget)}
        onOpenChange={(open) => !open && setTransferTarget(null)}
        allocation={transferTarget}
      />
    </Card>
  );
};

export default MyAllocationsPage;
