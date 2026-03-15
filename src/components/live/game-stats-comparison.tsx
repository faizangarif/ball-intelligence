'use client';

import type { Game } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameStatsComparisonProps {
  game: Game;
}

interface StatRow {
  label: string;
  home: number;
  away: number;
  isPercentage?: boolean;
}

function getNBAStats(): StatRow[] {
  return [
    { label: 'Points', home: 87, away: 82 },
    { label: 'Rebounds', home: 34, away: 31 },
    { label: 'Assists', home: 22, away: 18 },
    { label: 'Turnovers', home: 8, away: 12 },
    { label: 'FG%', home: 48.2, away: 44.6, isPercentage: true },
    { label: '3PT%', home: 39.1, away: 34.5, isPercentage: true },
    { label: 'Free Throws', home: 15, away: 12 },
  ];
}

function getNFLStats(): StatRow[] {
  return [
    { label: 'Passing Yards', home: 245, away: 198 },
    { label: 'Rushing Yards', home: 112, away: 87 },
    { label: 'First Downs', home: 18, away: 14 },
    { label: 'Turnovers', home: 1, away: 2 },
    { label: 'Time of Possession', home: 32, away: 28 },
    { label: 'Third Down %', home: 45.5, away: 38.2, isPercentage: true },
  ];
}

function StatBar({ stat }: { stat: StatRow }) {
  const total = stat.home + stat.away;
  const homePercent = total > 0 ? (stat.home / total) * 100 : 50;
  const invertBetter = stat.label === 'Turnovers';
  const homeLeading = invertBetter ? stat.home < stat.away : stat.home > stat.away;
  const awayLeading = invertBetter ? stat.away < stat.home : stat.away > stat.home;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className={cn('font-semibold', homeLeading ? 'text-accent' : 'text-text')}>
          {stat.isPercentage ? stat.home.toFixed(1) : stat.home}
        </span>
        <span className="text-textMuted text-xs font-medium">{stat.label}</span>
        <span className={cn('font-semibold', awayLeading ? 'text-accent' : 'text-text')}>
          {stat.isPercentage ? stat.away.toFixed(1) : stat.away}
        </span>
      </div>
      <div className="flex gap-1 h-1.5">
        <div className="flex-1 flex justify-end">
          <div
            className={cn(
              'h-full rounded-l-full transition-all',
              homeLeading ? 'bg-accent' : 'bg-surfaceLight'
            )}
            style={{ width: `${homePercent}%` }}
          />
        </div>
        <div className="flex-1">
          <div
            className={cn(
              'h-full rounded-r-full transition-all',
              awayLeading ? 'bg-accent' : 'bg-surfaceLight'
            )}
            style={{ width: `${100 - homePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function GameStatsComparison({ game }: GameStatsComparisonProps) {
  const stats = game.league === 'NBA' ? getNBAStats() : getNFLStats();

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-lg font-bold text-text mb-2">Team Stats</h3>
      <div className="flex justify-between text-xs text-textMuted mb-2">
        <span className="font-semibold">{game.homeTeam.abbreviation}</span>
        <span className="font-semibold">{game.awayTeam.abbreviation}</span>
      </div>
      <div className="divide-y divide-border">
        {stats.map((stat) => (
          <StatBar key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
