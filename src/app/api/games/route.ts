import { NextRequest, NextResponse } from 'next/server';
import { getGames } from '@/lib/services/games';
import type { GameStatus, League } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get('league') as League | null;
  const status = searchParams.get('status') as GameStatus | null;
  const featured = searchParams.get('featured');

  const games = await getGames({
    league: league ?? undefined,
    status: status ?? undefined,
    featured: featured === 'true' ? true : undefined,
  });

  return NextResponse.json(games);
}
