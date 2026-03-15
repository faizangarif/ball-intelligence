import { NextRequest, NextResponse } from 'next/server';
import { getTeams } from '@/lib/services/teams';
import type { League } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get('league') as League | null;

  const teams = await getTeams(league ?? undefined);
  return NextResponse.json(teams);
}
