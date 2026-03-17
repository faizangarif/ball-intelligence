'use client';

import { useEffect, useRef } from 'react';

/**
 * Silent background data refresher.
 * Only refreshes ESPN scores (free, fast, no tokens).
 * Claude-powered agents (standings, players, news) only run via daily Vercel cron.
 */
export function DataRefresher() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Only ESPN scores — zero Anthropic API tokens used
    fetch('/api/cron').catch(() => {});
  }, []);

  return null;
}
