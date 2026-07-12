import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployees } from '@/modules/organization/hooks/useEmployees';

interface EmployeeSearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  excludeIds?: string[];
}

const EmployeeSearch = ({ value, onChange, placeholder = 'Select employee', excludeIds = [] }: EmployeeSearchProps) => {
  const { data } = useEmployees({ limit: 100, status: 'ACTIVE' });
  const employees = (data?.items ?? []).filter((employee) => !excludeIds.includes(employee.id));

  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {employees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.name} ({employee.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EmployeeSearch;
