import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ placeholder = 'Search assets, requests, bookings...', className }: SearchBarProps) => {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9 pr-12 h-10 w-full rounded-lg bg-muted/40 hover:bg-muted/60 focus:bg-background border-border"
      />
      <div className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 border border-border bg-background text-[10px] text-muted-foreground rounded pointer-events-none font-mono">
        <span>Ctrl</span>
        <span>K</span>
      </div>
    </div>
  );
};

export default SearchBar;

