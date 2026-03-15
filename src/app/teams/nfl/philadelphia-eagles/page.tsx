import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTeams } from '@/lib/services/teams';
import { getPlayers } from '@/lib/services/players';
import { getGames } from '@/lib/services/games';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { TeamHero } from '@/components/teams/team-hero';
import { TeamSchedule } from '@/components/teams/team-schedule';
import { TeamRoster } from '@/components/teams/team-roster';
import { getStatLabel } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Philadelphia Eagles | BALL INTELLIGENCE',
  description: 'Philadelphia Eagles team page - standings, roster, schedule, and analysis.',
};

export default async function PhiladelphiaEaglesPage() {
  const [teams, players, games] = await Promise.all([
    getTeams('NFL'),
    getPlayers({ league: 'NFL', teamId: 'phi-eagles' }),
    getGames({ league: 'NFL' }),
  ]);

  const eagles = teams.find((t) => t.slug === 'philadelphia-eagles');
  if (!eagles) notFound();
  const eaglesGames = games.filter(
    (g) => g.homeTeam?.id === 'phi-eagles' || g.awayTeam?.id === 'phi-eagles'
  );

  // Key players in order: Hurts, AJ Brown, DeVonta Smith, Barkley, Goedert
  const keyOrder = ['jalen-hurts', 'aj-brown', 'devonta-smith', 'saquon-barkley', 'dallas-goedert'];
  const rosterHighlights = keyOrder
    .map((slug) => players.find((p) => p.slug === slug))
    .filter(Boolean) as typeof players;

  const hurts = players.find((p) => p.slug === 'jalen-hurts');
  const ajBrown = players.find((p) => p.slug === 'aj-brown');
  const devonta = players.find((p) => p.slug === 'devonta-smith');
  const barkley = players.find((p) => p.slug === 'saquon-barkley');

  const featuredPlayers = [hurts, ajBrown, devonta, barkley].filter(Boolean) as typeof players;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <TeamHero team={eagles} />

      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
        {/* Season Record */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center py-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: 'linear-gradient(135deg, #004C54, transparent)',
                }}
              />
              <div className="relative">
                <p className="text-4xl md:text-5xl font-black text-text">
                  {eagles.wins}-{eagles.losses}
                </p>
                <p className="text-sm text-textMuted mt-2">2025-26 Season</p>
              </div>
            </Card>
            <StatCard
              label="Conference Rank"
              value={`#${eagles.standing}`}
              change="up"
            />
            <StatCard
              label="Win Percentage"
              value={
                (
                  (eagles.wins /
                    (eagles.wins + eagles.losses + (eagles.ties || 0))) *
                  100
                ).toFixed(1) + '%'
              }
              change="up"
            />
          </div>
        </section>

        {/* Schedule */}
        <section>
          <SectionHeader title="Schedule" subtitle="2025-26 Season" />
          <Card>
            <TeamSchedule games={eaglesGames} teamId="phi-eagles" />
          </Card>
        </section>

        {/* Roster Highlights */}
        <section>
          <SectionHeader
            title="Roster Highlights"
            subtitle="The stars powering the Eagles"
          />
          <TeamRoster players={rosterHighlights} />
        </section>

        {/* AI Team Summary */}
        <section>
          <SectionHeader title="AI Team Summary" subtitle="Powered by Ball Intelligence" />
          <Card className="relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: 'linear-gradient(135deg, #004C54, transparent)',
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent font-semibold uppercase tracking-wider">
                  AI Analysis
                </span>
              </div>
              <p className="text-text leading-relaxed">
                The Philadelphia Eagles are built to dominate. With Jalen Hurts
                commanding one of the NFL&apos;s most versatile offenses and Saquon
                Barkley providing an elite rushing attack, Philly&apos;s offense is a
                nightmare to defend. The defense complements with a relentless front
                seven and opportunistic secondary. This team has Super Bowl aspirations
                written all over it.
              </p>
            </div>
          </Card>
        </section>

        {/* Why We Love the Eagles */}
        <section>
          <SectionHeader title="Why We Love the Eagles" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-2 border-l-[#004C54]">
              <h4 className="text-sm font-bold text-text mb-2">
                Saquon&apos;s Historic Season
              </h4>
              <p className="text-xs text-textMuted leading-relaxed">
                Over 2,000 rushing yards behind the best offensive line in football.
                Saquon Barkley has turned Philadelphia into a ground-and-pound machine
                that nobody can stop.
              </p>
            </Card>
            <Card className="border-l-2 border-l-[#004C54]">
              <h4 className="text-sm font-bold text-text mb-2">
                Hurts&apos; Dual Threat
              </h4>
              <p className="text-xs text-textMuted leading-relaxed">
                Jalen Hurts keeps defenses guessing with his arm and legs. The combination
                of passing and rushing TDs makes Philly&apos;s offense virtually scheme-proof.
              </p>
            </Card>
            <Card className="border-l-2 border-l-[#004C54]">
              <h4 className="text-sm font-bold text-text mb-2">
                The Brotherhood
              </h4>
              <p className="text-xs text-textMuted leading-relaxed">
                This team plays for each other. From the locker room to the field,
                the Eagles&apos; chemistry and culture is what separates them from every
                other contender in the NFL.
              </p>
            </Card>
          </div>
        </section>

        {/* Featured Players with Stats */}
        {featuredPlayers.length > 0 && (
          <section>
            <SectionHeader title="Featured Players" subtitle="Key contributors" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPlayers.map((player) => (
                <Link key={player.id} href={`/players/${player.slug}`}>
                  <Card hover className="relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: 'linear-gradient(135deg, #004C54, transparent)',
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-black text-text">
                            {player.name}
                          </h3>
                          <p className="text-sm text-textMuted">
                            #{player.number} &bull; {player.position}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-surfaceLight flex items-center justify-center">
                          <span className="text-xl font-bold text-textMuted">
                            {player.firstName[0]}
                            {player.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {Object.entries(player.seasonStats)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-surfaceLight/50 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm font-bold text-text">
                                {typeof value === 'number' && value > 100
                                  ? value.toLocaleString()
                                  : value}
                              </span>
                              <span className="text-xs text-textMuted ml-1">
                                {getStatLabel(key)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
