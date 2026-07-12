import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, UserCheck, FileText, CheckSquare, Calendar, Wrench, Send, Landmark } from 'lucide-react';
import { Role } from '@/types/role.types';

interface QuickActionsProps {
  role: Role;
  onActionClick?: (actionKey: string) => void;
}

export const QuickActions = ({ role, onActionClick }: QuickActionsProps) => {
  const getActionsForRole = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Create Department', key: 'create-dept', icon: Landmark, variant: 'default' as const },
          { label: 'Register Asset', key: 'register-asset', icon: PlusCircle, variant: 'secondary' as const },
          { label: 'View Reports', key: 'view-reports', icon: FileText, variant: 'outline' as const },
        ];
      case 'ASSET_MANAGER':
        return [
          { label: 'Register Asset', key: 'register-asset', icon: PlusCircle, variant: 'default' as const },
          { label: 'Allocate Asset', key: 'allocate-asset', icon: UserCheck, variant: 'secondary' as const },
          { label: 'Approve Requests', key: 'approve-requests', icon: CheckSquare, variant: 'outline' as const },
        ];
      case 'DEPARTMENT_HEAD':
        return [
          { label: 'Approve Allocation', key: 'approve-allocation', icon: CheckSquare, variant: 'default' as const },
          { label: 'Book Resource', key: 'book-resource', icon: Calendar, variant: 'secondary' as const },
          { label: 'View Department Reports', key: 'view-reports', icon: FileText, variant: 'outline' as const },
        ];
      case 'EMPLOYEE':
      default:
        return [
          { label: 'Book Resource', key: 'book-resource', icon: Calendar, variant: 'default' as const },
          { label: 'Raise Maintenance', key: 'raise-maintenance', icon: Wrench, variant: 'secondary' as const },
          { label: 'Request Transfer', key: 'request-transfer', icon: Send, variant: 'outline' as const },
        ];
    }
  };

  const actions = getActionsForRole();

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.key}
              variant={action.variant}
              onClick={() => onActionClick?.(action.key)}
              className="w-full justify-start gap-2 h-10 font-medium"
            >
              <Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
