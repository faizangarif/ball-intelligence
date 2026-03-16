import { getCached } from '@/lib/services/cache';
import { mockTeams } from '@/lib/data/mock/teams';
import type { Team, League } from '@/lib/types';

// Read from cache (populated by agents) or fall back to mock data instantly
function getAllTeams(): Team[] {
  const cachedNBA = getCached<Team[]>('nba-teams');
  const cachedNFL = getCached<Team[]>('nfl-teams');

  if (cachedNBA && cachedNBA.length > 0 && cachedNFL && cachedNFL.length > 0) {
    return [...cachedNBA, ...cachedNFL];
  }
  if (cachedNBA && cachedNBA.length > 0) {
    return [...cachedNBA, ...mockTeams.filter((t) => t.league === 'NFL')];
  }
  if (cachedNFL && cachedNFL.length > 0) {
    return [...mockTeams.filter((t) => t.league === 'NBA'), ...cachedNFL];
  }
  return [...mockTeams];
}

export async function getTeams(league?: League): Promise<Team[]> {
  let teams = getAllTeams();
  if (league) teams = teams.filter((t) => t.league === league);
  return teams.sort((a, b) => b.wins - a.wins);
}

export async function getTeam(slug: string): Promise<Team | null> {
  return getAllTeams().find((t) => t.slug === slug) ?? null;
}

export async function getTeamById(id: string): Promise<Team | null> {
  return getAllTeams().find((t) => t.id === id) ?? null;
}

export async function getFeaturedTeams(): Promise<Team[]> {
  return getAllTeams().filter((t) => t.featured);
}

export async function getStandings(league: League): Promise<Team[]> {
  return getAllTeams()
    .filter((t) => t.league === league)
    .sort((a, b) => {
      const aPct = a.wins / (a.wins + a.losses || 1);
      const bPct = b.wins / (b.wins + b.losses || 1);
      return bPct - aPct;
    });
}
