import { MoreHorizontal, RotateCcw, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTable, { type DataTableColumn } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Allocation } from '../types/allocation.types';

interface AllocationTableProps {
  allocations: Allocation[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRequestReturn?: (allocation: Allocation) => void;
  onRequestTransfer?: (allocation: Allocation) => void;
  onApproveReturn?: (allocation: Allocation) => void;
}

const AllocationTable = ({
  allocations,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onRequestReturn,
  onRequestTransfer,
  onApproveReturn,
}: AllocationTableProps) => {
  const hasActions = Boolean(onRequestReturn || onRequestTransfer || onApproveReturn);

  const columns: DataTableColumn<Allocation>[] = [
    { key: 'asset', header: 'Asset', render: (row) => row.asset?.name ?? row.assetId },
    { key: 'employee', header: 'Employee', render: (row) => row.employee?.name ?? '—' },
    {
      key: 'allocatedDate',
      header: 'Allocated',
      render: (row) => new Date(row.allocatedDate).toLocaleDateString(),
    },
    {
      key: 'expectedReturnDate',
      header: 'Expected Return',
      render: (row) => (row.expectedReturnDate ? new Date(row.expectedReturnDate).toLocaleDateString() : '—'),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  if (hasActions) {
    columns.push({
      key: 'actions',
      header: '',
      className: 'w-10',
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onRequestReturn && ['ACTIVE', 'OVERDUE'].includes(row.status) && (
              <DropdownMenuItem onClick={() => onRequestReturn(row)}>
                <RotateCcw className="h-4 w-4" />
                Request Return
              </DropdownMenuItem>
            )}
            {onRequestTransfer && ['ACTIVE', 'OVERDUE'].includes(row.status) && (
              <DropdownMenuItem onClick={() => onRequestTransfer(row)}>
                <Send className="h-4 w-4" />
                Request Transfer
              </DropdownMenuItem>
            )}
            {onApproveReturn && ['ACTIVE', 'RETURN_REQUESTED', 'OVERDUE'].includes(row.status) && (
              <DropdownMenuItem onClick={() => onApproveReturn(row)}>
                <ShieldCheck className="h-4 w-4" />
                {row.status === 'RETURN_REQUESTED' ? 'Approve Return' : 'Force Return'}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });
  }

  return (
    <DataTable
      columns={columns}
      data={allocations}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      error={error}
      emptyTitle="No allocations found"
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default AllocationTable;
