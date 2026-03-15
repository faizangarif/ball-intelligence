import { NextResponse } from 'next/server';
import { getShotChartData, getShotChartSummary, getPlayersWithShotData } from '@/lib/services/shots';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;
  const [shots, players] = await Promise.all([
    getShotChartData(playerId),
    getPlayersWithShotData(),
  ]);

  if (!shots.length) {
    return NextResponse.json({ error: 'No shot data found' }, { status: 404 });
  }

  const player = players.find((p) => p.slug === playerId);
  const summary = await getShotChartSummary(playerId, player?.name ?? playerId);

  if (!summary) {
    return NextResponse.json({ error: 'No summary available' }, { status: 404 });
  }

  return NextResponse.json({ shots, summary });
}
