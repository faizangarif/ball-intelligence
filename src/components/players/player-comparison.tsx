'use client';

import { cn } from '@/lib/utils';
import type { Player } from '@/lib/types';

interface PlayerComparisonProps {
  players: Player[];
}

export function PlayerComparison({ players }: PlayerComparisonProps) {
  if (players.length < 2) return null;
  const [p1, p2] = players;
  const stats1 = p1.seasonStats;
  const stats2 = p2.seasonStats;

  const compareKeys =
    p1.league === 'NBA'
      ? ['ppg', 'rpg', 'apg', 'fgPct']
      : ['passingYards', 'rushingYards', 'receivingYards'];

  const labels: Record<string, string> = {
    ppg: 'PTS',
    rpg: 'REB',
    apg: 'AST',
    fgPct: 'FG%',
    passingYards: 'PASS YDS',
    rushingYards: 'RUSH YDS',
    receivingYards: 'REC YDS',
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-text">{p1.name}</span>
        <span className="text-xs text-textMuted uppercase">vs</span>
        <span className="text-sm font-bold text-text">{p2.name}</span>
      </div>
      <div className="space-y-3">
        {compareKeys.map((key) => {
          const v1 = (stats1 as Record<string, number>)[key] ?? 0;
          const v2 = (stats2 as Record<string, number>)[key] ?? 0;
          const max = Math.max(v1, v2) || 1;
          return (
            <div key={key}>
              <div className="text-xs text-textMuted text-center mb-1">
                {labels[key] || key}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-bold w-12 text-right',
                    v1 >= v2 ? 'text-accent' : 'text-textMuted'
                  )}
                >
                  {typeof v1 === 'number' && v1 < 1 ? v1 : v1}
                </span>
                <div className="flex-1 flex gap-1 h-2">
                  <div className="flex-1 flex justify-end">
                    <div
                      className={cn('h-full rounded-l-full', v1 >= v2 ? 'bg-accent' : 'bg-border')}
                      style={{ width: `${(v1 / max) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={cn(
                        'h-full rounded-r-full',
                        v2 >= v1 ? 'bg-accent' : 'bg-border'
                      )}
                      style={{ width: `${(v2 / max) * 100}%` }}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    'text-sm font-bold w-12',
                    v2 >= v1 ? 'text-accent' : 'text-textMuted'
                  )}
                >
                  {v2}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
