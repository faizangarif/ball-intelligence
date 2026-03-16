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

export const revalidate = 60;

export const metadata = {
  title: 'Boston Celtics | BALL INTELLIGENCE',
  description: 'Boston Celtics team page - standings, roster, schedule, and analysis.',
};

export default async function BostonCelticsPage() {
  const [teams, players, games] = await Promise.all([
    getTeams('NBA'),
    getPlayers({ league: 'NBA', teamId: 'bos' }),
    getGames({ league: 'NBA' }),
  ]);

  const celtics = teams.find((t) => t.slug === 'boston-celtics');
  if (!celtics) notFound();
  const celticsGames = games.filter(
    (g) => g.homeTeam?.id === 'bos' || g.awayTeam?.id === 'bos'
  );

  // Featured players: Tatum and Brown first, then others
  const tatum = players.find((p) => p.slug === 'jayson-tatum');
  const brown = players.find((p) => p.slug === 'jaylen-brown');
  const otherPlayers = players.filter(
    (p) => p.slug !== 'jayson-tatum' && p.slug !== 'jaylen-brown'
  );
  const rosterHighlights = [
    ...(tatum ? [tatum] : []),
    ...(brown ? [brown] : []),
    ...otherPlayers,
  ].slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <TeamHero team={celtics} />

      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
        {/* Season Record */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center py-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: 'linear-gradient(135deg, #007A33, transparent)',
                }}
              />
              <div className="relative">
                <p className="text-4xl md:text-5xl font-black text-text">
                  {celtics.wins}-{celtics.losses}
                </p>
                <p className="text-sm text-textMuted mt-2">2024-25 Season</p>
              </div>
            </Card>
            <StatCard
              label="Conference Rank"
              value={`#${celtics.standing}`}
              change="up"
            />
            <StatCard
              label="Win Percentage"
              value={((celtics.wins / (celtics.wins + celtics.losses)) * 100).toFixed(1) + '%'}
              change="up"
            />
          </div>
        </section>

        {/* Schedule */}
        <section>
          <SectionHeader title="Schedule" subtitle="2025-26 Season" />
          <Card>
            <TeamSchedule games={celticsGames} teamId="bos" />
          </Card>
        </section>

        {/* Roster Highlights */}
        <section>
          <SectionHeader
            title="Roster Highlights"
            subtitle="Key players driving the Celtics"
            href="/teams/nba/boston-celtics"
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
                background: 'linear-gradient(135deg, #007A33, transparent)',
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
                The Boston Celtics continue to establish themselves as the NBA&apos;s
                premier team. Led by the dynamic duo of Jayson Tatum and Jaylen Brown,
                the Celtics combine elite scoring with suffocating defense. Their
                league-best record reflects a team firing on all cylinders, with depth
                and chemistry that few can match. This is a team built for championship
                runs.
              </p>
            </div>
          </Card>
        </section>

        {/* Why We Love the Celtics */}
        <section>
          <SectionHeader title="Why We Love the Celtics" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-2 border-l-[#007A33]">
              <h4 className="text-sm font-bold text-text mb-2">
                Banner 18 and Beyond
              </h4>
              <p className="text-xs text-textMuted leading-relaxed">
                The most decorated franchise in NBA history keeps adding to its legacy.
                Every season is a chance to hang another banner in the rafters of TD Garden.
              </p>
            </Card>
            <Card className="border-l-2 border-l-[#007A33]">
              <h4 className="text-sm font-bold text-text mb-2">
                The Jay Team
              </h4>
              <p className="text-xs text-textMuted leading-relaxed">
                Tatum and Brown are one of the most dynamic duos in the league. Their
                chemistry on and off the court makes every game appointment viewing.
              </p>
            </Card>
            <Card className="border-l-2 border-l-[#007A33]">
              <h4 className="text-sm font-bold text-text mb-2">
                Defense Wins Championships
              </h4>
              <p className="text-xs text-textMuted leading-relaxed">
                The Celtics&apos; switching defense is the gold standard. Watching them
                lock down elite offenses is a thing of beauty for basketball purists.
              </p>
            </Card>
          </div>
        </section>

        {/* Featured Players */}
        {(tatum || brown) && (
          <section>
            <SectionHeader title="Featured Players" subtitle="Stars of the show" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tatum && (
                <Link href={`/players/${tatum.slug}`}>
                  <Card hover className="relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: 'linear-gradient(135deg, #007A33, transparent)',
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-black text-text">
                            {tatum.name}
                          </h3>
                          <p className="text-sm text-textMuted">
                            #{tatum.number} &bull; {tatum.position}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-surfaceLight flex items-center justify-center">
                          <span className="text-xl font-bold text-textMuted">JT</span>
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {Object.entries(tatum.seasonStats)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-surfaceLight/50 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm font-bold text-text">
                                {value}
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
              )}

              {brown && (
                <Link href={`/players/${brown.slug}`}>
                  <Card hover className="relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: 'linear-gradient(135deg, #007A33, transparent)',
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-black text-text">
                            {brown.name}
                          </h3>
                          <p className="text-sm text-textMuted">
                            #{brown.number} &bull; {brown.position}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-surfaceLight flex items-center justify-center">
                          <span className="text-xl font-bold text-textMuted">JB</span>
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {Object.entries(brown.seasonStats)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-surfaceLight/50 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm font-bold text-text">
                                {value}
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
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
