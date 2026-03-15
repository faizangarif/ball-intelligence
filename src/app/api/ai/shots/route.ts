import { NextResponse } from 'next/server';
import { generateShotAnalysis } from '@/lib/services/ai';

export async function POST(request: Request) {
  try {
    const { playerName, zones } = await request.json();
    const analysis = await generateShotAnalysis(playerName, zones);
    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
