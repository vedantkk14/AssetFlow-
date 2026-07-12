import { Eye, MoreHorizontal, Power, PowerOff, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTable, { type DataTableColumn } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Employee } from '../types/organization.types';

const ROLE_LABEL: Record<Employee['role'], string> = {
  ADMIN: 'Admin',
  ASSET_MANAGER: 'Asset Manager',
  DEPARTMENT_HEAD: 'Department Head',
  EMPLOYEE: 'Employee',
};

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (employee: Employee) => void;
  onPromote: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
}

const EmployeeTable = ({
  employees,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onViewDetails,
  onPromote,
  onToggleStatus,
}: EmployeeTableProps) => {
  const columns: DataTableColumn<Employee>[] = [
    { key: 'name', header: 'Employee Name', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'department', header: 'Department', render: (row) => row.department?.name ?? '—' },
    { key: 'role', header: 'Current Role', render: (row) => <Badge variant="secondary">{ROLE_LABEL[row.role]}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'joinedDate',
      header: 'Joined Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
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
            <DropdownMenuItem onClick={() => onViewDetails(row)}>
              <Eye className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {row.role !== 'ADMIN' && (
              <DropdownMenuItem onClick={() => onPromote(row)}>
                <ShieldCheck className="h-4 w-4" />
                Change Role
              </DropdownMenuItem>
            )}
            {row.role !== 'ADMIN' && (
              <DropdownMenuItem onClick={() => onToggleStatus(row)}>
                {row.status === 'ACTIVE' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={employees}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      error={error}
      emptyTitle="No employees found"
      emptyDescription="Try adjusting your search or filters."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default EmployeeTable;
