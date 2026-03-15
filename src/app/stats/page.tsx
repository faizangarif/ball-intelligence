export const dynamic = 'force-dynamic';

import { getNBALeaders, getNFLLeaders } from '@/lib/services/stats';
import { getStatLabel } from '@/lib/utils';
import { StatsPageClient } from '@/components/stats/stats-page-client';

export const metadata = {
  title: 'Stats Central | BALL INTELLIGENCE',
  description: 'NBA and NFL stat leaders and leaderboards.',
};

export default async function StatsPage() {
  const nbaStats = ['ppg', 'rpg', 'apg', 'spg', 'bpg'] as const;
  const nflStats = ['passingYards', 'rushingYards', 'receivingYards', 'passingTDs'] as const;

  const [nbaResults, nflResults] = await Promise.all([
    Promise.all(nbaStats.map((stat) => getNBALeaders(stat, 10))),
    Promise.all(nflStats.map((stat) => getNFLLeaders(stat, 10))),
  ]);

  const nbaCategories = nbaStats.map((stat, idx) => ({
    title: getStatLabel(stat),
    statLabel: stat,
    leaders: nbaResults[idx],
  }));

  const nflCategories = nflStats.map((stat, idx) => ({
    title: getStatLabel(stat),
    statLabel: stat,
    leaders: nflResults[idx],
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black text-text mb-2">STATS CENTRAL</h1>
        <p className="text-textMuted mb-8">
          League leaders across the NBA and NFL.
        </p>

        <StatsPageClient
          nbaCategories={nbaCategories}
          nflCategories={nflCategories}
        />
      </div>
    </main>
  );
}
