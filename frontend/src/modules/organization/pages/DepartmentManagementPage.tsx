import { useState } from 'react';
import { Plus } from 'lucide-react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import DepartmentTable from '../components/DepartmentTable';
import DepartmentFormDialog from '../components/DepartmentFormDialog';
import { useDepartments, useUpdateDepartmentStatus } from '../hooks/useDepartments';
import type { Department } from '../types/organization.types';

const DepartmentManagementPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [statusTarget, setStatusTarget] = useState<Department | null>(null);

  const { data, isLoading, isError } = useDepartments({ page, limit: 10, search });
  const updateStatus = useUpdateDepartmentStatus();

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormOpen(true);
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;

    try {
      await updateStatus.mutateAsync({
        id: statusTarget.id,
        status: statusTarget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      toast.success(`Department ${statusTarget.status === 'ACTIVE' ? 'deactivated' : 'activated'}`);
      setStatusTarget(null);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to update department status.');
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Department Management</CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New Department
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by name or code..."
        />

        <DepartmentTable
          departments={data?.items ?? []}
          isLoading={isLoading}
          error={isError ? 'Unable to load departments.' : null}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onEdit={handleEdit}
          onToggleStatus={setStatusTarget}
        />
      </CardContent>

      <DepartmentFormDialog open={formOpen} onOpenChange={setFormOpen} department={editingDepartment} />

      <ConfirmationDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.status === 'ACTIVE' ? 'Deactivate Department' : 'Activate Department'}
        description={`Are you sure you want to ${statusTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${statusTarget?.name}"?`}
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        variant={statusTarget?.status === 'ACTIVE' ? 'destructive' : 'default'}
        isLoading={updateStatus.isPending}
        onConfirm={handleConfirmStatusToggle}
      />
    </Card>
  );
};

export default DepartmentManagementPage;
