'use client';

import { useState, useEffect } from 'react';
import type { Game } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tabs } from '@/components/ui/tabs';

interface BoxScoreProps {
  game: Game;
}

interface PlayerLine {
  name: string;
  stats: string[];
}

interface TeamBoxScore {
  abbreviation: string;
  labels: string[];
  players: PlayerLine[];
}

export function BoxScore({ game }: BoxScoreProps) {
  const [activeTeam, setActiveTeam] = useState(game.homeTeam.abbreviation);
  const [boxData, setBoxData] = useState<TeamBoxScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoxScore() {
      // Extract ESPN event ID from our game ID (format: nba-espn-401810832)
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

        const teamsData = data.boxscore?.players || [];
        const parsed: TeamBoxScore[] = teamsData.map((team: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const stats = team.statistics?.[0] || {};
          const labels = (stats.labels || []).slice(0, 8) as string[];
          const athletes = stats.athletes || [];
          const players: PlayerLine[] = athletes.slice(0, 8).map((a: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
            name: a.athlete?.displayName || a.athlete?.shortName || '?',
            stats: (a.stats || []).slice(0, 8) as string[],
          }));
          return {
            abbreviation: team.team?.abbreviation || '',
            labels,
            players,
          };
        });

        setBoxData(parsed);
        if (parsed.length > 0) {
          // Default to home team tab
          const homeBox = parsed.find((t) => t.abbreviation === game.homeTeam.abbreviation);
          if (homeBox) setActiveTeam(homeBox.abbreviation);
          else setActiveTeam(parsed[0].abbreviation);
        }
      } catch {
        // Failed to fetch — leave empty
      } finally {
        setLoading(false);
      }
    }

    fetchBoxScore();
  }, [game.id, game.league, game.homeTeam.abbreviation]);

  const tabs = boxData.length > 0
    ? boxData.map((t) => ({ label: t.abbreviation, value: t.abbreviation }))
    : [
        { label: game.homeTeam.abbreviation, value: game.homeTeam.abbreviation },
        { label: game.awayTeam.abbreviation, value: game.awayTeam.abbreviation },
      ];

  const activeBox = boxData.find((t) => t.abbreviation === activeTeam);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-lg font-bold text-text mb-4">Box Score</h3>
      <Tabs tabs={tabs} activeTab={activeTeam} onChange={setActiveTeam} className="mb-4" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-surfaceLight rounded animate-pulse" />
          ))}
        </div>
      ) : activeBox && activeBox.players.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-textMuted text-xs">
                <th className="text-left py-2 pr-4 font-medium">Player</th>
                {activeBox.labels.map((label) => (
                  <th key={label} className="text-center py-2 px-1.5 font-medium whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeBox.players.map((p, i) => (
                <tr
                  key={p.name}
                  className={cn(
                    'border-b border-border/50',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surfaceLight/30'
                  )}
                >
                  <td className="py-2.5 pr-4 font-medium text-text whitespace-nowrap">{p.name}</td>
                  {p.stats.map((s, j) => (
                    <td
                      key={j}
                      className={cn(
                        'text-center py-2.5 px-1.5 whitespace-nowrap',
                        j === 1 ? 'font-semibold text-text' : 'text-textMuted' // PTS column bold
                      )}
                    >
                      {s}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-textMuted text-sm text-center py-6">
          {game.status === 'SCHEDULED'
            ? 'Box score will be available once the game starts.'
            : 'Box score data unavailable for this game.'}
        </p>
      )}
    </div>
  );
}
