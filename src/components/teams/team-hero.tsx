import { cn, formatRecord } from '@/lib/utils';
import type { Team } from '@/lib/types';

interface TeamHeroProps {
  team: Team;
  description?: string;
}

export function TeamHero({ team, description }: TeamHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}20 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${team.secondaryColor}15, transparent 50%)`,
        }}
      />

      <div className="relative px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: team.primaryColor }}
          />
          <span className="text-textMuted text-sm font-medium">
            {team.conference} Conference
          </span>
          <span className="text-textMuted text-sm">&#8226;</span>
          <span className="text-textMuted text-sm font-medium">
            {team.division} Division
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-2">
          {team.name.toUpperCase()}
        </h1>

        <p className="text-textMuted text-lg mb-4">{team.city}</p>

        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-text">
              {formatRecord(team.wins, team.losses, team.ties)}
            </span>
            <span className="text-sm text-textMuted">
              {team.league === 'NFL' ? '2025-26 Season' : '2025-26 Season'}
            </span>
          </div>
          {team.standing && (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-accent">
                #{team.standing}
              </span>
              <span className="text-xs text-textMuted">in {team.conference}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-textMuted text-sm mt-4 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
