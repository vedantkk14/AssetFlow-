import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types/role.types';
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowLeftRight,
  CalendarRange,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onMobileClose?: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: any;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, onMobileClose }: SidebarProps) => {
  const { user } = useAuth();
  const role = user?.role || 'EMPLOYEE';

  const getMenuForRole = (userRole: Role): MenuItem[] => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Organization Setup', path: '/admin/organization', icon: Building2 },
          { label: 'Assets', path: '/admin/assets', icon: Package },
          { label: 'Allocation & Transfer', path: '/admin/allocation', icon: ArrowLeftRight },
          { label: 'Resource Booking', path: '/admin/booking', icon: CalendarRange },
          { label: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
          { label: 'Audit', path: '/admin/audit', icon: ClipboardCheck },
          { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { label: 'Notifications', path: '/admin/notifications', icon: Bell },
        ];
      case 'ASSET_MANAGER':
        return [
          { label: 'Dashboard', path: '/asset-manager/dashboard', icon: LayoutDashboard },
          { label: 'Assets', path: '/asset-manager/assets', icon: Package },
          { label: 'Allocation & Transfer', path: '/asset-manager/allocation', icon: ArrowLeftRight },
          { label: 'Maintenance', path: '/asset-manager/maintenance', icon: Wrench },
          { label: 'Notifications', path: '/asset-manager/notifications', icon: Bell },
        ];
      case 'DEPARTMENT_HEAD':
        return [
          { label: 'Dashboard', path: '/department/dashboard', icon: LayoutDashboard },
          { label: 'Department Assets', path: '/department/assets', icon: Package },
          { label: 'Allocation Requests', path: '/department/allocations', icon: ArrowLeftRight },
          { label: 'Bookings', path: '/department/bookings', icon: CalendarRange },
          { label: 'Reports', path: '/department/reports', icon: BarChart3 },
          { label: 'Notifications', path: '/department/notifications', icon: Bell },
        ];
      case 'EMPLOYEE':
      default:
        return [
          { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
          { label: 'My Assets', path: '/employee/assets', icon: Package },
          { label: 'Book Resource', path: '/employee/bookings', icon: CalendarRange },
          { label: 'Maintenance Requests', path: '/employee/maintenance', icon: Wrench },
          { label: 'Transfer Requests', path: '/employee/transfers', icon: ArrowLeftRight },
          { label: 'Notifications', path: '/employee/notifications', icon: Bell },
          { label: 'Profile', path: '/employee/profile', icon: User },
        ];
    }
  };

  const menuItems = getMenuForRole(role);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground shrink-0 shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-base text-sidebar-foreground tracking-tight whitespace-nowrap">
              Asset<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-md">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Toggle Button when Collapsed */}
      {isCollapsed && (
        <div className="hidden md:flex items-center justify-center p-3 border-t border-sidebar-border shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

