'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/lib/types';
import { cn, getPlayerInitials } from '@/lib/utils';

const teamColors: Record<string, string> = {
  bos: '#007A33',
  lal: '#552583',
  gsw: '#1D428A',
  dal: '#00538C',
  den: '#0E2240',
  mil: '#00471B',
  okc: '#007AC1',
  phx: '#1D1160',
  min: '#0C2340',
  'phi-eagles': '#004C54',
  'kc-chiefs': '#E31837',
  'buf-bills': '#00338D',
  'bal-ravens': '#241773',
  'dal-cowboys': '#003594',
  'mia-dolphins': '#008E97',
};

const teamNames: Record<string, string> = {
  bos: 'Boston Celtics',
  lal: 'Los Angeles Lakers',
  gsw: 'Golden State Warriors',
  dal: 'Dallas Mavericks',
  den: 'Denver Nuggets',
  mil: 'Milwaukee Bucks',
  okc: 'Oklahoma City Thunder',
  phx: 'Phoenix Suns',
  min: 'Minnesota Timberwolves',
  'phi-eagles': 'Philadelphia Eagles',
  'kc-chiefs': 'Kansas City Chiefs',
  'buf-bills': 'Buffalo Bills',
  'bal-ravens': 'Baltimore Ravens',
  'dal-cowboys': 'Dallas Cowboys',
  'mia-dolphins': 'Miami Dolphins',
};

interface PlayerHeroProps {
  player: Player;
}

export function PlayerHero({ player }: PlayerHeroProps) {
  const teamColor = teamColors[player.teamId] || '#6366f1';
  const teamName = teamNames[player.teamId] || player.teamId;
  const initials = getPlayerInitials(player.name);
  const isCeltics = player.teamId === 'bos';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-surface border border-border p-6 md:p-10"
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background: `radial-gradient(ellipse at top right, ${teamColor}, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-24 h-24 rounded-full bg-surfaceLight border-2 flex items-center justify-center shrink-0"
          style={{ borderColor: teamColor }}
        >
          <span className="text-3xl font-black text-text">{initials}</span>
        </motion.div>

        <div className="text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-4xl font-black text-text"
          >
            {player.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={cn(
              'text-lg font-semibold mt-1',
              isCeltics ? 'text-accent' : 'text-textMuted'
            )}
          >
            {teamName}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-2 mt-3"
          >
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-surfaceLight text-text rounded-full border border-border">
              {player.position}
            </span>
            {player.number && (
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-surfaceLight text-textMuted rounded-full border border-border">
                #{player.number}
              </span>
            )}
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-surfaceLight text-textMuted rounded-full border border-border">
              {player.league}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
