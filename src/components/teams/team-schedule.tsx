'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, formatDate, formatGameTime, isGameLive } from '@/lib/utils';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LiveIndicator } from '@/components/ui/live-indicator';
import type { Game } from '@/lib/types';

interface TeamScheduleProps {
  games: Game[];
  teamId: string;
}

const tabs = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Recent Results', value: 'recent' },
];

export function TeamSchedule({ games, teamId }: TeamScheduleProps) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcoming = games.filter(
    (g) => g.status === 'SCHEDULED' || g.status === 'LIVE'
  );
  const recent = games.filter(
    (g) => g.status === 'FINAL'
  );

  const displayed = activeTab === 'upcoming' ? upcoming : recent;

  function getOpponent(game: Game) {
    const isHome = game.homeTeam.id === teamId;
    return {
      team: isHome ? game.awayTeam : game.homeTeam,
      isHome,
    };
  }

  function getResult(game: Game) {
    const isHome = game.homeTeam.id === teamId;
    const teamScore = isHome ? game.homeScore : game.awayScore;
    const oppScore = isHome ? game.awayScore : game.homeScore;
    const won = teamScore > oppScore;
    return { teamScore, oppScore, won };
  }

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {displayed.length === 0 ? (
        <p className="text-textMuted text-sm py-6 text-center">
          No {activeTab === 'upcoming' ? 'upcoming' : 'recent'} games to display.
        </p>
      ) : (
        <div className="space-y-2">
          {displayed.map((game) => {
            const { team: opponent, isHome } = getOpponent(game);
            const live = isGameLive(game.status);

            return (
              <div
                key={game.id}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                  'bg-surface border border-border',
                  live && 'border-live/30',
                  'hover:bg-surfaceLight/30'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: opponent.primaryColor }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text truncate">
                        {isHome ? 'vs' : '@'} {opponent.name}
                      </span>
                      {live && <LiveIndicator />}
                    </div>
                    <span className="text-xs text-textMuted">
                      {formatDate(game.startTime)}
                      {game.venue && ` \u2022 ${game.venue}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {game.status === 'FINAL' && (() => {
                    const { teamScore, oppScore, won } = getResult(game);
                    return (
                      <>
                        <span className="text-sm font-bold text-text">
                          {teamScore}-{oppScore}
                        </span>
                        <Badge variant={won ? 'success' : 'default'}>
                          {won ? 'W' : 'L'}
                        </Badge>
                      </>
                    );
                  })()}

                  {game.status === 'LIVE' && (() => {
                    const { teamScore, oppScore } = getResult(game);
                    return (
                      <span className="text-sm font-bold text-live">
                        {teamScore}-{oppScore}
                      </span>
                    );
                  })()}

                  {game.status === 'SCHEDULED' && (
                    <Badge variant="info">
                      {new Date(game.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Badge>
                  )}

                  {live && (
                    <Link
                      href={`/live/${game.id}`}
                      className="text-xs text-accent hover:text-accent-light transition-colors"
                    >
                      Watch &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
