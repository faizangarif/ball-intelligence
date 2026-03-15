export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getTeams } from '@/lib/services/teams';
import { getPlayers } from '@/lib/services/players';
import { getGames } from '@/lib/services/games';
import { getNFLLeaders } from '@/lib/services/stats';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { NFLStandingsTable } from '@/components/nfl/standings-table';
import { StatLeadersList } from '@/components/shared/stat-leaders-list';
import { GameCardMini } from '@/components/shared/game-card-mini';
import { Carousel } from '@/components/ui/carousel';
import { formatRecord } from '@/lib/utils';

export const metadata = {
  title: 'NFL Hub | BALL INTELLIGENCE',
  description: 'NFL scores, standings, stats, and analysis powered by BALL INTELLIGENCE.',
};

export default async function NFLPage() {
  const [
    teams,
    liveGames,
    featuredGames,
    trendingPlayers,
    passingLeaders,
    rushingLeaders,
    receivingLeaders,
  ] = await Promise.all([
    getTeams('NFL'),
    getGames({ league: 'NFL', status: 'LIVE' }),
    getGames({ league: 'NFL', featured: true }),
    getPlayers({ league: 'NFL', trending: true }),
    getNFLLeaders('passingYards', 5),
    getNFLLeaders('rushingYards', 5),
    getNFLLeaders('receivingYards', 5),
  ]);

  const eagles = teams.find((t) => t.slug === 'philadelphia-eagles');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nflBlue/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(1,51,105,0.1),transparent_50%)]" />
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-text tracking-tight">
            NFL
          </h1>
          <p className="text-lg md:text-xl mt-3">
            <span className="text-textMuted">Football </span>
            <span className="text-nflBlue font-semibold">Intelligence</span>
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
            <SectionHeader title="Featured Games" subtitle="Top matchups" />
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
            <SectionHeader title="Standings" subtitle="2025-26 NFL Season" />
            <Card>
              <NFLStandingsTable teams={teams} />
            </Card>
          </section>

          {/* Stat Leaders */}
          <section>
            <SectionHeader title="Stat Leaders" subtitle="Season leaders by category" />
            <Card className="space-y-6">
              <StatLeadersList
                title="Top Passers"
                leaders={passingLeaders}
                statLabel="YDS"
              />
              <div className="border-t border-border" />
              <StatLeadersList
                title="Top Rushers"
                leaders={rushingLeaders}
                statLabel="YDS"
              />
              <div className="border-t border-border" />
              <StatLeadersList
                title="Top Receivers"
                leaders={receivingLeaders}
                statLabel="YDS"
              />
            </Card>
          </section>
        </div>

        {/* Eagles Spotlight */}
        {eagles && (
          <section>
            <SectionHeader title="Team Spotlight" />
            <Link href="/teams/nfl/philadelphia-eagles">
              <Card hover className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      'linear-gradient(135deg, #004C54 0%, transparent 60%)',
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#004C54]" />
                      <span className="text-xs text-textMuted uppercase tracking-wider font-semibold">
                        Philadelphia Eagles
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-text mb-1">
                      {formatRecord(eagles.wins, eagles.losses, eagles.ties)}
                    </h3>
                    <p className="text-textMuted text-sm">
                      NFC &bull; #{eagles.standing} Seed
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
              subtitle="NFL players making headlines"
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
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {player.seasonStats.passingYards !== undefined && (
                        <span className="text-xs bg-surfaceLight/50 rounded px-2 py-1">
                          <span className="font-bold text-text">
                            {player.seasonStats.passingYards.toLocaleString()}
                          </span>
                          <span className="text-textMuted ml-1">YDS</span>
                        </span>
                      )}
                      {player.seasonStats.rushingYards !== undefined && (
                        <span className="text-xs bg-surfaceLight/50 rounded px-2 py-1">
                          <span className="font-bold text-text">
                            {player.seasonStats.rushingYards.toLocaleString()}
                          </span>
                          <span className="text-textMuted ml-1">RUSH</span>
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </Carousel>
          </section>
        )}
      </div>
    </div>
  );
}
