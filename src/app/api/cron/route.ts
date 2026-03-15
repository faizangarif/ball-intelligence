import { NextResponse } from 'next/server';
import { runScoreKeeper, runLiveMonitor } from '@/lib/services/agents';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Fast cron: ESPN scores + live monitor only (completes in <5s)
export async function GET() {
  try {
    const [scores, liveMonitor] = await Promise.all([
      runScoreKeeper(),
      runLiveMonitor(),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      scores,
      liveMonitor,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// POST: Trigger one specific agent at a time
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ agent: 'scores' }));
    const agent = body.agent || 'scores';

    let result;

    switch (agent) {
      case 'scores':
        result = await runScoreKeeper();
        break;
      case 'standings': {
        const { runStandingsAgent } = await import('@/lib/services/agents');
        result = await runStandingsAgent();
        break;
      }
      case 'players': {
        const { runPlayerStatsAgent } = await import('@/lib/services/agents');
        result = await runPlayerStatsAgent();
        break;
      }
      case 'news': {
        const { runNewsAgent } = await import('@/lib/services/agents');
        result = await runNewsAgent();
        break;
      }
      case 'monitor':
        result = await runLiveMonitor();
        break;
      default:
        result = await runScoreKeeper();
    }

    return NextResponse.json({
      success: true,
      agent,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
