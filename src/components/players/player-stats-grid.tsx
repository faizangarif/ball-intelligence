'use client';

import { motion } from 'framer-motion';
import type { League } from '@/lib/types';
import { cn, getStatLabel, formatStat } from '@/lib/utils';

interface PlayerStatsGridProps {
  stats: Record<string, number>;
  league: League;
}

const pctStats = new Set(['fgPct', 'threePct', 'ftPct', 'completionPct']);

const nbaStatOrder = ['ppg', 'rpg', 'apg', 'spg', 'bpg', 'fgPct', 'threePct', 'ftPct'];
const nflQBStatOrder = ['passingYards', 'passingTDs', 'completionPct', 'rushingYards', 'rushingTDs', 'gamesPlayed'];
const nflWRStatOrder = ['receptions', 'receivingYards', 'receivingTDs', 'targets', 'gamesPlayed'];
const nflRBStatOrder = ['rushingYards', 'rushingTDs', 'receptions', 'receivingYards', 'receivingTDs', 'gamesPlayed'];
const nflTEStatOrder = ['receptions', 'receivingYards', 'receivingTDs', 'targets', 'gamesPlayed'];

function getStatOrder(stats: Record<string, number>, league: League): string[] {
  if (league === 'NBA') return nbaStatOrder;
  if ('passingYards' in stats) return nflQBStatOrder;
  if ('rushingYards' in stats && !('receptions' in stats && stats.receptions > 40)) return nflRBStatOrder;
  if ('receivingYards' in stats && 'targets' in stats) return nflWRStatOrder;
  return nflTEStatOrder;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function PlayerStatsGrid({ stats, league }: PlayerStatsGridProps) {
  const statOrder = getStatOrder(stats, league);
  const displayStats = statOrder.filter((key) => key in stats);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {displayStats.map((key) => {
        const value = stats[key];
        const isPct = pctStats.has(key);
        const isWholeNumber = Number.isInteger(value) && !isPct;

        return (
          <motion.div
            key={key}
            variants={item}
            className={cn(
              'bg-surface border border-border rounded-xl p-4',
              'flex flex-col items-center justify-center text-center'
            )}
          >
            <span className="text-2xl font-black text-text">
              {isWholeNumber ? value.toLocaleString() : formatStat(value)}
              {isPct ? '%' : ''}
            </span>
            <span className="text-xs uppercase text-textMuted tracking-wider mt-1">
              {getStatLabel(key)}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
