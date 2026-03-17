import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const VISITS_FILE = process.env.VERCEL
  ? '/tmp/ball-intel-visits.json'
  : path.join(process.cwd(), '.cache', 'visits.json');

function getCount(): number {
  try {
    if (fs.existsSync(VISITS_FILE)) {
      const data = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf-8'));
      return data.count || 0;
    }
  } catch {}
  return 0;
}

function setCount(count: number): void {
  try {
    const dir = path.dirname(VISITS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ count }));
  } catch {}
}

// GET: return current count
export async function GET() {
  return NextResponse.json({ count: getCount() });
}

// POST: increment and return new count
export async function POST() {
  const count = getCount() + 1;
  setCount(count);
  return NextResponse.json({ count });
}
