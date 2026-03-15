import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import type { Team } from '@/lib/types';

interface FeaturedTeamsProps {
  teams: Team[];
}

export function FeaturedTeams({ teams }: FeaturedTeamsProps) {
  if (teams.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Featured Teams" subtitle="Top contenders this season" href="/teams" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <Link key={team.id} href={`/teams/${team.league.toLowerCase()}/${team.slug}`}>
            <div
              className="relative overflow-hidden rounded-xl border border-border p-6 hover:scale-[1.02] transition-all duration-300 group"
              style={{
                background: `linear-gradient(135deg, ${team.primaryColor}15 0%, transparent 60%), #111118`,
              }}
            >
              {/* Color accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: team.primaryColor }}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={team.league === 'NBA' ? 'info' : 'default'}>
                      {team.conference}
                    </Badge>
                    <Badge>{team.league}</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-text mb-1">{team.name}</h3>
                  <p className="text-textMuted text-sm">{team.record}</p>
                </div>

                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black shrink-0"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  {team.abbreviation}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm text-accent font-semibold group-hover:text-accent-light transition-colors">
                View Team <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
