import { NextResponse } from 'next/server';
import { fetchAllLiveScores, fetchESPNScoreboard } from '@/lib/services/espn';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get('league')?.toUpperCase();

  try {
    if (league === 'NBA' || league === 'NFL') {
      const games = await fetchESPNScoreboard(league as 'NBA' | 'NFL');
      return NextResponse.json({
        games,
        live: games.filter((g) => g.status === 'LIVE'),
        final: games.filter((g) => g.status === 'FINAL'),
        scheduled: games.filter((g) => g.status === 'SCHEDULED'),
        timestamp: new Date().toISOString(),
      });
    }

    const data = await fetchAllLiveScores();
    return NextResponse.json({
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ games: [], live: [], final: [], scheduled: [], timestamp: new Date().toISOString() });
  }
}
