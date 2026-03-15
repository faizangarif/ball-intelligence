import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/services/blog';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');

  const articles = await getArticles(category ?? undefined);
  return NextResponse.json(articles);
}
