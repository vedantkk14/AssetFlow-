import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, User, Sun, Moon, Laptop } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import NotificationBell from '../shared/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Role } from '@/types/role.types';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50';
      case 'ASSET_MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
      case 'DEPARTMENT_HEAD':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50';
      case 'EMPLOYEE':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-900/50';
    }
  };

  const formatRole = (role: Role) => {
    return role.replace('_', ' ');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-background border-b border-border sticky top-0 z-40 shrink-0">
      {/* Left side: Hamburger menu for mobile, Search bar on desktop */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden h-10 w-10 rounded-full hover:bg-muted">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
        <SearchBar className="hidden md:flex" />
      </div>

      {/* Right side: Actions, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Theme Toggle Placeholder */}
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Profile Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  <Badge variant="outline" className={`w-fit mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 border ${getRoleBadgeColor(user.role)}`}>
                    {formatRole(user.role)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Laptop className="h-4 w-4 text-muted-foreground" />
                <span>My Assets</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer text-rose-600 dark:text-rose-400 focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;

