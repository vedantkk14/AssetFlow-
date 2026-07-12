import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import FormModal from '@/components/shared/FormModal';
import { useApproveReturn, useRequestReturn } from '../hooks/useAllocations';
import {
  approveReturnSchema,
  returnRequestSchema,
  type ApproveReturnFormValues,
  type ReturnRequestFormValues,
} from '../validation/allocation.schema';
import type { Allocation } from '../types/allocation.types';

interface ReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation: Allocation | null;
  mode: 'request' | 'approve';
}

const ReturnDialog = ({ open, onOpenChange, allocation, mode }: ReturnDialogProps) => {
  const requestReturn = useRequestReturn();
  const approveReturn = useApproveReturn();
  const isApproveMode = mode === 'approve';

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReturnRequestFormValues | ApproveReturnFormValues>({
    resolver: zodResolver(isApproveMode ? approveReturnSchema : returnRequestSchema),
  });

  const onSubmit = async (values: ReturnRequestFormValues | ApproveReturnFormValues) => {
    if (!allocation) return;

    try {
      if (isApproveMode) {
        await approveReturn.mutateAsync({ id: allocation.id, payload: values as ApproveReturnFormValues });
        toast.success('Return approved');
      } else {
        await requestReturn.mutateAsync({ id: allocation.id, payload: values as ReturnRequestFormValues });
        toast.success('Return requested');
      }
      reset();
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to process return.');
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isApproveMode ? 'Approve Return' : 'Request Return'}
      description={allocation ? `${allocation.asset?.name ?? 'Asset'} — ${allocation.employee?.name ?? ''}` : undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {isApproveMode && (
          <div className="space-y-2">
            <Label htmlFor="conditionAtReturn">Condition on Return</Label>
            <Input id="conditionAtReturn" placeholder="e.g. Good, Damaged" {...register('conditionAtReturn')} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="Optional notes" {...register('notes')} />
        </div>

        {isApproveMode && (
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex h-24 items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              Photo upload coming soon
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isApproveMode ? 'Approve Return' : 'Request Return'}
          </Button>
        </DialogFooter>
      </form>
    </FormModal>
  );
};

export default ReturnDialog;
