'use client';

import { useState } from 'react';
import type { Game } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tabs } from '@/components/ui/tabs';

interface BoxScoreProps {
  game: Game;
}

interface NBAPlayerStat {
  player: string;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  fg: string;
}

interface NFLPlayerStat {
  player: string;
  position: string;
  stats: string;
}

function getNBABoxScore(teamAbbr: string): NBAPlayerStat[] {
  const rosters: Record<string, NBAPlayerStat[]> = {
    BOS: [
      { player: 'J. Tatum', min: 32, pts: 24, reb: 6, ast: 4, fg: '9-18' },
      { player: 'J. Brown', min: 30, pts: 18, reb: 4, ast: 3, fg: '7-15' },
      { player: 'D. White', min: 28, pts: 14, reb: 3, ast: 5, fg: '5-11' },
      { player: 'K. Porzingis', min: 26, pts: 20, reb: 8, ast: 2, fg: '8-14' },
      { player: 'J. Holiday', min: 29, pts: 11, reb: 3, ast: 6, fg: '4-10' },
    ],
    LAL: [
      { player: 'L. James', min: 34, pts: 22, reb: 5, ast: 7, fg: '8-17' },
      { player: 'A. Davis', min: 33, pts: 26, reb: 10, ast: 2, fg: '10-19' },
      { player: 'A. Reaves', min: 28, pts: 14, reb: 3, ast: 4, fg: '5-12' },
      { player: 'D. Russell', min: 25, pts: 10, reb: 2, ast: 5, fg: '4-11' },
      { player: 'R. Hachimura', min: 22, pts: 10, reb: 4, ast: 1, fg: '4-9' },
    ],
    GSW: [
      { player: 'S. Curry', min: 34, pts: 28, reb: 4, ast: 6, fg: '10-20' },
      { player: 'A. Wiggins', min: 30, pts: 16, reb: 5, ast: 2, fg: '6-14' },
      { player: 'D. Green', min: 28, pts: 8, reb: 7, ast: 8, fg: '3-8' },
      { player: 'K. Looney', min: 22, pts: 6, reb: 9, ast: 2, fg: '3-5' },
      { player: 'B. Podziemski', min: 26, pts: 12, reb: 3, ast: 4, fg: '5-11' },
    ],
  };
  return rosters[teamAbbr] ?? rosters['BOS']!;
}

function getNFLBoxScore(teamAbbr: string): NFLPlayerStat[] {
  const rosters: Record<string, NFLPlayerStat[]> = {
    default: [
      { player: 'QB1', position: 'QB', stats: '22/31, 245 YDS, 2 TD' },
      { player: 'RB1', position: 'RB', stats: '18 CAR, 87 YDS, 1 TD' },
      { player: 'WR1', position: 'WR', stats: '7 REC, 112 YDS, 1 TD' },
      { player: 'WR2', position: 'WR', stats: '5 REC, 68 YDS' },
      { player: 'TE1', position: 'TE', stats: '4 REC, 42 YDS' },
    ],
  };
  return rosters[teamAbbr] ?? rosters['default']!;
}

export function BoxScore({ game }: BoxScoreProps) {
  const [activeTeam, setActiveTeam] = useState(game.homeTeam.abbreviation);

  const tabs = [
    { label: game.homeTeam.abbreviation, value: game.homeTeam.abbreviation },
    { label: game.awayTeam.abbreviation, value: game.awayTeam.abbreviation },
  ];

  const isNBA = game.league === 'NBA';

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-lg font-bold text-text mb-4">Box Score</h3>
      <Tabs tabs={tabs} activeTab={activeTeam} onChange={setActiveTeam} className="mb-4" />

      {isNBA ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-textMuted text-xs">
                <th className="text-left py-2 pr-4 font-medium">Player</th>
                <th className="text-center py-2 px-2 font-medium">MIN</th>
                <th className="text-center py-2 px-2 font-medium">PTS</th>
                <th className="text-center py-2 px-2 font-medium">REB</th>
                <th className="text-center py-2 px-2 font-medium">AST</th>
                <th className="text-center py-2 pl-2 font-medium">FG</th>
              </tr>
            </thead>
            <tbody>
              {getNBABoxScore(activeTeam).map((p, i) => (
                <tr
                  key={p.player}
                  className={cn(
                    'border-b border-border/50',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surfaceLight/30'
                  )}
                >
                  <td className="py-2.5 pr-4 font-medium text-text">{p.player}</td>
                  <td className="text-center py-2.5 px-2 text-textMuted">{p.min}</td>
                  <td className="text-center py-2.5 px-2 font-semibold text-text">{p.pts}</td>
                  <td className="text-center py-2.5 px-2 text-textMuted">{p.reb}</td>
                  <td className="text-center py-2.5 px-2 text-textMuted">{p.ast}</td>
                  <td className="text-center py-2.5 pl-2 text-textMuted">{p.fg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-textMuted text-xs">
                <th className="text-left py-2 pr-4 font-medium">Player</th>
                <th className="text-center py-2 px-2 font-medium">POS</th>
                <th className="text-left py-2 pl-2 font-medium">Stats</th>
              </tr>
            </thead>
            <tbody>
              {getNFLBoxScore(activeTeam).map((p, i) => (
                <tr
                  key={p.player}
                  className={cn(
                    'border-b border-border/50',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surfaceLight/30'
                  )}
                >
                  <td className="py-2.5 pr-4 font-medium text-text">{p.player}</td>
                  <td className="text-center py-2.5 px-2 text-textMuted">{p.position}</td>
                  <td className="py-2.5 pl-2 text-textMuted">{p.stats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
