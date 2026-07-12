import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  iconName: string;
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  iconName,
  className,
}: DashboardCardProps) => {
  // Resolve Lucide icon dynamically
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;

  const changeColors = {
    up: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
    down: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400',
    neutral: 'text-muted-foreground bg-muted/50',
  };

  return (
    <Card className={cn("overflow-hidden border border-border shadow-xs hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-muted/40 rounded-lg text-muted-foreground">
          <IconComponent className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {change && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className={cn("inline-flex items-center text-[11px] font-medium px-1.5 py-0.5 rounded-full", changeColors[changeType])}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
