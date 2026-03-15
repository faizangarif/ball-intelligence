'use client';

import { useEffect, useRef } from 'react';

/**
 * Silent background data refresher.
 * Hits /api/cron periodically to keep server-side caches fresh.
 * Runs every 6 hours for full data, and checks scores more frequently.
 */
export function DataRefresher() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // On first page load, trigger a background data check
    fetch('/api/cron').catch(() => {});

    // Set up periodic full refresh every 6 hours
    const fullRefreshInterval = setInterval(
      () => {
        fetch('/api/cron', { method: 'POST' }).catch(() => {});
      },
      6 * 60 * 60 * 1000
    );

    return () => clearInterval(fullRefreshInterval);
  }, []);

  // Invisible component
  return null;
}
