import { NextResponse } from 'next/server';
import { generateSmartFact } from '@/lib/services/ai';

export async function POST(request: Request) {
  try {
    const { subject, stat, context } = await request.json();
    const fact = await generateSmartFact(subject, stat, context);
    return NextResponse.json({ fact });
  } catch {
    return NextResponse.json({ error: 'Failed to generate fact' }, { status: 500 });
  }
}
