import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

// Ensure cache directory exists
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCached<T>(key: string): T | null {
  ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) return null; // expired
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl: ttlMs };
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
}

export function invalidateCache(key: string): void {
  ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function invalidateAll(): void {
  ensureCacheDir();
  const files = fs.readdirSync(CACHE_DIR);
  for (const file of files) {
    if (file.endsWith('.json')) {
      fs.unlinkSync(path.join(CACHE_DIR, file));
    }
  }
}

export const SIX_HOURS = 6 * 60 * 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;
export const FIVE_MINUTES = 5 * 60 * 1000;
export const ONE_MINUTE = 60 * 1000;
