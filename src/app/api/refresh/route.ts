import { NextResponse } from 'next/server';
import { refreshAllData } from '@/lib/services/web-data';
import { invalidateAll } from '@/lib/services/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.invalidate) {
      invalidateAll();
    }
    const result = await refreshAllData();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await refreshAllData();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
