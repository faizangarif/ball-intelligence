'use client';

import { motion } from 'framer-motion';
import type { Game } from '@/lib/types';
import { cn, formatGameTime, isGameLive } from '@/lib/utils';
import { LiveIndicator } from '@/components/ui/live-indicator';

interface LiveScoreboardProps {
  game: Game;
}

export function LiveScoreboard({ game }: LiveScoreboardProps) {
  const live = isGameLive(game.status);
  const homeLeading = game.homeScore > game.awayScore;
  const awayLeading = game.awayScore > game.homeScore;

  return (
    <div
      className="relative bg-surface rounded-2xl p-6 md:p-8 border border-border overflow-hidden"
    >
      {/* Gradient accents */}
      <div
        className="absolute top-0 left-0 w-1/3 h-full opacity-[0.04] rounded-l-2xl"
        style={{ background: `linear-gradient(to right, ${game.homeTeam.primaryColor}, transparent)` }}
      />
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-[0.04] rounded-r-2xl"
        style={{ background: `linear-gradient(to left, ${game.awayTeam.primaryColor}, transparent)` }}
      />

      {/* Live badge */}
      {live && (
        <div className="flex justify-center mb-4">
          <LiveIndicator />
        </div>
      )}

      <div className="relative flex items-center justify-between">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-text">{game.homeTeam.abbreviation}</p>
          <p className="text-sm text-textMuted mb-3">{game.homeTeam.name}</p>
          <motion.p
            key={game.homeScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={cn(
              'text-5xl md:text-6xl font-black',
              homeLeading ? 'text-accent' : 'text-text'
            )}
          >
            {game.homeScore}
          </motion.p>
          <p className="text-xs text-textMuted mt-2">{game.homeTeam.record}</p>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center px-4 md:px-8 min-w-[100px]">
          {live ? (
            <>
              <span className="text-live text-sm font-bold mb-1">
                {formatGameTime(game.status, game.quarter, game.timeRemaining)}
              </span>
              {game.possession && (
                <span className="text-accent text-lg">
                  {game.possession === 'home' ? '\u25C0' : '\u25B6'}
                </span>
              )}
            </>
          ) : game.status === 'FINAL' ? (
            <span className="text-textMuted text-lg font-bold">FINAL</span>
          ) : (
            <span className="text-textMuted text-sm font-medium">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-text">{game.awayTeam.abbreviation}</p>
          <p className="text-sm text-textMuted mb-3">{game.awayTeam.name}</p>
          <motion.p
            key={game.awayScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={cn(
              'text-5xl md:text-6xl font-black',
              awayLeading ? 'text-accent' : 'text-text'
            )}
          >
            {game.awayScore}
          </motion.p>
          <p className="text-xs text-textMuted mt-2">{game.awayTeam.record}</p>
        </div>
      </div>

      {/* Venue / Broadcast */}
      <div className="relative flex justify-center gap-4 mt-6 text-xs text-textMuted">
        {game.venue && <span>{game.venue}</span>}
        {game.broadcast && (
          <>
            <span className="text-border">|</span>
            <span>{game.broadcast}</span>
          </>
        )}
      </div>
    </div>
  );
}
