import { NextResponse } from 'next/server';
import { generateGameRecap } from '@/lib/services/ai';

export async function POST(request: Request) {
  try {
    const { homeTeam, awayTeam, homeScore, awayScore, league, events } = await request.json();
    const recap = await generateGameRecap(homeTeam, awayTeam, homeScore, awayScore, league, events || []);
    return NextResponse.json({ recap });
  } catch {
    return NextResponse.json({ error: 'Failed to generate recap' }, { status: 500 });
  }
}
