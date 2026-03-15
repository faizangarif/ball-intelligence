'use client';

import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameLogEntry {
  date: string;
  opp: string;
  result: string;
  stats: Record<string, string | number>;
}

const gameLogData: Record<string, GameLogEntry[]> = {
  'jayson-tatum': [
    { date: 'Mar 10', opp: 'MIL', result: 'W 118-105', stats: { PTS: 34, REB: 9, AST: 5, 'FG%': '12-22' } },
    { date: 'Mar 8', opp: '@CLE', result: 'L 102-110', stats: { PTS: 22, REB: 7, AST: 6, 'FG%': '8-20' } },
    { date: 'Mar 5', opp: 'PHI', result: 'W 125-112', stats: { PTS: 31, REB: 11, AST: 4, 'FG%': '11-19' } },
    { date: 'Mar 3', opp: '@NYK', result: 'W 114-108', stats: { PTS: 28, REB: 8, AST: 7, 'FG%': '10-21' } },
    { date: 'Mar 1', opp: 'MIA', result: 'W 121-99', stats: { PTS: 26, REB: 10, AST: 3, 'FG%': '9-17' } },
  ],
  'jaylen-brown': [
    { date: 'Mar 10', opp: 'MIL', result: 'W 118-105', stats: { PTS: 27, REB: 6, AST: 4, 'FG%': '10-18' } },
    { date: 'Mar 8', opp: '@CLE', result: 'L 102-110', stats: { PTS: 18, REB: 5, AST: 2, 'FG%': '7-17' } },
    { date: 'Mar 5', opp: 'PHI', result: 'W 125-112', stats: { PTS: 25, REB: 7, AST: 5, 'FG%': '10-20' } },
    { date: 'Mar 3', opp: '@NYK', result: 'W 114-108', stats: { PTS: 30, REB: 4, AST: 3, 'FG%': '12-22' } },
    { date: 'Mar 1', opp: 'MIA', result: 'W 121-99', stats: { PTS: 21, REB: 6, AST: 4, 'FG%': '8-16' } },
  ],
  'lebron-james': [
    { date: 'Mar 10', opp: 'GSW', result: 'W 122-115', stats: { PTS: 30, REB: 8, AST: 10, 'FG%': '12-20' } },
    { date: 'Mar 8', opp: '@PHX', result: 'L 108-115', stats: { PTS: 24, REB: 6, AST: 9, 'FG%': '9-18' } },
    { date: 'Mar 5', opp: 'SAC', result: 'W 130-118', stats: { PTS: 28, REB: 9, AST: 12, 'FG%': '11-19' } },
    { date: 'Mar 3', opp: '@DEN', result: 'L 104-112', stats: { PTS: 22, REB: 7, AST: 7, 'FG%': '8-17' } },
    { date: 'Mar 1', opp: 'MIN', result: 'W 116-110', stats: { PTS: 26, REB: 8, AST: 8, 'FG%': '10-18' } },
  ],
  'luka-doncic': [
    { date: 'Mar 10', opp: 'HOU', result: 'W 128-118', stats: { PTS: 38, REB: 10, AST: 11, 'FG%': '14-25' } },
    { date: 'Mar 8', opp: '@SAS', result: 'W 115-102', stats: { PTS: 32, REB: 8, AST: 9, 'FG%': '12-22' } },
    { date: 'Mar 5', opp: 'LAC', result: 'L 105-111', stats: { PTS: 29, REB: 11, AST: 8, 'FG%': '10-24' } },
    { date: 'Mar 3', opp: '@OKC', result: 'L 110-118', stats: { PTS: 35, REB: 9, AST: 12, 'FG%': '13-26' } },
    { date: 'Mar 1', opp: 'POR', result: 'W 132-110', stats: { PTS: 41, REB: 7, AST: 10, 'FG%': '15-27' } },
  ],
  'nikola-jokic': [
    { date: 'Mar 10', opp: 'MIN', result: 'W 118-108', stats: { PTS: 28, REB: 14, AST: 11, 'FG%': '11-17' } },
    { date: 'Mar 8', opp: '@LAL', result: 'W 112-104', stats: { PTS: 24, REB: 13, AST: 9, 'FG%': '10-16' } },
    { date: 'Mar 5', opp: 'OKC', result: 'L 106-115', stats: { PTS: 22, REB: 11, AST: 8, 'FG%': '9-18' } },
    { date: 'Mar 3', opp: '@DAL', result: 'W 120-112', stats: { PTS: 31, REB: 15, AST: 10, 'FG%': '13-19' } },
    { date: 'Mar 1', opp: 'PHX', result: 'W 116-104', stats: { PTS: 26, REB: 12, AST: 12, 'FG%': '10-15' } },
  ],
  'shai-gilgeous-alexander': [
    { date: 'Mar 10', opp: 'DEN', result: 'W 115-106', stats: { PTS: 34, REB: 6, AST: 7, 'FG%': '13-22' } },
    { date: 'Mar 8', opp: '@MEM', result: 'W 121-109', stats: { PTS: 28, REB: 5, AST: 5, 'FG%': '10-18' } },
    { date: 'Mar 5', opp: 'DAL', result: 'W 118-110', stats: { PTS: 36, REB: 4, AST: 8, 'FG%': '14-24' } },
    { date: 'Mar 3', opp: '@LAL', result: 'L 108-112', stats: { PTS: 25, REB: 6, AST: 6, 'FG%': '9-20' } },
    { date: 'Mar 1', opp: 'SAS', result: 'W 125-98', stats: { PTS: 30, REB: 7, AST: 5, 'FG%': '12-19' } },
  ],
  'giannis-antetokounmpo': [
    { date: 'Mar 10', opp: '@BOS', result: 'L 105-118', stats: { PTS: 32, REB: 13, AST: 6, 'FG%': '13-21' } },
    { date: 'Mar 8', opp: 'IND', result: 'W 125-115', stats: { PTS: 35, REB: 12, AST: 7, 'FG%': '14-22' } },
    { date: 'Mar 5', opp: '@CHI', result: 'W 118-102', stats: { PTS: 28, REB: 10, AST: 8, 'FG%': '11-18' } },
    { date: 'Mar 3', opp: 'CLE', result: 'W 112-106', stats: { PTS: 30, REB: 14, AST: 5, 'FG%': '12-19' } },
    { date: 'Mar 1', opp: '@ATL', result: 'W 130-120', stats: { PTS: 38, REB: 11, AST: 7, 'FG%': '15-23' } },
  ],
  'stephen-curry': [
    { date: 'Mar 10', opp: '@LAL', result: 'L 115-122', stats: { PTS: 28, REB: 5, AST: 6, 'FG%': '10-21' } },
    { date: 'Mar 8', opp: 'SAC', result: 'W 118-110', stats: { PTS: 32, REB: 4, AST: 5, 'FG%': '11-20' } },
    { date: 'Mar 5', opp: '@POR', result: 'W 125-108', stats: { PTS: 24, REB: 3, AST: 7, 'FG%': '9-18' } },
    { date: 'Mar 3', opp: 'DEN', result: 'L 105-110', stats: { PTS: 22, REB: 5, AST: 4, 'FG%': '8-20' } },
    { date: 'Mar 1', opp: 'LAC', result: 'W 112-104', stats: { PTS: 30, REB: 6, AST: 5, 'FG%': '11-19' } },
  ],
  'anthony-edwards': [
    { date: 'Mar 10', opp: '@DEN', result: 'L 108-118', stats: { PTS: 29, REB: 6, AST: 5, 'FG%': '11-23' } },
    { date: 'Mar 8', opp: 'MEM', result: 'W 120-105', stats: { PTS: 33, REB: 5, AST: 4, 'FG%': '12-22' } },
    { date: 'Mar 5', opp: '@DAL', result: 'L 110-115', stats: { PTS: 26, REB: 4, AST: 6, 'FG%': '10-22' } },
    { date: 'Mar 3', opp: 'POR', result: 'W 128-106', stats: { PTS: 31, REB: 7, AST: 5, 'FG%': '12-20' } },
    { date: 'Mar 1', opp: '@LAL', result: 'L 110-116', stats: { PTS: 24, REB: 5, AST: 6, 'FG%': '9-21' } },
  ],
  'kevin-durant': [
    { date: 'Mar 10', opp: 'LAL', result: 'W 115-108', stats: { PTS: 30, REB: 7, AST: 5, 'FG%': '11-18' } },
    { date: 'Mar 8', opp: '@SAC', result: 'W 112-106', stats: { PTS: 27, REB: 6, AST: 4, 'FG%': '10-17' } },
    { date: 'Mar 5', opp: 'DAL', result: 'L 108-114', stats: { PTS: 25, REB: 8, AST: 6, 'FG%': '9-19' } },
    { date: 'Mar 3', opp: '@GSW', result: 'L 104-110', stats: { PTS: 22, REB: 5, AST: 3, 'FG%': '8-18' } },
    { date: 'Mar 1', opp: 'DEN', result: 'W 116-104', stats: { PTS: 34, REB: 7, AST: 5, 'FG%': '13-20' } },
  ],
  // NFL QBs
  'jalen-hurts': [
    { date: 'Wk 18', opp: 'NYG', result: 'W 34-17', stats: { 'PASS YDS': 285, 'PASS TD': 3, 'RUSH YDS': 42 } },
    { date: 'Wk 17', opp: '@DAL', result: 'W 31-24', stats: { 'PASS YDS': 312, 'PASS TD': 2, 'RUSH YDS': 58 } },
    { date: 'Wk 16', opp: 'WSH', result: 'W 27-20', stats: { 'PASS YDS': 248, 'PASS TD': 1, 'RUSH YDS': 65 } },
    { date: 'Wk 15', opp: '@PIT', result: 'W 27-13', stats: { 'PASS YDS': 270, 'PASS TD': 2, 'RUSH YDS': 38 } },
    { date: 'Wk 14', opp: 'CAR', result: 'W 38-10', stats: { 'PASS YDS': 302, 'PASS TD': 3, 'RUSH YDS': 45 } },
  ],
  'patrick-mahomes': [
    { date: 'Wk 18', opp: 'DEN', result: 'W 31-21', stats: { 'PASS YDS': 320, 'PASS TD': 3, 'RUSH YDS': 28 } },
    { date: 'Wk 17', opp: '@LV', result: 'W 24-17', stats: { 'PASS YDS': 275, 'PASS TD': 2, 'RUSH YDS': 15 } },
    { date: 'Wk 16', opp: 'HOU', result: 'W 27-19', stats: { 'PASS YDS': 290, 'PASS TD': 2, 'RUSH YDS': 22 } },
    { date: 'Wk 15', opp: '@CLE', result: 'W 21-7', stats: { 'PASS YDS': 250, 'PASS TD': 1, 'RUSH YDS': 35 } },
    { date: 'Wk 14', opp: 'BUF', result: 'L 20-24', stats: { 'PASS YDS': 310, 'PASS TD': 2, 'RUSH YDS': 18 } },
  ],
  'josh-allen': [
    { date: 'Wk 18', opp: '@MIA', result: 'W 28-21', stats: { 'PASS YDS': 278, 'PASS TD': 2, 'RUSH YDS': 55 } },
    { date: 'Wk 17', opp: 'NE', result: 'W 35-14', stats: { 'PASS YDS': 310, 'PASS TD': 3, 'RUSH YDS': 42 } },
    { date: 'Wk 16', opp: '@KC', result: 'W 24-20', stats: { 'PASS YDS': 295, 'PASS TD': 2, 'RUSH YDS': 48 } },
    { date: 'Wk 15', opp: 'DET', result: 'L 21-28', stats: { 'PASS YDS': 240, 'PASS TD': 1, 'RUSH YDS': 30 } },
    { date: 'Wk 14', opp: '@LAR', result: 'W 31-24', stats: { 'PASS YDS': 335, 'PASS TD': 3, 'RUSH YDS': 60 } },
  ],
  'lamar-jackson': [
    { date: 'Wk 18', opp: 'CLE', result: 'W 35-10', stats: { 'PASS YDS': 280, 'PASS TD': 3, 'RUSH YDS': 75 } },
    { date: 'Wk 17', opp: '@HOU', result: 'W 28-25', stats: { 'PASS YDS': 305, 'PASS TD': 2, 'RUSH YDS': 68 } },
    { date: 'Wk 16', opp: 'PIT', result: 'W 31-17', stats: { 'PASS YDS': 260, 'PASS TD': 3, 'RUSH YDS': 82 } },
    { date: 'Wk 15', opp: '@NYG', result: 'W 24-14', stats: { 'PASS YDS': 225, 'PASS TD': 2, 'RUSH YDS': 55 } },
    { date: 'Wk 14', opp: 'CIN', result: 'W 35-28', stats: { 'PASS YDS': 340, 'PASS TD': 4, 'RUSH YDS': 45 } },
  ],
  // NFL RB
  'saquon-barkley': [
    { date: 'Wk 18', opp: 'NYG', result: 'W 34-17', stats: { 'RUSH YDS': 132, 'RUSH TD': 2, REC: 3, 'REC YDS': 28 } },
    { date: 'Wk 17', opp: '@DAL', result: 'W 31-24', stats: { 'RUSH YDS': 145, 'RUSH TD': 1, REC: 2, 'REC YDS': 15 } },
    { date: 'Wk 16', opp: 'WSH', result: 'W 27-20', stats: { 'RUSH YDS': 118, 'RUSH TD': 1, REC: 4, 'REC YDS': 35 } },
    { date: 'Wk 15', opp: '@PIT', result: 'W 27-13', stats: { 'RUSH YDS': 108, 'RUSH TD': 1, REC: 1, 'REC YDS': 12 } },
    { date: 'Wk 14', opp: 'CAR', result: 'W 38-10', stats: { 'RUSH YDS': 156, 'RUSH TD': 2, REC: 2, 'REC YDS': 22 } },
  ],
  // NFL WRs
  'aj-brown': [
    { date: 'Wk 18', opp: 'NYG', result: 'W 34-17', stats: { REC: 7, 'REC YDS': 112, 'REC TD': 1, TGT: 9 } },
    { date: 'Wk 17', opp: '@DAL', result: 'W 31-24', stats: { REC: 6, 'REC YDS': 98, 'REC TD': 1, TGT: 8 } },
    { date: 'Wk 16', opp: 'WSH', result: 'W 27-20', stats: { REC: 5, 'REC YDS': 85, 'REC TD': 0, TGT: 7 } },
    { date: 'Wk 15', opp: '@PIT', result: 'W 27-13', stats: { REC: 8, 'REC YDS': 125, 'REC TD': 2, TGT: 10 } },
    { date: 'Wk 14', opp: 'CAR', result: 'W 38-10', stats: { REC: 6, 'REC YDS': 102, 'REC TD': 1, TGT: 8 } },
  ],
  'devonta-smith': [
    { date: 'Wk 18', opp: 'NYG', result: 'W 34-17', stats: { REC: 5, 'REC YDS': 78, 'REC TD': 1, TGT: 7 } },
    { date: 'Wk 17', opp: '@DAL', result: 'W 31-24', stats: { REC: 6, 'REC YDS': 92, 'REC TD': 0, TGT: 8 } },
    { date: 'Wk 16', opp: 'WSH', result: 'W 27-20', stats: { REC: 4, 'REC YDS': 65, 'REC TD': 1, TGT: 6 } },
    { date: 'Wk 15', opp: '@PIT', result: 'W 27-13', stats: { REC: 5, 'REC YDS': 70, 'REC TD': 0, TGT: 7 } },
    { date: 'Wk 14', opp: 'CAR', result: 'W 38-10', stats: { REC: 7, 'REC YDS': 105, 'REC TD': 1, TGT: 9 } },
  ],
  'dallas-goedert': [
    { date: 'Wk 18', opp: 'NYG', result: 'W 34-17', stats: { REC: 4, 'REC YDS': 48, 'REC TD': 0, TGT: 5 } },
    { date: 'Wk 17', opp: '@DAL', result: 'W 31-24', stats: { REC: 5, 'REC YDS': 55, 'REC TD': 1, TGT: 6 } },
    { date: 'Wk 16', opp: 'WSH', result: 'W 27-20', stats: { REC: 3, 'REC YDS': 38, 'REC TD': 0, TGT: 4 } },
    { date: 'Wk 15', opp: '@PIT', result: 'W 27-13', stats: { REC: 4, 'REC YDS': 42, 'REC TD': 0, TGT: 5 } },
    { date: 'Wk 14', opp: 'CAR', result: 'W 38-10', stats: { REC: 5, 'REC YDS': 62, 'REC TD': 1, TGT: 7 } },
  ],
  'tyreek-hill': [
    { date: 'Wk 18', opp: 'NYJ', result: 'W 28-20', stats: { REC: 6, 'REC YDS': 95, 'REC TD': 1, TGT: 9 } },
    { date: 'Wk 17', opp: '@NE', result: 'W 24-17', stats: { REC: 5, 'REC YDS': 80, 'REC TD': 0, TGT: 7 } },
    { date: 'Wk 16', opp: 'BUF', result: 'L 21-28', stats: { REC: 4, 'REC YDS': 65, 'REC TD': 0, TGT: 8 } },
    { date: 'Wk 15', opp: '@HOU', result: 'W 30-22', stats: { REC: 7, 'REC YDS': 110, 'REC TD': 1, TGT: 10 } },
    { date: 'Wk 14', opp: 'LAR', result: 'W 27-17', stats: { REC: 8, 'REC YDS': 132, 'REC TD': 2, TGT: 11 } },
  ],
  'ceedee-lamb': [
    { date: 'Wk 18', opp: 'WSH', result: 'L 20-27', stats: { REC: 6, 'REC YDS': 88, 'REC TD': 1, TGT: 10 } },
    { date: 'Wk 17', opp: 'PHI', result: 'L 24-31', stats: { REC: 7, 'REC YDS': 95, 'REC TD': 0, TGT: 11 } },
    { date: 'Wk 16', opp: '@TB', result: 'W 28-21', stats: { REC: 8, 'REC YDS': 115, 'REC TD': 1, TGT: 12 } },
    { date: 'Wk 15', opp: 'CAR', result: 'W 31-14', stats: { REC: 5, 'REC YDS': 72, 'REC TD': 1, TGT: 8 } },
    { date: 'Wk 14', opp: '@CIN', result: 'L 24-27', stats: { REC: 9, 'REC YDS': 120, 'REC TD': 1, TGT: 13 } },
  ],
};

