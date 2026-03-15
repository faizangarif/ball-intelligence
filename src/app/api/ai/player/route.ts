import { NextResponse } from 'next/server';
import { generatePlayerAnalysis } from '@/lib/services/ai';

export async function POST(request: Request) {
  try {
    const { playerName, team, position, league, stats } = await request.json();
    const analysis = await generatePlayerAnalysis(playerName, team, position, league, stats);
    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
