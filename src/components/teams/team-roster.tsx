import Link from 'next/link';
import { cn, getStatLabel } from '@/lib/utils';
import type { Player } from '@/lib/types';

interface TeamRosterProps {
  players: Player[];
}

export function TeamRoster({ players }: TeamRosterProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => {
        const topStatKey = Object.keys(player.seasonStats)[0];
        const topStatValue = topStatKey ? player.seasonStats[topStatKey] : null;

        return (
          <Link
            key={player.id}
            href={`/players/${player.slug}`}
            className={cn(
              'bg-surface border border-border rounded-xl p-5 transition-all duration-300',
              'hover:border-accent/30 hover:scale-[1.01] group'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">
                  {player.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {player.number && (
                    <span className="text-xs text-textMuted font-mono">
                      #{player.number}
                    </span>
                  )}
                  <span className="text-xs text-textMuted">{player.position}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surfaceLight flex items-center justify-center">
                <span className="text-sm font-bold text-textMuted">
                  {player.firstName[0]}
                  {player.lastName[0]}
                </span>
              </div>
            </div>

            {/* Key stats */}
            <div className="flex gap-3 flex-wrap">
              {Object.entries(player.seasonStats)
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="bg-surfaceLight/50 rounded-lg px-2.5 py-1.5">
                    <span className="text-xs font-bold text-text">{value}</span>
                    <span className="text-xs text-textMuted ml-1">
                      {getStatLabel(key)}
                    </span>
                  </div>
                ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
