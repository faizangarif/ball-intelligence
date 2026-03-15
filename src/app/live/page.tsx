export const dynamic = 'force-dynamic';

import { getLiveGames, getRecentGames, getUpcomingGames } from '@/lib/services/games';
import { LiveIndicator } from '@/components/ui/live-indicator';
import { LivePageClient } from '@/components/live/live-page-client';

export const metadata = {
  title: 'Live Game Center | BALL INTELLIGENCE',
  description: 'Real-time scores, play-by-play, and AI analysis for NBA and NFL games.',
};

export default async function LivePage() {
  const [liveGames, recentGames, upcomingGames] = await Promise.all([
    getLiveGames(),
    getRecentGames(),
    getUpcomingGames(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Premium Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-text tracking-tight">
              LIVE GAME CENTER
            </h1>
            <LiveIndicator className="mt-1" />
          </div>
          <p className="text-textMuted text-lg">
            Real-time scores, play-by-play, and AI analysis
          </p>
        </div>

        <LivePageClient
          liveGames={liveGames}
          recentGames={recentGames.slice(0, 6)}
          upcomingGames={upcomingGames.slice(0, 6)}
        />
      </div>
    </main>
  );
}
