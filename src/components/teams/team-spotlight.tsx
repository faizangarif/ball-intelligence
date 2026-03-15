import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Team } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface TeamSpotlightProps {
  team: Team;
  accent: string;
  description: string;
}

export function TeamSpotlight({ team, accent, description }: TeamSpotlightProps) {
  const href =
    team.league === 'NBA'
      ? `/teams/nba/${team.slug}`
      : `/teams/nfl/${team.slug}`;

  return (
    <Link href={href}>
      <div
        className={cn(
          'bg-surface border border-border rounded-xl p-6',
          'hover:scale-[1.02] hover:border-opacity-50 transition-all duration-300',
          'group cursor-pointer'
        )}
        style={{ borderColor: `${accent}33` }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-5"
          style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}
        />
        <div className="flex items-center justify-between mb-3">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: accent }}
            >
              {team.league} • {team.conference}
            </span>
            <h3 className="text-xl font-bold text-text mt-1">{team.name}</h3>
          </div>
          <div
            className="text-2xl font-black"
            style={{ color: accent }}
          >
            {team.record}
          </div>
        </div>
        <p className="text-sm text-textMuted mb-4">{description}</p>
        <span
          className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
          style={{ color: accent }}
        >
          View Team <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
