import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import type { Game } from '@/lib/types';

interface AIRecapsSectionProps {
  recaps: { game: Game; summary: string }[];
}

export function AIRecapsSection({ recaps }: AIRecapsSectionProps) {
  if (recaps.length === 0) return null;

  return (
    <section>
      <SectionHeader
        title="Game Recaps"
        subtitle="Latest results and highlights"
        action={<Sparkles className="w-5 h-5 text-accent" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recaps.map(({ game, summary }) => {
          const homeWon = game.homeScore > game.awayScore;

          return (
            <div
              key={game.id}
              className="bg-surface border border-border rounded-xl p-5 hover:border-accent/20 transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default">{game.league}</Badge>
                <Badge variant="success">Final</Badge>
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

              <p className="text-textMuted text-sm leading-relaxed line-clamp-3 mb-4">
                {summary}
              </p>

              <Link
                href={`/live/${game.id}`}
                className="text-sm text-accent font-semibold hover:text-accent-light transition-colors inline-flex items-center gap-1"
              >
                View Game <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
