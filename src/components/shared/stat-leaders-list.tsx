import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { StatLeader } from '@/lib/types';

interface StatLeadersListProps {
  title: string;
  leaders: StatLeader[];
  statLabel: string;
}

const rankColors: Record<number, string> = {
  1: 'text-gold',
  2: 'text-silver',
  3: 'text-bronze',
};

export function StatLeadersList({ title, leaders, statLabel }: StatLeadersListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {leaders.map((leader) => (
          <Link
            key={leader.playerSlug}
            href={`/players/${leader.playerSlug}`}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              'hover:bg-surfaceLight/50 group'
            )}
          >
            <span
              className={cn(
                'w-6 text-center text-sm font-bold',
                rankColors[leader.rank] || 'text-textMuted'
              )}
            >
              {leader.rank}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-text group-hover:text-accent transition-colors truncate block">
                {leader.playerName}
              </span>
              <span className="text-xs text-textMuted">{leader.team}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-text">{leader.value}</span>
              <span className="text-xs text-textMuted ml-1">{statLabel}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
