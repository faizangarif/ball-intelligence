import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12', className)}>
      {icon && <div className="text-textMuted mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-textMuted text-sm max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
