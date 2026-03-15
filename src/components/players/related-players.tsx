'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Player } from '@/lib/types';
import { cn, getPlayerInitials, formatStat } from '@/lib/utils';

interface RelatedPlayersProps {
  players: Player[];
}

export function RelatedPlayers({ players }: RelatedPlayersProps) {
  if (players.length === 0) return null;

  function getKeyStat(player: Player): string {
    const s = player.seasonStats;
    if (player.league === 'NBA') {
      return `${formatStat(s.ppg)} PPG`;
    }
    if (s.passingYards) return `${s.passingYards.toLocaleString()} PASS YDS`;
    if (s.rushingYards && s.rushingYards > 500) return `${s.rushingYards.toLocaleString()} RUSH YDS`;
    if (s.receivingYards) return `${s.receivingYards.toLocaleString()} REC YDS`;
    return '';
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {players.map((player, idx) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
        >
          <Link
            href={`/players/${player.slug}`}
            className={cn(
              'block bg-surface rounded-lg p-3 min-w-[160px]',
              'border border-border hover:border-accent/50 transition-colors'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-surfaceLight border border-border flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-text">
                  {getPlayerInitials(player.name)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text truncate">{player.name}</p>
                <p className="text-xs text-textMuted truncate">
                  {player.team?.abbreviation || player.teamId.toUpperCase()} &middot; {player.position}
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-accent">{getKeyStat(player)}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
