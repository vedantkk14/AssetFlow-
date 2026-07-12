import { MoreHorizontal, Pencil, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTable, { type DataTableColumn } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import type { AssetCategory } from '../types/organization.types';

interface CategoryTableProps {
  categories: AssetCategory[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (category: AssetCategory) => void;
  onToggleStatus: (category: AssetCategory) => void;
}

const CategoryTable = ({
  categories,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onToggleStatus,
}: CategoryTableProps) => {
  const columns: DataTableColumn<AssetCategory>[] = [
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'description', header: 'Description', render: (row) => row.description ?? '—' },
    {
      key: 'warranty',
      header: 'Default Warranty',
      render: (row) => (row.defaultWarrantyMonths ? `${row.defaultWarrantyMonths} months` : '—'),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(row)}>
              {row.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      error={error}
      emptyTitle="No asset categories yet"
      emptyDescription="Create your first category to get started."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default CategoryTable;
