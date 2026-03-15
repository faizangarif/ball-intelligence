'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LiveIndicator } from '@/components/ui/live-indicator';
import { cn } from '@/lib/utils';
import { formatGameTime } from '@/lib/utils';
import { CalendarClock } from 'lucide-react';
import type { Game } from '@/lib/types';

interface LiveGamesStripProps {
  games: Game[];
}

export function LiveGamesStrip({ games }: LiveGamesStripProps) {
  const hasGames = games.length > 0;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        {hasGames ? (
          <>
            <LiveIndicator />
            <span className="text-lg font-bold text-text">Live Now</span>
          </>
        ) : (
          <>
            <CalendarClock className="w-5 h-5 text-textMuted" />
            <span className="text-lg font-bold text-textMuted">No Live Games</span>
          </>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {hasGames ? (
          <>
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="snap-start"
              >
                <Link href={`/live/${game.id}`}>
                  <div className="bg-surface border border-live/20 rounded-xl p-4 min-w-[220px] hover:border-live/40 transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-textMuted font-medium uppercase">
                        {game.league}
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-live" />
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col items-center gap-0.5 flex-1">
                        <span className="text-sm font-bold text-text">{game.awayTeam.abbreviation}</span>
                        <span className="text-xl font-black text-text">{game.awayScore}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-textMuted uppercase font-medium">
                          {formatGameTime(game.status, game.quarter, game.timeRemaining)}
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-0.5 flex-1">
                        <span className="text-sm font-bold text-text">{game.homeTeam.abbreviation}</span>
                        <span className="text-xl font-black text-text">{game.homeScore}</span>
                      </div>
                    </div>

                    {game.venue && (
                      <p className="text-[10px] text-textMuted text-center mt-2 truncate">
                        {game.venue}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}

            <div className="snap-start flex items-center">
              <Link
                href="/live"
                className="text-sm text-accent hover:text-accent-light transition-colors whitespace-nowrap px-4 font-semibold"
              >
                View Game Center &rarr;
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm">
            <p className="text-textMuted text-sm mb-2">No live games right now</p>
            <Link
              href="/games"
              className="text-sm text-accent hover:text-accent-light transition-colors font-medium"
            >
              View upcoming games &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
