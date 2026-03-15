'use client';

import { cn } from '@/lib/utils';

interface MomentumChartProps {
  momentum: 'home' | 'away' | 'neutral';
  homeTeam: string;
  awayTeam: string;
}

export function MomentumChart({ momentum, homeTeam, awayTeam }: MomentumChartProps) {
  const fillPercent =
    momentum === 'home' ? 65 : momentum === 'away' ? 35 : 50;

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-lg font-bold text-text mb-4">Momentum</h3>

      <div className="flex items-center gap-4">
        <span
          className={cn(
            'text-sm font-bold min-w-[40px] text-right',
            momentum === 'home' ? 'text-accent' : 'text-textMuted'
          )}
        >
          {homeTeam}
        </span>

        <div className="flex-1 bg-surfaceLight rounded-full h-3 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-700 ease-out"
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        <span
          className={cn(
            'text-sm font-bold min-w-[40px]',
            momentum === 'away' ? 'text-accent' : 'text-textMuted'
          )}
        >
          {awayTeam}
        </span>
      </div>

      <p className="text-center text-xs text-textMuted mt-3">
        {momentum === 'home'
          ? `${homeTeam} controlling the game`
          : momentum === 'away'
          ? `${awayTeam} controlling the game`
          : 'Even matchup'}
      </p>
    </div>
  );
}
