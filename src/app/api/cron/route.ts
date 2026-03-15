import { NextResponse } from 'next/server';
import { runAllAgents } from '@/lib/services/agents';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Cron job handler — called by Vercel Cron or manually
export async function GET(request: Request) {
  // Verify cron secret if set (security for production)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runAllAgents(false);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Force full refresh (manual trigger)
export async function POST(request: Request) {
  try {
    const result = await runAllAgents(true);
    return NextResponse.json({
      success: true,
      forced: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
