'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { StatLeader } from '@/lib/types';

interface StatLeaderboardProps {
  title: string;
  leaders: StatLeader[];
  statLabel: string;
}

function getRankColor(rank: number): string {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-textMuted';
}

export function StatLeaderboard({ title, leaders, statLabel }: StatLeaderboardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-surfaceLight">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text">{title}</h3>
      </div>

      <div className="divide-y divide-border/50">
        {leaders.map((leader) => (
          <div
            key={`${leader.playerSlug}-${leader.rank}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-surfaceLight/30 transition-colors"
          >
            <span
              className={cn(
                'w-6 text-sm font-bold text-right shrink-0',
                getRankColor(leader.rank)
              )}
            >
              {leader.rank}
            </span>

            <div className="flex-1 min-w-0">
              <Link
                href={`/players/${leader.playerSlug}`}
                className="text-sm font-medium text-text hover:text-accent transition-colors truncate block"
              >
                {leader.playerName}
              </Link>
              <span className="text-xs text-textMuted">{leader.team}</span>
            </div>

            <span className="text-sm font-bold text-text shrink-0">
              {typeof leader.value === 'number' && leader.value >= 100
                ? leader.value.toLocaleString()
                : leader.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
