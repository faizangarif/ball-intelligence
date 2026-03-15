'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Flame, GitCompareArrows } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShotEntry, ShotChartSummary } from '@/lib/types';
import { BasketballCourt } from './basketball-court';
import { ShotDots } from './shot-dots';
import { HotZones } from './hot-zones';
import { ShotStatsPanel } from './shot-stats-panel';
import { PlayerSelector } from './player-selector';
import { ComparisonView } from './comparison-view';

type ViewMode = 'chart' | 'zones' | 'compare';

interface ShotIQClientProps {
  players: { slug: string; name: string }[];
  initialShots: ShotEntry[];
  initialSummary: ShotChartSummary;
  defaultPlayer: string;
}

const viewTabs: { id: ViewMode; label: string; icon: typeof Eye }[] = [
  { id: 'chart', label: 'Shot Chart', icon: Eye },
  { id: 'zones', label: 'Hot Zones', icon: Flame },
  { id: 'compare', label: 'Compare', icon: GitCompareArrows },
];

export function ShotIQClient({
  players,
  initialShots,
  initialSummary,
  defaultPlayer,
}: ShotIQClientProps) {
  const [selectedPlayer, setSelectedPlayer] = useState(defaultPlayer);
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [shots, setShots] = useState<ShotEntry[]>(initialShots);
  const [summary, setSummary] = useState<ShotChartSummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [showMade, setShowMade] = useState(true);
  const [showMissed, setShowMissed] = useState(true);

  const handlePlayerChange = useCallback(
    async (slug: string) => {
      setSelectedPlayer(slug);
      if (slug === defaultPlayer) {
        setShots(initialShots);
        setSummary(initialSummary);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/shots/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setShots(data.shots);
        setSummary(data.summary);
      } catch {
        setShots([]);
      } finally {
        setLoading(false);
      }
    },
    [defaultPlayer, initialShots, initialSummary],
  );

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Player selector */}
        {viewMode !== 'compare' && (
          <PlayerSelector
            players={players}
            selected={selectedPlayer}
            onSelect={handlePlayerChange}
            className="w-full sm:w-64"
          />
        )}

        {/* View mode tabs */}
        <div className="flex bg-surfaceLight rounded-lg p-1 border border-border">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            const active = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  active
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'text-textMuted hover:text-text',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Shot filter toggles (chart mode only) */}
        {viewMode === 'chart' && (
          <div className="flex items-center gap-3 ml-auto">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showMade}
                onChange={(e) => setShowMade(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-3 h-3 rounded-full bg-accent peer-checked:opacity-100 opacity-30 transition-opacity" />
              <span className="text-xs text-textMuted">Made</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showMissed}
                onChange={(e) => setShowMissed(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-3 h-3 rounded-full bg-live peer-checked:opacity-100 opacity-30 transition-opacity" />
              <span className="text-xs text-textMuted">Missed</span>
            </label>
          </div>
        )}
      </div>

      {/* Compare view */}
      {viewMode === 'compare' ? (
        <ComparisonView players={players} />
      ) : (
        /* Court + stats layout */
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Court area */}
          <div className="flex-1">
            <div className="bg-surfaceLight/30 rounded-2xl p-4 sm:p-6 border border-border/50 relative overflow-hidden">
              {/* Glow effect behind court */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
              </div>

              {/* Loading skeleton */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-[500px] mx-auto"
                  >
                    <div className="aspect-[500/470] bg-surface/80 animate-pulse rounded-xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`court-${selectedPlayer}-${viewMode}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BasketballCourt>
                      {viewMode === 'chart' && (
                        <ShotDots
                          shots={shots}
                          showMade={showMade}
                          showMissed={showMissed}
                        />
                      )}
                      {viewMode === 'zones' && (
                        <HotZones zones={summary.zones} />
                      )}
                    </BasketballCourt>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Player name overlay */}
              <div className="text-center mt-3">
                <p className="text-text font-bold text-lg">
                  {summary.playerName}
                </p>
                <p className="text-textMuted text-xs">
                  {summary.season} &bull; {summary.totalShots} shots tracked
                </p>
              </div>
            </div>
          </div>

          {/* Stats panel */}
          <div className="lg:w-80 w-full">
            <ShotStatsPanel summary={summary} />
          </div>
        </div>
      )}
    </div>
  );
}
