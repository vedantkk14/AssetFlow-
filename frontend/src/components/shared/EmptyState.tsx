import * as Icons from 'lucide-react';
import { Inbox, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  iconName?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

const EmptyState = ({ icon, iconName, title = 'No records found', description, actionLabel, onActionClick }: EmptyStateProps) => {
  const Icon = icon ?? (iconName ? ((Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Inbox) : Inbox);

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {actionLabel && onActionClick && (
        <Button size="sm" className="mt-2" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
