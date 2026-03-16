'use client';

import { useState, useEffect } from 'react';
import type { Game } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameStatsComparisonProps {
  game: Game;
}

interface StatRow {
  label: string;
  home: string;
  away: string;
  homeVal: number;
  awayVal: number;
}

function StatBar({ stat }: { stat: StatRow }) {
  const total = stat.homeVal + stat.awayVal;
  const homePercent = total > 0 ? (stat.homeVal / total) * 100 : 50;
  const invertBetter = stat.label.toLowerCase().includes('turnover');
  const homeLeading = invertBetter ? stat.homeVal < stat.awayVal : stat.homeVal > stat.awayVal;
  const awayLeading = invertBetter ? stat.awayVal < stat.homeVal : stat.awayVal > stat.homeVal;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className={cn('font-semibold', homeLeading ? 'text-accent' : 'text-text')}>
          {stat.home}
        </span>
        <span className="text-textMuted text-xs font-medium">{stat.label}</span>
        <span className={cn('font-semibold', awayLeading ? 'text-accent' : 'text-text')}>
          {stat.away}
        </span>
      </div>
      <div className="flex gap-1 h-1.5">
        <div className="flex-1 flex justify-end">
          <div
            className={cn('h-full rounded-l-full transition-all', homeLeading ? 'bg-accent' : 'bg-surfaceLight')}
            style={{ width: `${homePercent}%` }}
          />
        </div>
        <div className="flex-1">
          <div
            className={cn('h-full rounded-r-full transition-all', awayLeading ? 'bg-accent' : 'bg-surfaceLight')}
            style={{ width: `${100 - homePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function GameStatsComparison({ game }: GameStatsComparisonProps) {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const espnId = game.id.replace(/^(nba|nfl)-espn-/, '');
      if (!espnId || espnId === game.id) {
        setLoading(false);
        return;
      }

      const sport = game.league === 'NBA' ? 'basketball/nba' : 'football/nfl';
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/${sport}/summary?event=${espnId}`
        );
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();

        const teamStats = data.boxscore?.teams || [];
        if (teamStats.length < 2) { setLoading(false); return; }

        // teamStats[0] and [1] contain team statistics arrays
        const home = teamStats.find((t: { team: { abbreviation: string } }) =>
          t.team?.abbreviation === game.homeTeam.abbreviation
        ) || teamStats[0];
        const away = teamStats.find((t: { team: { abbreviation: string } }) =>
          t.team?.abbreviation === game.awayTeam.abbreviation
        ) || teamStats[1];

        const homeStats: Record<string, string> = {};
        const awayStats: Record<string, string> = {};

        for (const s of (home.statistics || [])) {
          homeStats[s.label || s.name] = s.displayValue || String(s.value || 0);
        }
        for (const s of (away.statistics || [])) {
          awayStats[s.label || s.name] = s.displayValue || String(s.value || 0);
        }

        // Pick the most interesting stats to display
        const statKeys = game.league === 'NBA'
          ? [
              { key: 'fieldGoalsMade-fieldGoalsAttempted', label: 'Field Goals', alt: ['FGM-FGA'] },
              { key: 'fieldGoalPct', label: 'FG%', alt: ['Field Goal %'] },
              { key: 'threePointFieldGoalPct', label: '3PT%', alt: ['Three Point %', '3PT %'] },
              { key: 'rebounds', label: 'Rebounds', alt: ['Total Rebounds', 'totalRebounds'] },
              { key: 'assists', label: 'Assists', alt: [] },
              { key: 'turnovers', label: 'Turnovers', alt: [] },
              { key: 'steals', label: 'Steals', alt: [] },
              { key: 'blocks', label: 'Blocks', alt: [] },
            ]
          : [
              { key: 'totalYards', label: 'Total Yards', alt: [] },
              { key: 'passingYards', label: 'Passing Yards', alt: ['netPassingYards'] },
              { key: 'rushingYards', label: 'Rushing Yards', alt: [] },
              { key: 'firstDowns', label: 'First Downs', alt: [] },
              { key: 'turnovers', label: 'Turnovers', alt: [] },
              { key: 'possessionTime', label: 'Possession', alt: [] },
            ];

        const rows: StatRow[] = [];
        for (const { key, label, alt } of statKeys) {
          const hVal = homeStats[key] || homeStats[label] || alt.reduce((v: string, a: string) => v || homeStats[a], '') || '';
          const aVal = awayStats[key] || awayStats[label] || alt.reduce((v: string, a: string) => v || awayStats[a], '') || '';
          if (hVal || aVal) {
            rows.push({
              label,
              home: hVal || '0',
              away: aVal || '0',
              homeVal: parseFloat(hVal) || 0,
              awayVal: parseFloat(aVal) || 0,
            });
          }
        }

        if (rows.length > 0) setStats(rows);
      } catch {
        // leave empty
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [game.id, game.league, game.homeTeam.abbreviation, game.awayTeam.abbreviation]);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-lg font-bold text-text mb-4">Team Stats</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-surfaceLight rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-lg font-bold text-text mb-2">Team Stats</h3>
        <p className="text-textMuted text-sm text-center py-6">
          {game.status === 'SCHEDULED'
            ? 'Team stats will be available once the game starts.'
            : 'Team stats unavailable for this game.'}
        </p>
      </div>
    );
  }

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
