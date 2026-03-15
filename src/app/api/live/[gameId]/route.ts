import { NextRequest, NextResponse } from 'next/server';
import { getLiveGameState } from '@/lib/services/live';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const state = await getLiveGameState(gameId);

  if (!state) {
    return NextResponse.json(
      { error: 'Live game not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(state);
}
