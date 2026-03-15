'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tabs } from '@/components/ui/tabs';
import type { Team } from '@/lib/types';

interface StandingsTableProps {
  teams: Team[];
}

const conferenceTabs = [
  { label: 'Eastern', value: 'Eastern' },
  { label: 'Western', value: 'Western' },
];

export function NBAStandingsTable({ teams }: StandingsTableProps) {
  const [conference, setConference] = useState('Eastern');

  const filtered = teams
    .filter((t) => t.conference === conference)
    .sort((a, b) => {
      const pctA = a.wins / (a.wins + a.losses || 1);
      const pctB = b.wins / (b.wins + b.losses || 1);
      return pctB - pctA;
    });

  return (
    <div>
      <Tabs
        tabs={conferenceTabs}
        activeTab={conference}
        onChange={setConference}
        className="mb-4"
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surfaceLight text-textMuted text-xs uppercase tracking-wider">
              <th className="px-3 py-2.5 text-left font-semibold w-10">#</th>
              <th className="px-3 py-2.5 text-left font-semibold">Team</th>
              <th className="px-3 py-2.5 text-center font-semibold w-12">W</th>
              <th className="px-3 py-2.5 text-center font-semibold w-12">L</th>
              <th className="px-3 py-2.5 text-center font-semibold w-16">PCT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((team, index) => {
              const isCeltics = team.slug === 'boston-celtics';
              const pct = (team.wins / (team.wins + team.losses || 1)).toFixed(3);

              return (
                <tr
                  key={team.id}
                  className={cn(
                    'border-b border-border/50 transition-colors',
                    'hover:bg-surfaceLight/50',
                    isCeltics && 'bg-accent/5',
                    index % 2 === 0 ? 'bg-surface' : 'bg-surface/50'
                  )}
                >
                  <td className="px-3 py-2.5 text-sm text-textMuted font-mono">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/teams/nba/${team.slug}`}
                      className={cn(
                        'flex items-center gap-2 group',
                      )}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: team.primaryColor }}
                      />
                      <span
                        className={cn(
                          'text-sm font-medium text-text group-hover:text-accent transition-colors',
                          isCeltics && 'font-bold'
                        )}
                      >
                        {team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm font-semibold text-text">
                    {team.wins}
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm text-textMuted">
                    {team.losses}
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm font-mono text-text">
                    {pct}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
