'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShotChartSummary } from '@/lib/types';

interface ShotStatsPanelProps {
  summary: ShotChartSummary;
}

function getPctColor(pct: number): string {
  if (pct > 45) return 'text-accent';
  if (pct < 35) return 'text-live';
  return 'text-gold';
}

export function ShotStatsPanel({ summary }: ShotStatsPanelProps) {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchInsight = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/shots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: summary.playerName,
          zones: summary.zones.map((z) => ({
            name: z.name,
            percentage: z.percentage,
            attempts: z.attempts,
          })),
        }),
      });
      const data = await res.json();
      if (data.analysis) setAiInsight(data.analysis);
    } catch {
      // silent fallback
    } finally {
      setLoadingAI(false);
    }
  };

  // No auto-fire — only on button click

  const bestZone = summary.zones.reduce(
    (best, z) => (z.percentage > (best?.percentage ?? 0) ? z : best),
    summary.zones[0],
  );

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
      {/* Overall stats */}
      <div className="text-center space-y-1">
        <p className="text-textMuted text-xs uppercase tracking-wider font-medium">
          Overall FG%
        </p>
        <p className="text-4xl font-black text-accent tabular-nums">
          {summary.overallPct.toFixed(1)}%
        </p>
        <p className="text-textMuted text-sm">
          {summary.totalMade} / {summary.totalShots} shots
        </p>
        <p className="text-textMuted text-xs">{summary.season} Season</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Zone-by-zone table */}
      <div>
        <p className="text-xs uppercase tracking-wider font-medium text-textMuted mb-3">
          Zone Breakdown
        </p>
        <div className="space-y-0">
          {/* Header */}
          <div className="grid grid-cols-4 gap-2 text-[10px] uppercase tracking-wider text-textMuted font-medium pb-2 border-b border-border">
            <span>Zone</span>
            <span className="text-right">ATT</span>
            <span className="text-right">MADE</span>
            <span className="text-right">FG%</span>
          </div>

          {/* Rows */}
          {summary.zones.map((zone) => {
            const isBest = zone.name === bestZone?.name;
            return (
              <div
                key={zone.name}
                className={cn(
                  'grid grid-cols-4 gap-2 py-2 text-sm border-b border-border/50',
                  isBest && 'bg-accent/10 -mx-2 px-2 rounded',
                )}
              >
                <span
                  className={cn(
                    'text-text truncate text-xs',
                    isBest && 'text-accent font-semibold',
                  )}
                  title={zone.name}
                >
                  {zone.name
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                <span className="text-right text-textMuted tabular-nums text-xs">
                  {zone.attempts}
                </span>
                <span className="text-right text-textMuted tabular-nums text-xs">
                  {zone.makes}
                </span>
                <span
                  className={cn(
                    'text-right font-semibold tabular-nums text-xs',
                    getPctColor(zone.percentage),
                  )}
                >
                  {zone.percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best zone callout */}
      {bestZone && (
        <>
          <div className="h-px bg-border" />
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-accent font-medium">
              Best Zone
            </p>
            <p className="text-text font-bold text-sm mt-1">
              {bestZone.name
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
            <p className="text-accent text-xl font-black tabular-nums">
              {bestZone.percentage.toFixed(1)}%
            </p>
            <p className="text-textMuted text-xs">
              {bestZone.makes}/{bestZone.attempts} shots
            </p>
          </div>
        </>
      )}

      {/* AI Shot Analysis */}
      <div className="h-px bg-border" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <p className="text-[10px] uppercase tracking-wider text-accent font-medium">
              AI Shot Analysis
            </p>
          </div>
          {!aiInsight && (
            <button
              onClick={fetchInsight}
              disabled={loadingAI}
              className="text-[10px] font-medium px-2 py-1 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
              {loadingAI ? 'Loading...' : 'Generate'}
            </button>
          )}
        </div>
        {loadingAI ? (
          <div className="space-y-1.5">
            <div className="h-2.5 bg-surfaceLight rounded-full w-full animate-pulse" />
            <div className="h-2.5 bg-surfaceLight rounded-full w-4/5 animate-pulse" />
          </div>
        ) : aiInsight ? (
          <p className="text-textMuted text-xs leading-relaxed">{aiInsight}</p>
        ) : (
          <p className="text-textMuted text-xs italic">Click Generate for AI analysis</p>
        )}
      </div>
    </div>
  );
}
