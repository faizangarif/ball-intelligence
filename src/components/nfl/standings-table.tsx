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
  { label: 'AFC', value: 'AFC' },
  { label: 'NFC', value: 'NFC' },
];

export function NFLStandingsTable({ teams }: StandingsTableProps) {
  const [conference, setConference] = useState('NFC');

  const filtered = teams
    .filter((t) => t.conference === conference)
    .sort((a, b) => {
      const totalA = a.wins + a.losses + (a.ties || 0);
      const totalB = b.wins + b.losses + (b.ties || 0);
      const pctA = totalA > 0 ? a.wins / totalA : 0;
      const pctB = totalB > 0 ? b.wins / totalB : 0;
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
              <th className="px-3 py-2.5 text-center font-semibold w-12">T</th>
              <th className="px-3 py-2.5 text-center font-semibold w-16">PCT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((team, index) => {
              const isEagles = team.slug === 'philadelphia-eagles';
              const total = team.wins + team.losses + (team.ties || 0);
              const pct = total > 0 ? (team.wins / total).toFixed(3) : '.000';

              return (
                <tr
                  key={team.id}
                  className={cn(
                    'border-b border-border/50 transition-colors',
                    'hover:bg-surfaceLight/50',
                    isEagles && 'bg-accent/5',
                    index % 2 === 0 ? 'bg-surface' : 'bg-surface/50'
                  )}
                >
                  <td className="px-3 py-2.5 text-sm text-textMuted font-mono">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/teams/nfl/${team.slug}`}
                      className="flex items-center gap-2 group"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: team.primaryColor }}
                      />
                      <span
                        className={cn(
                          'text-sm font-medium text-text group-hover:text-accent transition-colors',
                          isEagles && 'font-bold'
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
                  <td className="px-3 py-2.5 text-center text-sm text-textMuted">
                    {team.ties ?? 0}
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
