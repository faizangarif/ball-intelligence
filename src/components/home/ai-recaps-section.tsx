'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import type { Game } from '@/lib/types';

interface AIRecapsSectionProps {
  recaps: { game: Game; summary: string }[];
}

export function AIRecapsSection({ recaps }: AIRecapsSectionProps) {
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    recaps.forEach(async ({ game }) => {
      if (aiSummaries[game.id]) return;
      setLoading((prev) => ({ ...prev, [game.id]: true }));
      try {
        const res = await fetch('/api/ai/recap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            homeTeam: game.homeTeam.name,
            awayTeam: game.awayTeam.name,
            homeScore: game.homeScore,
            awayScore: game.awayScore,
            league: game.league,
            events: game.events?.map((e) => e.description) || [],
          }),
        });
        const data = await res.json();
        if (data.recap) {
          setAiSummaries((prev) => ({ ...prev, [game.id]: data.recap }));
        }
      } catch {
        // fallback to static summary
      } finally {
        setLoading((prev) => ({ ...prev, [game.id]: false }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (recaps.length === 0) return null;

  return (
    <section>
      <SectionHeader
        title="AI Game Recaps"
        subtitle="Powered by Claude AI"
        action={<Sparkles className="w-5 h-5 text-accent" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recaps.map(({ game, summary }) => {
          const homeWon = game.homeScore > game.awayScore;
          const displaySummary = aiSummaries[game.id] || summary;
          const isLoading = loading[game.id];

          return (
            <div
              key={game.id}
              className="bg-surface border border-border rounded-xl p-5 hover:border-accent/20 transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default">{game.league}</Badge>
                <Badge variant="success">Final</Badge>
                {aiSummaries[game.id] && (
                  <Badge variant="info">
                    <Sparkles className="w-3 h-3 mr-1 inline" />
                    AI
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-bold ${homeWon ? 'text-text' : 'text-textMuted'}`}>
                      {game.homeTeam.abbreviation}
                    </span>
                    <span className={`text-xl font-black ${homeWon ? 'text-accent' : 'text-textMuted'}`}>
                      {game.homeScore}
                    </span>
                  </div>
                  <span className="text-textMuted text-xs">vs</span>
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-bold ${!homeWon ? 'text-text' : 'text-textMuted'}`}>
                      {game.awayTeam.abbreviation}
                    </span>
                    <span className={`text-xl font-black ${!homeWon ? 'text-accent' : 'text-textMuted'}`}>
                      {game.awayScore}
                    </span>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-surfaceLight rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-surfaceLight rounded-full w-3/4 animate-pulse" />
                </div>
              ) : (
                <p className="text-textMuted text-sm leading-relaxed line-clamp-4 mb-4">
                  {displaySummary}
                </p>
              )}

              <Link
                href={`/live/${game.id}`}
                className="text-sm text-accent font-semibold hover:text-accent-light transition-colors group-hover:translate-x-1 inline-flex items-center gap-1"
              >
                Read Full Recap <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
