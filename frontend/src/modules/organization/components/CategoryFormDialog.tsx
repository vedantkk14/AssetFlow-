import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import FormModal from '@/components/shared/FormModal';
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories';
import { categorySchema, type CategoryFormValues } from '../validation/organization.schema';
import type { AssetCategory } from '../types/organization.types';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AssetCategory | null;
}

const CategoryFormDialog = ({ open, onOpenChange, category }: CategoryFormDialogProps) => {
  const isEditMode = Boolean(category);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? '',
        description: category?.description ?? '',
        defaultWarrantyMonths: category?.defaultWarrantyMonths ?? undefined,
      });
    }
  }, [open, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      defaultWarrantyMonths: values.defaultWarrantyMonths,
    };

    try {
      if (isEditMode && category) {
        await updateCategory.mutateAsync({ id: category.id, payload });
        toast.success('Asset category updated successfully');
      } else {
        await createCategory.mutateAsync(payload);
        toast.success('Asset category created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to save asset category. Please try again.');
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Asset Category' : 'Create Asset Category'}
      description="Define a category used when registering assets."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Laptops" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Optional description" {...register('description')} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultWarrantyMonths">Default Warranty (months)</Label>
          <Input
            id="defaultWarrantyMonths"
            type="number"
            min={0}
            max={120}
            placeholder="24"
            {...register('defaultWarrantyMonths')}
          />
          {errors.defaultWarrantyMonths && (
            <p className="text-sm text-destructive">{errors.defaultWarrantyMonths.message}</p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Category'}
          </Button>
        </DialogFooter>
      </form>
    </FormModal>
  );
};

export default CategoryFormDialog;
