import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, CheckCircle2, XCircle, Bell } from 'lucide-react';
import { Notification } from '../types/dashboard.types';
import { Button } from '@/components/ui/button';

interface NotificationPanelProps {
  notifications: Notification[];
  className?: string;
}

export const NotificationPanel = ({ notifications, className }: NotificationPanelProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className={`border border-border shadow-xs ${className}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
        </div>
        {unreadCount > 0 && (
          <span className="text-[10px] font-semibold bg-rose-500 text-white px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No notifications found</div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-3 p-2.5 rounded-lg border border-border/50 transition-colors ${
                  !notification.read ? 'bg-muted/30 border-primary/10' : 'bg-background'
                }`}
              >
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-foreground truncate">{notification.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{notification.description}</p>
                  <span className="text-[9px] text-muted-foreground mt-1 block">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full text-xs font-medium text-muted-foreground hover:text-foreground mt-1">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
