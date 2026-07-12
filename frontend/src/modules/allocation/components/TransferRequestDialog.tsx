import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import FormModal from '@/components/shared/FormModal';
import EmployeeSearch from './EmployeeSearch';
import { useCreateTransfer } from '../hooks/useTransfers';
import { transferRequestSchema, type TransferRequestFormValues } from '../validation/allocation.schema';
import type { Allocation } from '../types/allocation.types';

interface TransferRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation: Allocation | null;
}

const TransferRequestDialog = ({ open, onOpenChange, allocation }: TransferRequestDialogProps) => {
  const createTransfer = useCreateTransfer();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferRequestFormValues>({ resolver: zodResolver(transferRequestSchema) });

  const onSubmit = async (values: TransferRequestFormValues) => {
    if (!allocation) return;

    try {
      await createTransfer.mutateAsync({ assetId: allocation.assetId, ...values });
      toast.success('Transfer request submitted');
      reset();
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to submit transfer request.');
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Request Transfer"
      description={allocation ? `Transfer ${allocation.asset?.name ?? 'this asset'} to another employee.` : undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label>New Holder</Label>
          <Controller
            control={control}
            name="newHolderId"
            render={({ field }) => (
              <EmployeeSearch
                value={field.value}
                onChange={field.onChange}
                excludeIds={allocation?.employeeId ? [allocation.employeeId] : []}
              />
            )}
          />
          {errors.newHolderId && <p className="text-sm text-destructive">{errors.newHolderId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea id="reason" placeholder="Why does this asset need to be transferred?" {...register('reason')} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </form>
    </FormModal>
  );
};

export default TransferRequestDialog;
