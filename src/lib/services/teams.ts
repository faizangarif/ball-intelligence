import { fetchNBATeams, fetchNFLTeams } from '@/lib/services/web-data';
import { mockTeams } from '@/lib/data/mock/teams';
import type { Team, League } from '@/lib/types';

export async function getTeams(league?: League): Promise<Team[]> {
  try {
    const [nba, nfl] = await Promise.all([fetchNBATeams(), fetchNFLTeams()]);
    let teams = [...nba, ...nfl];
    if (teams.length === 0) teams = [...mockTeams];
    if (league) teams = teams.filter((t) => t.league === league);
    return teams.sort((a, b) => b.wins - a.wins);
  } catch {
    let teams = [...mockTeams];
    if (league) teams = teams.filter((t) => t.league === league);
    return teams.sort((a, b) => b.wins - a.wins);
  }
}

export async function getTeam(slug: string): Promise<Team | null> {
  try {
    const teams = await getTeams();
    return teams.find((t) => t.slug === slug) ?? null;
  } catch {
    return mockTeams.find((t) => t.slug === slug) ?? null;
  }
}

export const getTeamById = async (id: string): Promise<Team | null> => {
  try {
    const teams = await getTeams();
    return teams.find((t) => t.id === id) ?? null;
  } catch {
    return mockTeams.find((t) => t.id === id) ?? null;
  }
};

export async function getFeaturedTeams(): Promise<Team[]> {
  try {
    const teams = await getTeams();
    return teams.filter((t) => t.featured);
  } catch {
    return mockTeams.filter((t) => t.featured);
  }
}

export async function getStandings(league: League): Promise<Team[]> {
  try {
    const teams = await getTeams(league);
    return teams.sort((a, b) => {
      const aPct = a.wins / (a.wins + a.losses || 1);
      const bPct = b.wins / (b.wins + b.losses || 1);
      return bPct - aPct;
    });
  } catch {
    return mockTeams
      .filter((t) => t.league === league)
      .sort((a, b) => {
        const aPct = a.wins / (a.wins + a.losses || 1);
        const bPct = b.wins / (b.wins + b.losses || 1);
        return bPct - aPct;
      });
  }
}
