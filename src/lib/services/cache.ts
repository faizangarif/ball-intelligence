import fs from 'fs';
import path from 'path';

// Use /tmp on Vercel (serverless), .cache locally
const CACHE_DIR = process.env.VERCEL ? '/tmp/ball-intel-cache' : path.join(process.cwd(), '.cache');

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// In-memory fallback for when filesystem isn't available
const memoryCache = new Map<string, CacheEntry<unknown>>();

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch {
    // Filesystem not available, use memory cache
  }
}

export function getCached<T>(key: string): T | null {
  // Try memory cache first
  const memEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl) {
    return memEntry.data;
  }

  // Try file cache
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) return null;
    // Populate memory cache
    memoryCache.set(key, entry);
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl: ttlMs };

  // Always set memory cache
  memoryCache.set(key, entry as CacheEntry<unknown>);

  // Try file cache
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry));
  } catch {
    // File cache failed, memory cache is still set
  }
}

export function invalidateCache(key: string): void {
  memoryCache.delete(key);
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // ignore
  }
}

export function invalidateAll(): void {
  memoryCache.clear();
  try {
    ensureCacheDir();
    const files = fs.readdirSync(CACHE_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    }
  } catch {
    // ignore
  }
}

export const SIX_HOURS = 6 * 60 * 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;
export const FIVE_MINUTES = 5 * 60 * 1000;
export const ONE_MINUTE = 60 * 1000;
