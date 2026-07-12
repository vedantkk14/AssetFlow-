import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApproveTransfer, useRejectTransfer } from '../hooks/useTransfers';
import type { TransferRequest } from '../types/allocation.types';

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer: TransferRequest | null;
}

const ApprovalDialog = ({ open, onOpenChange, transfer }: ApprovalDialogProps) => {
  const approveTransfer = useApproveTransfer();
  const rejectTransfer = useRejectTransfer();
  const isLoading = approveTransfer.isPending || rejectTransfer.isPending;

  const handleApprove = async () => {
    if (!transfer) return;
    try {
      await approveTransfer.mutateAsync(transfer.id);
      toast.success('Transfer approved');
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to approve transfer.');
    }
  };

  const handleReject = async () => {
    if (!transfer) return;
    try {
      await rejectTransfer.mutateAsync(transfer.id);
      toast.success('Transfer rejected');
      onOpenChange(false);
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to reject transfer.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Transfer Request</DialogTitle>
          <DialogDescription>{transfer?.asset?.name}</DialogDescription>
        </DialogHeader>

        {transfer && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Holder</span>
              <span className="font-medium">{transfer.currentHolderUser?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requested Holder</span>
              <span className="font-medium">{transfer.newHolderUser?.name}</span>
            </div>
            {transfer.reason && (
              <div>
                <span className="text-muted-foreground">Reason</span>
                <p className="mt-1">{transfer.reason}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleReject} disabled={isLoading}>
            Reject
          </Button>
          <Button onClick={handleApprove} disabled={isLoading}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;
