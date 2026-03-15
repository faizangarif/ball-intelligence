import type { ShotEntry, ShotChartSummary } from '@/lib/types';
import { mockShotData } from '@/lib/data/mock/shots';
import { mockPlayers } from '@/lib/data/mock/players';

export async function getShotChartData(playerSlug: string): Promise<ShotEntry[]> {
  return mockShotData[playerSlug] ?? [];
}

export async function getShotChartSummary(
  playerSlug: string,
  playerName: string,
): Promise<ShotChartSummary | null> {
  const shots = mockShotData[playerSlug];
  if (!shots || shots.length === 0) return null;

  const zoneMap = new Map<
    string,
    { attempts: number; makes: number; totalX: number; totalY: number }
  >();

  for (const shot of shots) {
    const existing = zoneMap.get(shot.zone);
    if (existing) {
      existing.attempts++;
      if (shot.made) existing.makes++;
      existing.totalX += shot.x;
      existing.totalY += shot.y;
    } else {
      zoneMap.set(shot.zone, {
        attempts: 1,
        makes: shot.made ? 1 : 0,
        totalX: shot.x,
        totalY: shot.y,
      });
    }
  }

  const zones = Array.from(zoneMap.entries()).map(([name, data]) => ({
    name,
    attempts: data.attempts,
    makes: data.makes,
    percentage: data.attempts > 0 ? Math.round((data.makes / data.attempts) * 1000) / 10 : 0,
    avgX: data.attempts > 0 ? Math.round(data.totalX / data.attempts) : 0,
    avgY: data.attempts > 0 ? Math.round(data.totalY / data.attempts) : 0,
  }));

  const totalShots = shots.length;
  const totalMade = shots.filter((s) => s.made).length;
  const overallPct = totalShots > 0 ? Math.round((totalMade / totalShots) * 1000) / 10 : 0;

  return {
    playerId: playerSlug,
    playerName,
    season: '2024-25',
    zones,
    totalShots,
    totalMade,
    overallPct,
  };
}

export async function getPlayersWithShotData(): Promise<{ slug: string; name: string }[]> {
  const slugs = Object.keys(mockShotData);

  return slugs.map((slug) => {
    const player = mockPlayers.find((p) => p.slug === slug);
    return {
      slug,
      name: player?.name ?? slug,
    };
  });
}

export async function getHotZones(
  playerSlug: string,
): Promise<{ name: string; attempts: number; makes: number; percentage: number }[]> {
  const summary = await getShotChartSummary(playerSlug, '');
  if (!summary) return [];

  return summary.zones.filter((z) => z.percentage > 45);
}

export async function getColdZones(
  playerSlug: string,
): Promise<{ name: string; attempts: number; makes: number; percentage: number }[]> {
  const summary = await getShotChartSummary(playerSlug, '');
  if (!summary) return [];

  return summary.zones.filter((z) => z.percentage < 35);
}
