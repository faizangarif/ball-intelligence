import { NextRequest, NextResponse } from 'next/server';
import { getLiveGames } from '@/lib/services/games';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get('league');

  let games = await getLiveGames();

  if (league) {
    games = games.filter((g) => g.league === league);
  }

  return NextResponse.json(games);
}
