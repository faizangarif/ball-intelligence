'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Game } from '@/lib/types';

interface LiveScoresPollerProps {
  onUpdate: (data: {
    games: Game[];
    live: Game[];
    final: Game[];
    scheduled: Game[];
  }) => void;
  defaultInterval?: number; // seconds
  league?: string;
}

const INTERVAL_OPTIONS = [
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
];

export function LiveScoresPoller({
  onUpdate,
  defaultInterval = 10,
  league,
}: LiveScoresPollerProps) {
  const [interval, setInterval_] = useState(defaultInterval);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState(interval);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const url = league
        ? `/api/scores?league=${league}`
        : '/api/scores';
      const res = await fetch(url);
      const data = await res.json();
      onUpdate(data);
      setLastUpdate(new Date().toLocaleTimeString());
      setCountdown(interval);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setLoading(false);
    }
  }, [league, interval, onUpdate]);

  // Initial fetch
  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // Polling interval
  useEffect(() => {
    const timer = setInterval(() => {
      fetchScores();
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [interval, fetchScores]);

  // Countdown display
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : interval));
    }, 1000);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div className="flex items-center gap-3 text-xs text-textMuted">
      <button
        onClick={fetchScores}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border border-border rounded-lg hover:border-accent/30 transition-all"
        title="Refresh now"
      >
        <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
        <span>{loading ? 'Updating...' : 'Refresh'}</span>
      </button>

      <div className="flex items-center gap-1.5">
        <span className="tabular-nums">
          {lastUpdate && `Updated ${lastUpdate}`}
        </span>
        <span className="text-border">|</span>
        <span className="tabular-nums text-accent">
          {countdown}s
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 hover:text-accent transition-colors"
          title="Refresh settings"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>

        {showSettings && (
          <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg p-2 z-50 shadow-xl animate-scale-in">
            <p className="text-[10px] uppercase tracking-wider text-textMuted mb-2 px-1">
              Refresh Rate
            </p>
            <div className="flex gap-1">
              {INTERVAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setInterval_(opt.value);
                    setCountdown(opt.value);
                    setShowSettings(false);
                  }}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md transition-all',
                    interval === opt.value
                      ? 'bg-accent text-white'
                      : 'bg-surfaceLight text-textMuted hover:text-text'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
