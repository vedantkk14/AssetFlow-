import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ title, description, actions, className }: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4 ${className}`}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>}
    </div>
  );
};

export default SectionHeader;
