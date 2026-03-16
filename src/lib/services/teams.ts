import { fetchESPNStandings } from '@/lib/services/espn';
import { mockTeams } from '@/lib/data/mock/teams';
import type { Team, League } from '@/lib/types';

// Fetch real standings from ESPN (fast, <1s, always current)
async function getAllTeams(): Promise<Team[]> {
  try {
    const [nba, nfl] = await Promise.all([
      fetchESPNStandings('NBA'),
      fetchESPNStandings('NFL'),
    ]);

    // Use ESPN data if available, mock as fallback per league
    const nbaTeams = nba.length > 0 ? nba : mockTeams.filter((t) => t.league === 'NBA');
    const nflTeams = nfl.length > 0 ? nfl : mockTeams.filter((t) => t.league === 'NFL');

    return [...nbaTeams, ...nflTeams];
  } catch {
    return [...mockTeams];
  }
}

export async function getTeams(league?: League): Promise<Team[]> {
  let teams = await getAllTeams();
  if (league) teams = teams.filter((t) => t.league === league);
  return teams.sort((a, b) => b.wins - a.wins);
}

export async function getTeam(slug: string): Promise<Team | null> {
  const teams = await getAllTeams();
  return teams.find((t) => t.slug === slug) ?? null;
}

export async function getTeamById(id: string): Promise<Team | null> {
  const teams = await getAllTeams();
  return teams.find((t) => t.id === id) ?? null;
}

export async function getFeaturedTeams(): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams.filter((t) => t.featured);
}

export async function getStandings(league: League): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams
    .filter((t) => t.league === league)
    .sort((a, b) => {
      const aPct = a.wins / (a.wins + a.losses || 1);
      const bPct = b.wins / (b.wins + b.losses || 1);
      return bPct - aPct;
    });
}
