import { NextResponse } from 'next/server';
import { generateTeamAnalysis } from '@/lib/services/ai';

export async function POST(request: Request) {
  try {
    const { teamName, record, league, conference, keyPlayers } = await request.json();
    const analysis = await generateTeamAnalysis(teamName, record, league, conference, keyPlayers || []);
    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
