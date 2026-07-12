import { useState } from 'react';
import { Plus } from 'lucide-react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchBar from '@/components/shared/SearchBar';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import CategoryTable from '../components/CategoryTable';
import CategoryFormDialog from '../components/CategoryFormDialog';
import { useCategories, useUpdateCategoryStatus } from '../hooks/useCategories';
import type { AssetCategory } from '../types/organization.types';

const CategoryManagementPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null);
  const [statusTarget, setStatusTarget] = useState<AssetCategory | null>(null);

  const { data, isLoading, isError } = useCategories({ page, limit: 10, search });
  const updateStatus = useUpdateCategoryStatus();

  const handleCreate = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: AssetCategory) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;

    try {
      await updateStatus.mutateAsync({
        id: statusTarget.id,
        status: statusTarget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      toast.success(`Category ${statusTarget.status === 'ACTIVE' ? 'deactivated' : 'activated'}`);
      setStatusTarget(null);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to update category status.');
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Asset Category Management</CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search categories..."
        />

        <CategoryTable
          categories={data?.items ?? []}
          isLoading={isLoading}
          error={isError ? 'Unable to load asset categories.' : null}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onEdit={handleEdit}
          onToggleStatus={setStatusTarget}
        />
      </CardContent>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editingCategory} />

      <ConfirmationDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.status === 'ACTIVE' ? 'Deactivate Category' : 'Activate Category'}
        description={`Are you sure you want to ${statusTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${statusTarget?.name}"?`}
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        variant={statusTarget?.status === 'ACTIVE' ? 'destructive' : 'default'}
        isLoading={updateStatus.isPending}
        onConfirm={handleConfirmStatusToggle}
      />
    </Card>
  );
};

export default CategoryManagementPage;
