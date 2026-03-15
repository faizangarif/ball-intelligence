import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ label, value, change, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-surface/50 border border-border/50 rounded-xl p-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-text">{value}</span>
        {change && (
          <span
            className={cn(
              'flex items-center',
              change === 'up' && 'text-accent',
              change === 'down' && 'text-live',
              change === 'neutral' && 'text-textMuted'
            )}
          >
            {change === 'up' && <TrendingUp className="w-4 h-4" />}
            {change === 'down' && <TrendingDown className="w-4 h-4" />}
            {change === 'neutral' && <Minus className="w-4 h-4" />}
          </span>
        )}
      </div>
      <span className="text-xs text-textMuted uppercase tracking-wide mt-1 block">
        {label}
      </span>
    </div>
  );
}
