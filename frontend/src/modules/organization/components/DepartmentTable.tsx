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
import type { Department } from '../types/organization.types';

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (department: Department) => void;
  onToggleStatus: (department: Department) => void;
}

const DepartmentTable = ({
  departments,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onToggleStatus,
}: DepartmentTableProps) => {
  const columns: DataTableColumn<Department>[] = [
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'code', header: 'Code', render: (row) => row.code },
    { key: 'parent', header: 'Parent Department', render: (row) => row.parentDepartment?.name ?? '—' },
    { key: 'head', header: 'Department Head', render: (row) => row.departmentHead?.name ?? '—' },
    { key: 'employees', header: 'Employees', render: (row) => row._count.employees },
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
      data={departments}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      error={error}
      emptyTitle="No departments yet"
      emptyDescription="Create your first department to get started."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default DepartmentTable;
