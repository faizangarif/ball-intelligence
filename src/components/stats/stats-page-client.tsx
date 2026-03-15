'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs } from '@/components/ui/tabs';
import { StatLeaderboard } from '@/components/stats/stat-leaderboard';
import type { StatLeader } from '@/lib/types';

interface StatCategory {
  title: string;
  statLabel: string;
  leaders: StatLeader[];
}

interface StatsPageClientProps {
  nbaCategories: StatCategory[];
  nflCategories: StatCategory[];
}

const leagueTabs = [
  { label: 'NBA', value: 'NBA' },
  { label: 'NFL', value: 'NFL' },
];

export function StatsPageClient({ nbaCategories, nflCategories }: StatsPageClientProps) {
  const [activeLeague, setActiveLeague] = useState('NBA');

  const categories = activeLeague === 'NBA' ? nbaCategories : nflCategories;

  return (
    <div>
      <Tabs
        tabs={leagueTabs}
        activeTab={activeLeague}
        onChange={setActiveLeague}
        className="mb-8"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLeague}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {categories.map((cat) => (
            <StatLeaderboard
              key={cat.statLabel}
              title={cat.title}
              leaders={cat.leaders}
              statLabel={cat.statLabel}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