function getColumns(player: Player): string[] {
  if (player.league === 'NBA') {
    return ['Date', 'OPP', 'Result', 'PTS', 'REB', 'AST', 'FG%'];
  }
  if (player.position === 'QB') {
    return ['Date', 'OPP', 'Result', 'PASS YDS', 'PASS TD', 'RUSH YDS'];
  }
  if (player.position === 'RB') {
    return ['Date', 'OPP', 'Result', 'RUSH YDS', 'RUSH TD', 'REC', 'REC YDS'];
  }
  // WR / TE
  return ['Date', 'OPP', 'Result', 'REC', 'REC YDS', 'REC TD', 'TGT'];
}

interface PlayerGameLogProps {
  player: Player;
}

export function PlayerGameLog({ player }: PlayerGameLogProps) {
  const entries = gameLogData[player.slug] || gameLogData[player.id] || [];
  const columns = getColumns(player);

  if (entries.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surfaceLight">
            {columns.map((col) => (
              <th
                key={col}
                className={cn(
                  'px-3 py-2 text-xs font-semibold uppercase tracking-wider text-textMuted',
                  col === 'Date' || col === 'OPP' || col === 'Result'
                    ? 'text-left'
                    : 'text-right'
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={idx}
              className="border-b border-border/50 hover:bg-surfaceLight/30 transition-colors"
            >
              {columns.map((col) => {
                let value: string | number = '';
                if (col === 'Date') value = entry.date;
                else if (col === 'OPP') value = entry.opp;
                else if (col === 'Result') value = entry.result;
                else value = entry.stats[col] ?? '-';

                const isResult = col === 'Result';
                const isWin = isResult && String(value).startsWith('W');

                return (
                  <td
                    key={col}
                    className={cn(
                      'px-3 py-2.5 whitespace-nowrap',
                      col === 'Date' || col === 'OPP' || col === 'Result'
                        ? 'text-left'
                        : 'text-right font-medium text-text',
                      col === 'Date' && 'text-textMuted',
                      col === 'OPP' && 'font-semibold text-text',
                      isResult && isWin && 'text-green-400',
                      isResult && !isWin && 'text-red-400'
                    )}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
