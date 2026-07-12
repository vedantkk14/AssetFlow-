import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Employee } from '../types/organization.types';

const ROLE_LABEL: Record<Employee['role'], string> = {
  ADMIN: 'Admin',
  ASSET_MANAGER: 'Asset Manager',
  DEPARTMENT_HEAD: 'Department Head',
  EMPLOYEE: 'Employee',
};

interface EmployeeDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="text-sm">{value}</div>
  </div>
);

const EmployeeDetailsDrawer = ({ open, onOpenChange, employee }: EmployeeDetailsDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{employee?.name ?? 'Employee Details'}</SheetTitle>
          <SheetDescription>{employee?.email}</SheetDescription>
        </SheetHeader>

        {employee && (
          <div className="space-y-4 px-4 pb-4">
            <Field label="Current Role" value={<Badge variant="secondary">{ROLE_LABEL[employee.role]}</Badge>} />
            <Field label="Status" value={<StatusBadge status={employee.status} />} />
            <Separator />
            <Field label="Department" value={employee.department?.name ?? 'Not assigned'} />
            <Field label="Joined Date" value={new Date(employee.createdAt).toLocaleDateString()} />
            <Field label="Last Updated" value={new Date(employee.updatedAt).toLocaleString()} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeDetailsDrawer;
