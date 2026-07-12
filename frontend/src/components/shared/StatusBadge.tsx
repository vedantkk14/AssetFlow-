import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type BadgeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'OVERDUE'
  | 'TRANSFER_PENDING'
  | 'TRANSFERRED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

interface StatusBadgeProps {
  status: BadgeStatus | (string & {});
  className?: string;
}

const STATUS_STYLES: Record<BadgeStatus, string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400',
  APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400',
  RETURNED: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-400',
  TRANSFERRED: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-400',
  RETURN_REQUESTED: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400',
  TRANSFER_PENDING: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400',
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400',
  OVERDUE: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400',
  INACTIVE: 'border-muted bg-muted text-muted-foreground',
};

const STATUS_LABELS: Record<BadgeStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  RETURN_REQUESTED: 'Return Requested',
  RETURNED: 'Returned',
  OVERDUE: 'Overdue',
  TRANSFER_PENDING: 'Transfer Pending',
  TRANSFERRED: 'Transferred',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const style = STATUS_STYLES[status as BadgeStatus] ?? 'border-muted bg-muted text-muted-foreground';
  const label = STATUS_LABELS[status as BadgeStatus] ?? toTitleCase(status);

  return (
    <Badge variant="outline" className={cn(style, className)}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
