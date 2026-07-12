import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Controlled when value/onChange are provided (e.g. filtering a table);
// otherwise falls back to internal state so it can be dropped in as a
// visual-only placeholder (e.g. the Navbar).
const SearchBar = ({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (next: string) => {
    if (isControlled) {
      onChange?.(next);
    } else {
      setInternalValue(next);
    }
  };

  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={currentValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  );
};

export default SearchBar;
