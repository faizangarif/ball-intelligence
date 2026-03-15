export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getTeams } from '@/lib/services/teams';
import { getPlayers } from '@/lib/services/players';
import { getGames } from '@/lib/services/games';
import { getNBALeaders } from '@/lib/services/stats';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { NBAStandingsTable } from '@/components/nba/standings-table';
import { StatLeadersList } from '@/components/shared/stat-leaders-list';
import { GameCardMini } from '@/components/shared/game-card-mini';
import { Carousel } from '@/components/ui/carousel';
import { formatRecord } from '@/lib/utils';

export const metadata = {
  title: 'NBA Hub | BALL INTELLIGENCE',
  description: 'NBA scores, standings, stats, and analysis powered by BALL INTELLIGENCE.',
};

export default async function NBAPage() {
  const [
    teams,
    liveGames,
    featuredGames,
    trendingPlayers,
    pointsLeaders,
    assistsLeaders,
    reboundsLeaders,
  ] = await Promise.all([
    getTeams('NBA'),
    getGames({ league: 'NBA', status: 'LIVE' }),
    getGames({ league: 'NBA', featured: true }),
    getPlayers({ league: 'NBA', trending: true }),
    getNBALeaders('ppg', 5),
    getNBALeaders('apg', 5),
    getNBALeaders('rpg', 5),
  ]);

  const celtics = teams.find((t) => t.slug === 'boston-celtics');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nbaBlue/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(29,66,138,0.1),transparent_50%)]" />
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-text tracking-tight">
            NBA
          </h1>
          <p className="text-lg md:text-xl mt-3">
            <span className="text-textMuted">Basketball </span>
            <span className="text-nbaBlue font-semibold">Intelligence</span>
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
        {/* Live Games */}
        {liveGames.length > 0 && (
          <section>
            <SectionHeader
              title="Live Now"
              subtitle="Games currently in progress"
              href="/live"
            />
            <Carousel>
              {liveGames.map((game) => (
                <GameCardMini key={game.id} game={game} />
              ))}
            </Carousel>
          </section>
        )}

        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <section>
            <SectionHeader title="Featured Games" subtitle="Today's top matchups" />
            <Carousel>
              {featuredGames.map((game) => (
                <GameCardMini key={game.id} game={game} />
              ))}
            </Carousel>
          </section>
        )}

        {/* Two Column: Standings + Stat Leaders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Standings */}
          <section>
            <SectionHeader title="Standings" subtitle="2025-26 NBA Season" />
            <Card>
              <NBAStandingsTable teams={teams} />
            </Card>
          </section>

          {/* Stat Leaders */}
          <section>
            <SectionHeader title="Stat Leaders" subtitle="Season leaders by category" />
            <Card className="space-y-6">
              <StatLeadersList
                title="Points Per Game"
                leaders={pointsLeaders}
                statLabel="PPG"
              />
              <div className="border-t border-border" />
              <StatLeadersList
                title="Assists Per Game"
                leaders={assistsLeaders}
                statLabel="APG"
              />
              <div className="border-t border-border" />
              <StatLeadersList
                title="Rebounds Per Game"
                leaders={reboundsLeaders}
                statLabel="RPG"
              />
            </Card>
          </section>
        </div>

        {/* Celtics Spotlight */}
        {celtics && (
          <section>
            <SectionHeader title="Team Spotlight" />
            <Link href="/teams/nba/boston-celtics">
              <Card hover className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      'linear-gradient(135deg, #007A33 0%, transparent 60%)',
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#007A33]" />
                      <span className="text-xs text-textMuted uppercase tracking-wider font-semibold">
                        Boston Celtics
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-text mb-1">
                      {formatRecord(celtics.wins, celtics.losses)}
                    </h3>
                    <p className="text-textMuted text-sm">
                      Eastern Conference &bull; #{celtics.standing} Seed
                    </p>
                  </div>
                  <span className="text-accent font-semibold text-sm">
                    Your Team &rarr;
                  </span>
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* Trending Players */}
        {trendingPlayers.length > 0 && (
          <section>
            <SectionHeader
              title="Trending Players"
              subtitle="NBA players making waves"
              href="/players"
            />
            <Carousel>
              {trendingPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.slug}`}
                  className="min-w-[200px] snap-start"
                >
                  <Card hover className="h-full">
                    <div className="w-12 h-12 rounded-full bg-surfaceLight flex items-center justify-center mb-3">
                      <span className="text-lg font-bold text-textMuted">
                        {player.firstName[0]}
                        {player.lastName[0]}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-text">{player.name}</h4>
                    <p className="text-xs text-textMuted mt-0.5">
                      {player.position}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {player.seasonStats.ppg !== undefined && (
                        <span className="text-xs bg-surfaceLight/50 rounded px-2 py-1">
                          <span className="font-bold text-text">
                            {player.seasonStats.ppg}
                          </span>
                          <span className="text-textMuted ml-1">PTS</span>
                        </span>
                      )}
                      {player.seasonStats.rpg !== undefined && (
                        <span className="text-xs bg-surfaceLight/50 rounded px-2 py-1">
                          <span className="font-bold text-text">
                            {player.seasonStats.rpg}
                          </span>
                          <span className="text-textMuted ml-1">REB</span>
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </Carousel>
          </section>
        )}

        {/* Shot IQ CTA */}
        <section>
          <Link
            href="/shot-iq"
            className="block group"
          >
            <Card hover className="relative overflow-hidden text-center py-10">
              <div className="absolute inset-0 bg-gradient-to-r from-nbaBlue/10 via-accent/5 to-nbaBlue/10" />
              <div className="relative">
                <h3 className="text-2xl font-black text-text mb-2">
                  Explore Shot IQ
                </h3>
                <p className="text-textMuted text-sm mb-4">
                  Interactive shot charts, heat maps, and shooting analysis
                </p>
                <span className="text-accent font-semibold group-hover:text-accent-light transition-colors">
                  Dive In &rarr;
                </span>
              </div>
            </Card>
          </Link>
        </section>
      </div>
    </div>
  );
}
