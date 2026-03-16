export const revalidate = 60;

import { Target } from 'lucide-react';
import type { ShotChartSummary } from '@/lib/types';
import { getPlayersWithShotData, getShotChartData, getShotChartSummary } from '@/lib/services/shots';
import { ShotIQClient } from '@/components/shots/shot-iq-client';

export const metadata = {
  title: 'SHOT IQ — BALL INTELLIGENCE',
  description: 'NBA court intelligence. See where players dominate with interactive shot charts and hot zone maps.',
};

const DEFAULT_PLAYER = 'jayson-tatum';
const DEFAULT_NAME = 'Jayson Tatum';

export default async function ShotIQPage() {
  const [players, shots, summaryOrNull] = await Promise.all([
    getPlayersWithShotData(),
    getShotChartData(DEFAULT_PLAYER),
    getShotChartSummary(DEFAULT_PLAYER, DEFAULT_NAME),
  ]);

  const summary: ShotChartSummary = summaryOrNull ?? {
    playerId: DEFAULT_PLAYER,
    playerName: DEFAULT_NAME,
    season: '2024-25',
    zones: [],
    totalShots: 0,
    totalMade: 0,
    overallPct: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-black text-gradient">SHOT IQ</h1>
        </div>
        <p className="text-textMuted text-sm mb-8">
          NBA Court Intelligence — See where players dominate
        </p>

        {/* Main client component */}
        <ShotIQClient
          players={players}
          initialShots={shots}
          initialSummary={summary}
          defaultPlayer={DEFAULT_PLAYER}
        />
      </div>
    </div>
  );
}
