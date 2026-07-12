import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE';
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const isActive = status === 'ACTIVE';

  return (
    <Badge
      variant="outline"
      className={cn(
        isActive
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400'
          : 'border-muted bg-muted text-muted-foreground',
        className
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

export default StatusBadge;
