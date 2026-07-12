import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Send, Wrench, Calendar, ClipboardCheck, Settings, HelpCircle } from 'lucide-react';
import { Activity } from '../types/dashboard.types';

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIconAndColor = (type: Activity['type']) => {
    switch (type) {
      case 'allocation':
        return {
          icon: UserCheck,
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'transfer':
        return {
          icon: Send,
          bg: 'bg-indigo-50 dark:bg-indigo-950/20',
          text: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'maintenance':
        return {
          icon: Wrench,
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          text: 'text-amber-600 dark:text-amber-400',
        };
      case 'booking':
        return {
          icon: Calendar,
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          text: 'text-blue-600 dark:text-blue-400',
        };
      case 'audit':
        return {
          icon: ClipboardCheck,
          bg: 'bg-cyan-50 dark:bg-cyan-950/20',
          text: 'text-cyan-600 dark:text-cyan-400',
        };
      case 'system':
        return {
          icon: Settings,
          bg: 'bg-slate-50 dark:bg-slate-950/20',
          text: 'text-slate-600 dark:text-slate-400',
        };
      default:
        return {
          icon: HelpCircle,
          bg: 'bg-muted',
          text: 'text-muted-foreground',
        };
    }
  };

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
        <span className="text-[11px] text-muted-foreground">Live Feed</span>
      </CardHeader>
      <CardContent className="pb-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No recent activities found</div>
        ) : (
          <div className="relative pl-6 border-l border-border space-y-5">
            {activities.map((activity) => {
              const { icon: Icon, bg, text } = getIconAndColor(activity.type);
              return (
                <div key={activity.id} className="relative group">
                  {/* Timeline point */}
                  <span className={`absolute -left-[37px] top-0.5 p-1.5 rounded-full ring-4 ring-background ${bg} ${text}`}>
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground block font-medium">
                      {activity.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
