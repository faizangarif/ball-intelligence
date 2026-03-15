'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerSelectorProps {
  players: { slug: string; name: string }[];
  selected: string;
  onSelect: (slug: string) => void;
  className?: string;
}

export function PlayerSelector({
  players,
  selected,
  onSelect,
  className,
}: PlayerSelectorProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-surfaceLight border border-border rounded-lg px-4 py-2.5 pr-10 text-text text-sm font-medium w-full cursor-pointer focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
      >
        {players.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
    </div>
  );
}
