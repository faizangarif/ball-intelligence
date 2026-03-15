import { NextResponse } from 'next/server';
import { fetchCelticsLiveGame, fetchEaglesLiveGame, fetchTodaysNBAGames, fetchTodaysNFLGames } from '@/lib/services/web-data';

export async function GET() {
  try {
    const [celticsLive, eaglesLive, nbaGames, nflGames] = await Promise.all([
      fetchCelticsLiveGame(),
      fetchEaglesLiveGame(),
      fetchTodaysNBAGames(),
      fetchTodaysNFLGames(),
    ]);

    return NextResponse.json({
      celticsLive,
      eaglesLive,
      liveGames: [
        ...(nbaGames || []).filter(g => g.status === 'LIVE'),
        ...(nflGames || []).filter(g => g.status === 'LIVE'),
      ],
      recentGames: [
        ...(nbaGames || []).filter(g => g.status === 'FINAL'),
        ...(nflGames || []).filter(g => g.status === 'FINAL'),
      ],
      upcomingGames: [
        ...(nbaGames || []).filter(g => g.status === 'SCHEDULED'),
        ...(nflGames || []).filter(g => g.status === 'SCHEDULED'),
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
