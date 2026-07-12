import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import FormModal from '@/components/shared/FormModal';
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments';
import { useEmployees } from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { departmentSchema, type DepartmentFormValues } from '../validation/organization.schema';
import type { Department } from '../types/organization.types';

const NONE = '__none__';

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
}

const DepartmentFormDialog = ({ open, onOpenChange, department }: DepartmentFormDialogProps) => {
  const isEditMode = Boolean(department);
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const { data: departmentsData } = useDepartments({ limit: 100 });
  const { data: employeesData } = useEmployees({ limit: 100, status: 'ACTIVE' });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentSchema) });

  useEffect(() => {
    if (open) {
      reset({
        name: department?.name ?? '',
        code: department?.code ?? '',
        description: department?.description ?? '',
        parentDepartmentId: department?.parentDepartmentId ?? NONE,
        departmentHeadId: department?.departmentHeadId ?? NONE,
      });
    }
  }, [open, department, reset]);

  const onSubmit = async (values: DepartmentFormValues) => {
    const payload = {
      name: values.name,
      code: values.code,
      description: values.description || undefined,
      parentDepartmentId: values.parentDepartmentId && values.parentDepartmentId !== NONE ? values.parentDepartmentId : null,
      departmentHeadId: values.departmentHeadId && values.departmentHeadId !== NONE ? values.departmentHeadId : null,
    };

    try {
      if (isEditMode && department) {
        await updateDepartment.mutateAsync({ id: department.id, payload });
        toast.success('Department updated successfully');
      } else {
        await createDepartment.mutateAsync(payload);
        toast.success('Department created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to save department. Please try again.');
    }
  };

  const otherDepartments = (departmentsData?.items ?? []).filter((dept) => dept.id !== department?.id);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Department' : 'Create Department'}
      description="Configure department details, hierarchy, and head."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Engineering" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" placeholder="ENG" {...register('code')} />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Optional description" {...register('description')} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Parent Department</Label>
            <Controller
              control={control}
              name="parentDepartmentId"
              render={({ field }) => (
                <Select value={field.value ?? NONE} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>None</SelectItem>
                    {otherDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Department Head</Label>
            <Controller
              control={control}
              name="departmentHeadId"
              render={({ field }) => (
                <Select value={field.value ?? NONE} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>None</SelectItem>
                    {(employeesData?.items ?? []).map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Department'}
          </Button>
        </DialogFooter>
      </form>
    </FormModal>
  );
};

export default DepartmentFormDialog;
