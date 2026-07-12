import { ArrowLeftRight, CheckCircle2, Clock, PackageCheck } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Allocation } from '../types/allocation.types';

const STATUS_ICON: Record<Allocation['status'], typeof PackageCheck> = {
  ACTIVE: PackageCheck,
  RETURN_REQUESTED: Clock,
  RETURNED: CheckCircle2,
  OVERDUE: Clock,
  TRANSFER_PENDING: ArrowLeftRight,
  TRANSFERRED: ArrowLeftRight,
};

interface AllocationTimelineProps {
  allocations: Allocation[];
}

const AllocationTimeline = ({ allocations }: AllocationTimelineProps) => {
  if (allocations.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No allocation history for this asset yet.</p>;
  }

  return (
    <div className="relative space-y-6 border-l border-border pl-6">
      {allocations.map((allocation) => {
        const Icon = STATUS_ICON[allocation.status];
        return (
          <div key={allocation.id} className="relative">
            <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-4 ring-background">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{allocation.employee?.name ?? 'Unknown employee'}</p>
              <StatusBadge status={allocation.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Allocated {new Date(allocation.allocatedDate).toLocaleDateString()}
              {allocation.expectedReturnDate &&
                ` · Due ${new Date(allocation.expectedReturnDate).toLocaleDateString()}`}
              {allocation.actualReturnDate &&
                ` · Returned ${new Date(allocation.actualReturnDate).toLocaleDateString()}`}
            </p>
            {allocation.notes && <p className="mt-1 text-xs text-muted-foreground">{allocation.notes}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default AllocationTimeline;
