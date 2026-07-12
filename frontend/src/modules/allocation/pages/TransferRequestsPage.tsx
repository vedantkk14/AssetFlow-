import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable, { type DataTableColumn } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import ApprovalDialog from '../components/ApprovalDialog';
import { useTransfers } from '../hooks/useTransfers';
import type { TransferRequest } from '../types/allocation.types';

const TransferRequestsPage = () => {
  const { user } = useAuth();
  const canReview = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  const [page, setPage] = useState(1);
  const [reviewTarget, setReviewTarget] = useState<TransferRequest | null>(null);

  const { data, isLoading, isError } = useTransfers({ page, limit: 10 });

  const columns: DataTableColumn<TransferRequest>[] = [
    { key: 'asset', header: 'Asset', render: (row) => row.asset?.name ?? row.assetId },
    { key: 'currentHolder', header: 'Current Holder', render: (row) => row.currentHolderUser?.name ?? '—' },
    { key: 'newHolder', header: 'Requested Holder', render: (row) => row.newHolderUser?.name ?? '—' },
    { key: 'reason', header: 'Reason', render: (row) => row.reason ?? '—' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      render: (row) =>
        canReview && row.status === 'PENDING' ? (
          <Button variant="outline" size="sm" onClick={() => setReviewTarget(row)}>
            Review
          </Button>
        ) : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          error={isError ? 'Unable to load transfer requests.' : null}
          emptyTitle="No transfer requests"
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </CardContent>

      <ApprovalDialog
        open={Boolean(reviewTarget)}
        onOpenChange={(open) => !open && setReviewTarget(null)}
        transfer={reviewTarget}
      />
    </Card>
  );
};

export default TransferRequestsPage;
