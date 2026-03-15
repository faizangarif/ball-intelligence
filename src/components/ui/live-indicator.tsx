'use client';

import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  className?: string;
}

export function LiveIndicator({ className }: LiveIndicatorProps) {
  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <span className="w-2 h-2 rounded-full bg-live animate-pulse-live" />
      <span className="text-live text-xs font-bold uppercase">LIVE</span>
    </span>
  );
}
