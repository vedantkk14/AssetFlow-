import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  iconName = 'Inbox',
  actionLabel,
  onActionClick,
  className,
}: EmptyStateProps) => {
  const IconComponent = (Icons as any)[iconName] || Icons.Inbox;

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-muted/25 ${className}`}>
      <div className="p-3 bg-muted/45 rounded-full text-muted-foreground mb-4">
        <IconComponent className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 leading-normal">{description}</p>
      {actionLabel && onActionClick && (
        <Button onClick={onActionClick} size="sm" className="font-medium">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
