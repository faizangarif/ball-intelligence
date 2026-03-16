export const revalidate = 60;

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
import type { League } from '@/lib/types';

interface PageProps {
  params: Promise<{ league: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { league, slug } = await params;
  const allTeams = await getTeams(league.toUpperCase() as League);
  const team = allTeams.find((t) => t.slug === slug);

  if (!team) {
    return { title: 'Team Not Found | BALL INTELLIGENCE' };
  }

  return {
    title: `${team.name} | BALL INTELLIGENCE`,
    description: `${team.name} team page - standings, roster, schedule, and analysis.`,
  };
}

export default async function GenericTeamPage({ params }: PageProps) {
  const { league, slug } = await params;
  const leagueUpper = league.toUpperCase() as League;

  const [allTeams, allGames] = await Promise.all([
    getTeams(leagueUpper),
    getGames({ league: leagueUpper }),
  ]);

  const team = allTeams.find((t) => t.slug === slug);

  if (!team) {
    notFound();
  }

  const players = await getPlayers({ league: leagueUpper, teamId: team.id });

  const teamGames = allGames.filter(
    (g) => g.homeTeam.id === team.id || g.awayTeam.id === team.id
  );

  const totalGames = team.wins + team.losses + (team.ties || 0);
  const winPct =
    totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(1) + '%' : '0.0%';

  const description = `${team.name} is competing in the ${team.conference} this season with a ${team.record} record.`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <TeamHero team={team} description={description} />

      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
        {/* Season Record */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center py-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${team.primaryColor}, transparent)`,
                }}
              />
              <div className="relative">
                <p className="text-4xl md:text-5xl font-black text-text">
                  {team.record}
                </p>
                <p className="text-sm text-textMuted mt-2">2025-26 Season</p>
              </div>
            </Card>
            <StatCard
              label="Conference Rank"
              value={team.standing ? `#${team.standing}` : 'N/A'}
            />
            <StatCard label="Win Percentage" value={winPct} />
          </div>
        </section>

        {/* Schedule */}
        {teamGames.length > 0 && (
          <section>
            <SectionHeader title="Schedule" subtitle="2025-26 Season" />
            <Card>
              <TeamSchedule games={teamGames} teamId={team.id} />
            </Card>
          </section>
        )}

        {/* Roster */}
        {players.length > 0 && (
          <section>
            <SectionHeader
              title="Roster"
              subtitle={`${team.name} players`}
            />
            <TeamRoster players={players} />
          </section>
        )}
      </div>
    </div>
  );
}
