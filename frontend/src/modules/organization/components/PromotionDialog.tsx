import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import FormModal from '@/components/shared/FormModal';
import { usePromoteEmployee } from '../hooks/useEmployees';
import { promotionSchema, type PromotionFormValues } from '../validation/organization.schema';
import type { Employee } from '../types/organization.types';

const ROLE_OPTIONS: { value: PromotionFormValues['role']; label: string }[] = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'DEPARTMENT_HEAD', label: 'Department Head' },
  { value: 'ASSET_MANAGER', label: 'Asset Manager' },
];

interface PromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const PromotionDialog = ({ open, onOpenChange, employee }: PromotionDialogProps) => {
  const promoteEmployee = usePromoteEmployee();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PromotionFormValues>({ resolver: zodResolver(promotionSchema) });

  useEffect(() => {
    if (open && employee) {
      reset({ role: employee.role === 'ADMIN' ? 'EMPLOYEE' : employee.role });
    }
  }, [open, employee, reset]);

  const onSubmit = async (values: PromotionFormValues) => {
    if (!employee) return;

    if (employee.status !== 'ACTIVE') {
      toast.error('Only active employees can be promoted');
      return;
    }

    try {
      await promoteEmployee.mutateAsync({ id: employee.id, role: values.role });
      toast.success(`${employee.name}'s role has been updated`);
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to update role. Please try again.');
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Change Employee Role"
      description={employee ? `Update the role for ${employee.name}.` : undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label>Role</Label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </form>
    </FormModal>
  );
};

export default PromotionDialog;
