'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Carousel } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { getPlayerInitials, getStatLabel, formatStat } from '@/lib/utils';
import type { Player } from '@/lib/types';

interface TrendingPlayersProps {
  players: Player[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getKeyStatForPlayer(player: Player): { label: string; value: string } {
  if (player.league === 'NBA') {
    const ppg = player.seasonStats.ppg;
    if (ppg !== undefined) return { label: 'PPG', value: formatStat(ppg) };
  }
  if (player.league === 'NFL') {
    if (player.position === 'QB') {
      const yards = player.seasonStats.passingYards;
      if (yards !== undefined) return { label: 'PASS YDS', value: String(Math.round(yards)) };
    }
    const rush = player.seasonStats.rushingYards;
    if (rush !== undefined) return { label: 'RUSH YDS', value: String(Math.round(rush)) };
  }
  const firstKey = Object.keys(player.seasonStats)[0];
  if (firstKey) {
    return { label: getStatLabel(firstKey), value: formatStat(player.seasonStats[firstKey]) };
  }
  return { label: '-', value: '-' };
}

export function TrendingPlayers({ players }: TrendingPlayersProps) {
  if (players.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Trending Players" subtitle="Who's making noise right now" href="/players" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <Carousel>
          {players.map((player) => {
            const keyStat = getKeyStatForPlayer(player);
            return (
              <motion.div
                key={player.id}
                variants={cardVariants}
                className="snap-start"
              >
                <Link href={`/players/${player.slug}`}>
                  <div className="bg-surface rounded-xl p-4 min-w-[200px] border border-border hover:border-accent/30 transition-all hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-surfaceLight rounded-full flex items-center justify-center text-sm font-bold text-text">
                        {getPlayerInitials(player.name)}
                      </div>
                      {player.trending && (
                        <Badge variant="warning">Trending</Badge>
                      )}
                    </div>

                    <h4 className="font-semibold text-text text-sm">{player.name}</h4>
                    <p className="text-textMuted text-xs mt-0.5">
                      {player.team?.abbreviation || player.teamId.toUpperCase()}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{player.position}</Badge>
                      <Badge variant="info">{player.league}</Badge>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[10px] text-textMuted uppercase tracking-wider">{keyStat.label}</p>
                      <p className="text-xl font-black text-accent">{keyStat.value}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </Carousel>
      </motion.div>
    </section>
  );
}
