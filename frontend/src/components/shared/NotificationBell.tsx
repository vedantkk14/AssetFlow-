import { useState } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  time: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Asset Overdue Return',
    description: 'Vehicle Honda Civic #AF-0099 is overdue for return by 2 hours.',
    type: 'danger',
    read: false,
    time: '5m ago',
  },
  {
    id: '2',
    title: 'Maintenance Approved',
    description: 'Your request for iMac #AF-0120 has been approved.',
    type: 'info',
    read: false,
    time: '30m ago',
  },
  {
    id: '3',
    title: 'New Booking Confirmed',
    description: 'Meeting Room 2 booking confirmed for tomorrow 10:00 AM.',
    type: 'success',
    read: true,
    time: '1h ago',
  },
  {
    id: '4',
    title: 'Audit Discrepancy Alert',
    description: 'Auditor flagged Asset #AF-0250 (Printer) as "Damaged".',
    type: 'warning',
    read: true,
    time: '1 day ago',
  },
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="font-semibold text-sm text-foreground">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto px-1.5 py-0.5 text-xs text-primary hover:bg-transparent"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto py-1">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`flex gap-3 items-start p-2 rounded-md transition-colors ${
                  !n.read ? 'bg-muted/30 font-medium' : ''
                }`}
              >
                {getIcon(n.type)}
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-xs text-foreground truncate">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{n.description}</p>
                  <span className="text-[10px] text-muted-foreground block">{n.time}</span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <Button variant="ghost" size="sm" className="w-full text-xs text-center text-muted-foreground hover:text-foreground">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

