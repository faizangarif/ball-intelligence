import { NextRequest, NextResponse } from 'next/server';
import { getPlayers } from '@/lib/services/players';
import type { League } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get('league') as League | null;
  const teamId = searchParams.get('teamId');
  const featured = searchParams.get('featured');
  const trending = searchParams.get('trending');

  const players = await getPlayers({
    league: league ?? undefined,
    teamId: teamId ?? undefined,
    featured: featured === 'true' ? true : undefined,
    trending: trending === 'true' ? true : undefined,
  });

  return NextResponse.json(players);
}
