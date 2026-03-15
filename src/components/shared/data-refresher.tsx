'use client';

import { useEffect, useRef } from 'react';

/**
 * Silent background data refresher.
 * On first visit: refreshes scores, then kicks off standings/players/news sequentially.
 * Every 6 hours: repeats the full cycle.
 */
export function DataRefresher() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function refreshAll() {
      // Fast: ESPN scores (always works)
      await fetch('/api/cron').catch(() => {});

      // Slow agents one at a time to stay under timeout
      for (const agent of ['standings', 'players', 'news']) {
        await fetch('/api/cron', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent }),
        }).catch(() => {});
      }
    }

    refreshAll();

    // Repeat every 6 hours
    const interval = setInterval(refreshAll, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
