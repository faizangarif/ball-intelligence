'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { Game, LiveGameState } from '@/lib/types';
import { LiveScoreboard } from '@/components/live/live-scoreboard';
import { EventTimeline } from '@/components/live/event-timeline';
import { AIScorecastPanel } from '@/components/live/ai-scorecast-panel';
import { MomentumChart } from '@/components/live/momentum-chart';
import { GameStatsComparison } from '@/components/live/game-stats-comparison';
import { BoxScore } from '@/components/live/box-score';
import { LiveScoresPoller } from '@/components/live/live-scores-poller';
import { ArrowLeft } from 'lucide-react';

interface LiveGameDetailProps {
  initialState: LiveGameState;
}

export function LiveGameDetail({ initialState }: LiveGameDetailProps) {
  const [game, setGame] = useState(initialState.game);
  const { events, momentum, aiCommentary, summary } = initialState;

  const handleUpdate = useCallback(
    (data: { games: Game[] }) => {
      // Find this game in the updated scores
      const updated = data.games?.find(
        (g) =>
          g.id === game.id ||
          // Match by team abbreviations if IDs differ
          (g.homeTeam.abbreviation === game.homeTeam.abbreviation &&
            g.awayTeam.abbreviation === game.awayTeam.abbreviation)
      );
      if (updated) {
        setGame(updated);
      }
    },
    [game.id, game.homeTeam.abbreviation, game.awayTeam.abbreviation]
  );

  return (
    <div className="space-y-8">
      {/* Back nav + refresh controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/live"
          className="inline-flex items-center gap-2 text-textMuted hover:text-accent transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Game Center
        </Link>
        {game.status === 'LIVE' && (
          <LiveScoresPoller onUpdate={handleUpdate} defaultInterval={10} />
        )}
      </div>

      {/* Scoreboard — now updates live */}
      <LiveScoreboard game={game} />

      {/* Timeline + AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventTimeline events={events} />
        <AIScorecastPanel commentary={aiCommentary} summary={summary} />
      </div>

      {/* Momentum */}
      <MomentumChart
        momentum={momentum}
        homeTeam={game.homeTeam.name}
        awayTeam={game.awayTeam.name}
      />

      {/* Stats Comparison */}
      <GameStatsComparison game={game} />

      {/* Box Score */}
      <BoxScore game={game} />
    </div>
  );
}
