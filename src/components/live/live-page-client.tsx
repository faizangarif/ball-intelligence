'use client';

import { useState, useCallback } from 'react';
import type { Game } from '@/lib/types';
import { Tabs } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyState } from '@/components/ui/empty-state';
import { GameCard } from '@/components/live/game-card';
import { GameCountdown } from '@/components/live/game-countdown';
import { LiveScoresPoller } from '@/components/live/live-scores-poller';
import { Radio } from 'lucide-react';

interface LivePageClientProps {
  liveGames: Game[];
  recentGames: Game[];
  upcomingGames: Game[];
}

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'NBA', value: 'NBA' },
  { label: 'NFL', value: 'NFL' },
];

function filterByLeague(games: Game[], league: string): Game[] {
  if (league === 'all') return games;
  return games.filter((g) => g.league === league);
}

export function LivePageClient({ liveGames: initialLive, recentGames: initialRecent, upcomingGames: initialUpcoming }: LivePageClientProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [liveGames, setLiveGames] = useState(initialLive);
  const [recentGames, setRecentGames] = useState(initialRecent);
  const [upcomingGames, setUpcomingGames] = useState(initialUpcoming);

  const handleUpdate = useCallback((data: { games: Game[]; live: Game[]; final: Game[]; scheduled: Game[] }) => {
    if (data.live) setLiveGames(data.live);
    if (data.final) setRecentGames(data.final);
    if (data.scheduled) setUpcomingGames(data.scheduled);
  }, []);

  const filteredLive = filterByLeague(liveGames, activeTab);
  const filteredRecent = filterByLeague(recentGames, activeTab);
  const filteredUpcoming = filterByLeague(upcomingGames, activeTab);

  const soonestUpcoming = filteredUpcoming.length > 0 ? filteredUpcoming[0] : null;

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Tabs tabs={filterTabs} activeTab={activeTab} onChange={setActiveTab} />
        <LiveScoresPoller onUpdate={handleUpdate} defaultInterval={10} />
      </div>

      {/* Live Now */}
      <section className="mb-12">
        <SectionHeader title="Live Now" subtitle="Games currently in progress" />
        {filteredLive.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLive.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Radio className="w-10 h-10" />}
            title="No Live Games"
            description="No live games right now — check back during game time!"
          />
        )}
      </section>

      {/* Coming Up */}
      {filteredUpcoming.length > 0 && (
        <section className="mb-12">
          <SectionHeader title="Coming Up" subtitle="Next on the schedule" />
          {soonestUpcoming && (
            <div className="mb-6">
              <GameCountdown game={soonestUpcoming} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUpcoming.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Completed */}
      {filteredRecent.length > 0 && (
        <section className="mb-12">
          <SectionHeader title="Recently Completed" subtitle="Final scores and recaps" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecent.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
