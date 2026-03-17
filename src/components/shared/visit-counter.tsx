'use client';

import { useEffect, useState } from 'react';

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visits', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-20 md:bottom-2 right-3 z-40 text-[10px] text-textMuted/30 font-mono select-none pointer-events-none">
      {count.toLocaleString()} visits
    </div>
  );
}
