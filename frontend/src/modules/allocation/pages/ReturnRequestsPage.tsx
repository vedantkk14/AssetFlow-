import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AllocationTable from '../components/AllocationTable';
import ReturnDialog from '../components/ReturnDialog';
import { useAllocations } from '../hooks/useAllocations';
import type { Allocation, AllocationStatus } from '../types/allocation.types';

const FILTERS: { value: AllocationStatus; label: string }[] = [
  { value: 'RETURN_REQUESTED', label: 'Return Requested' },
  { value: 'ACTIVE', label: 'Active (Force Return)' },
  { value: 'OVERDUE', label: 'Overdue' },
];

const ReturnRequestsPage = () => {
  const [status, setStatus] = useState<AllocationStatus>('RETURN_REQUESTED');
  const [page, setPage] = useState(1);
  const [approveTarget, setApproveTarget] = useState<Allocation | null>(null);

  const { data, isLoading, isError } = useAllocations({ page, limit: 10, status });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Return Requests</CardTitle>
        <Select
          value={status}
          onValueChange={(value) => {
            if (!value) return;
            setStatus(value as AllocationStatus);
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <AllocationTable
          allocations={data?.items ?? []}
          isLoading={isLoading}
          error={isError ? 'Unable to load return requests.' : null}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onApproveReturn={setApproveTarget}
        />
      </CardContent>

      <ReturnDialog
        open={Boolean(approveTarget)}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        allocation={approveTarget}
        mode="approve"
      />
    </Card>
  );
};

export default ReturnRequestsPage;
