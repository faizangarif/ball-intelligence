'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Game } from '@/lib/types';
import { cn, formatGameTime, isGameLive } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LiveIndicator } from '@/components/ui/live-indicator';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const live = isGameLive(game.status);
  const isFinal = game.status === 'FINAL';
  const isScheduled = game.status === 'SCHEDULED';
  const homeLeading = game.homeScore > game.awayScore;
  const awayLeading = game.awayScore > game.homeScore;

  return (
    <Link href={`/live/${game.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'bg-surface border rounded-xl p-5 transition-all cursor-pointer relative',
          live
            ? 'border-live/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
            : 'border-border hover:border-accent/30'
        )}
      >
        {/* Live indicator */}
        {live && (
          <div className="absolute top-3 right-3">
            <LiveIndicator />
          </div>
        )}

        {/* League badge */}
        <div className="mb-4">
          <Badge variant={game.league === 'NBA' ? 'info' : 'default'}>
            {game.league}
          </Badge>
        </div>

        {/* Matchup & Scores */}
        <div className="flex items-center justify-between mb-4">
          {/* Home */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-xl font-bold text-text">{game.homeTeam.abbreviation}</span>
            {!isScheduled && (
              <span
                className={cn(
                  'text-3xl font-black mt-1',
                  homeLeading ? 'text-accent' : 'text-text'
                )}
              >
                {game.homeScore}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center px-3">
            <span className="text-textMuted text-xs font-medium">VS</span>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-xl font-bold text-text">{game.awayTeam.abbreviation}</span>
            {!isScheduled && (
              <span
                className={cn(
                  'text-3xl font-black mt-1',
                  awayLeading ? 'text-accent' : 'text-text'
                )}
              >
                {game.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-3">
          {live && (
            <span className="text-live text-sm font-semibold">
              {formatGameTime(game.status, game.quarter, game.timeRemaining)}
            </span>
          )}
          {isFinal && (
            <span className="text-textMuted text-sm font-semibold">FINAL</span>
          )}
          {isScheduled && (
            <span className="text-textMuted text-sm">
              {new Date(game.startTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        {/* Action */}
        <div className="flex justify-center">
          {live && (
            <Button variant="live" size="sm">
              Enter Game &rarr;
            </Button>
          )}
          {isFinal && (
            <Button variant="ghost" size="sm" className="text-accent">
              Recap &rarr;
            </Button>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
