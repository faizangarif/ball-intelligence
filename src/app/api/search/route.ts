import { NextRequest, NextResponse } from 'next/server';
import { searchAll } from '@/lib/services/search';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q') ?? '';

  if (!query.trim()) {
    return NextResponse.json({
      teams: [],
      players: [],
      articles: [],
      total: 0,
    });
  }

  const results = await searchAll(query);
  return NextResponse.json(results);
}
