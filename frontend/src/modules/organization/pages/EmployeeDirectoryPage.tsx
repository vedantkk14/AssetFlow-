import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import EmployeeTable from '../components/EmployeeTable';
import PromotionDialog from '../components/PromotionDialog';
import EmployeeDetailsDrawer from '../components/EmployeeDetailsDrawer';
import { useEmployees, useUpdateEmployeeStatus } from '../hooks/useEmployees';
import type { Employee, EmployeeListParams } from '../types/organization.types';

const ALL = '__all__';

const EmployeeDirectoryPage = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [sort, setSort] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [promotionTarget, setPromotionTarget] = useState<Employee | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<Employee | null>(null);
  const [statusTarget, setStatusTarget] = useState<Employee | null>(null);

  const [sortBy, sortOrder] = sort.split(':') as [EmployeeListParams['sortBy'], EmployeeListParams['sortOrder']];

  const { data, isLoading, isError } = useEmployees({
    page,
    limit: 10,
    search,
    role: role === ALL ? undefined : (role as Employee['role']),
    status: status === ALL ? undefined : (status as Employee['status']),
    sortBy,
    sortOrder,
  });
  const updateStatus = useUpdateEmployeeStatus();

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;

    try {
      await updateStatus.mutateAsync({
        id: statusTarget.id,
        status: statusTarget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      toast.success(`${statusTarget.name} ${statusTarget.status === 'ACTIVE' ? 'deactivated' : 'activated'}`);
      setStatusTarget(null);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to update employee status.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Directory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
          />

          <Select
            value={role}
            onValueChange={(value) => {
              if (!value) return;
              setRole(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="ASSET_MANAGER">Asset Manager</SelectItem>
              <SelectItem value="DEPARTMENT_HEAD">Department Head</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              if (!value) return;
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => value && setSort(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest First</SelectItem>
              <SelectItem value="createdAt:asc">Oldest First</SelectItem>
              <SelectItem value="name:asc">Name (A-Z)</SelectItem>
              <SelectItem value="name:desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <EmployeeTable
          employees={data?.items ?? []}
          isLoading={isLoading}
          error={isError ? 'Unable to load employees.' : null}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onViewDetails={setDetailsTarget}
          onPromote={setPromotionTarget}
          onToggleStatus={setStatusTarget}
        />
      </CardContent>

      <PromotionDialog
        open={Boolean(promotionTarget)}
        onOpenChange={(open) => !open && setPromotionTarget(null)}
        employee={promotionTarget}
      />

      <EmployeeDetailsDrawer
        open={Boolean(detailsTarget)}
        onOpenChange={(open) => !open && setDetailsTarget(null)}
        employee={detailsTarget}
      />

      <ConfirmationDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.status === 'ACTIVE' ? 'Deactivate Employee' : 'Activate Employee'}
        description={`Are you sure you want to ${statusTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${statusTarget?.name}"?`}
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        variant={statusTarget?.status === 'ACTIVE' ? 'destructive' : 'default'}
        isLoading={updateStatus.isPending}
        onConfirm={handleConfirmStatusToggle}
      />
    </Card>
  );
};

export default EmployeeDirectoryPage;
