import { fetchNBAPlayers, fetchNFLPlayers } from '@/lib/services/web-data';
import { mockPlayers } from '@/lib/data/mock/players';
import { getTeams } from '@/lib/services/teams';
import type { Player, League, Team } from '@/lib/types';

async function getAllPlayers(): Promise<Player[]> {
  try {
    const [nba, nfl] = await Promise.all([fetchNBAPlayers(), fetchNFLPlayers()]);
    const players = [...nba, ...nfl];
    if (players.length === 0) return [...mockPlayers];
    return players;
  } catch {
    return [...mockPlayers];
  }
}

export async function getPlayers(filters?: {
  league?: League;
  teamId?: string;
  featured?: boolean;
  trending?: boolean;
}): Promise<Player[]> {
  try {
    let result = await getAllPlayers();
    if (filters?.league) result = result.filter((p) => p.league === filters.league);
    if (filters?.teamId) result = result.filter((p) => p.teamId === filters.teamId);
    if (filters?.featured) result = result.filter((p) => p.featured);
    if (filters?.trending) result = result.filter((p) => p.trending);
    return result;
  } catch {
    let result = [...mockPlayers];
    if (filters?.league) result = result.filter((p) => p.league === filters.league);
    if (filters?.teamId) result = result.filter((p) => p.teamId === filters.teamId);
    if (filters?.featured) result = result.filter((p) => p.featured);
    if (filters?.trending) result = result.filter((p) => p.trending);
    return result;
  }
}

export async function getPlayer(slug: string): Promise<Player | null> {
  try {
    const players = await getAllPlayers();
    const player = players.find((p) => p.slug === slug || p.id === slug);
    if (!player) return null;

    // Attach team object
    let team: Team | undefined;
    try {
      const teams = await getTeams();
      team = teams.find((t) => t.id === player.teamId);
    } catch {
      // team stays undefined
    }

    return { ...player, team: team ?? undefined };
  } catch {
    const player = mockPlayers.find((p) => p.slug === slug || p.id === slug);
    if (!player) return null;
    return { ...player };
  }
}

export const getPlayerById = getPlayer;

export async function getFeaturedPlayers(): Promise<Player[]> {
  try {
    const players = await getAllPlayers();
    return players.filter((p) => p.featured);
  } catch {
    return mockPlayers.filter((p) => p.featured);
  }
}

export async function getTrendingPlayers(): Promise<Player[]> {
  try {
    const players = await getAllPlayers();
    return players.filter((p) => p.trending);
  } catch {
    return mockPlayers.filter((p) => p.trending);
  }
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  try {
    const players = await getAllPlayers();
    return players.filter((p) => p.teamId === teamId);
  } catch {
    return mockPlayers.filter((p) => p.teamId === teamId);
  }
}
