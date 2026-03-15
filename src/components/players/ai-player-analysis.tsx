'use client';

import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Player } from '@/lib/types';

interface AIPlayerAnalysisProps {
  player: Player;
  fallbackSummary: string;
}

export function AIPlayerAnalysis({ player, fallbackSummary }: AIPlayerAnalysisProps) {
  const [analysis, setAnalysis] = useState(fallbackSummary);
  const [loading, setLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: player.name,
          team: player.team?.name || '',
          position: player.position,
          league: player.league,
          stats: player.seasonStats,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        setIsAI(true);
      }
    } catch {
      // keep fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text">Player Analysis</h2>
          {isAI && (
            <Badge variant="info">
              <Sparkles className="w-3 h-3 mr-1 inline" />
              AI Generated
            </Badge>
          )}
        </div>
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="text-textMuted hover:text-accent transition-colors p-1"
          title="Regenerate analysis"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {loading && !analysis ? (
        <div className="space-y-2">
          <div className="h-3 bg-surfaceLight rounded-full w-full animate-pulse" />
          <div className="h-3 bg-surfaceLight rounded-full w-5/6 animate-pulse" />
          <div className="h-3 bg-surfaceLight rounded-full w-4/6 animate-pulse" />
        </div>
      ) : (
        <p className="text-textMuted leading-relaxed">{analysis}</p>
      )}
    </section>
  );
}
