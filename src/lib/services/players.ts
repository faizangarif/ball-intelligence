import { fetchESPNPlayers } from '@/lib/services/espn';
import { mockPlayers } from '@/lib/data/mock/players';
import type { Player, League } from '@/lib/types';

async function getAllPlayers(): Promise<Player[]> {
  try {
    // Try ESPN for real current player data
    const [nba, nfl] = await Promise.all([
      fetchESPNPlayers('NBA').catch(() => []),
      fetchESPNPlayers('NFL').catch(() => []),
    ]);

    const espnPlayers = [...nba, ...nfl];

    // Merge: ESPN players override mock players with same slug, keep mock players ESPN doesn't have
    const espnSlugs = new Set(espnPlayers.map((p) => p.slug));
    const mockOnly = mockPlayers.filter((p) => !espnSlugs.has(p.slug));

    return [...espnPlayers, ...mockOnly];
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
  let result = await getAllPlayers();
  if (filters?.league) result = result.filter((p) => p.league === filters.league);
  if (filters?.teamId) result = result.filter((p) => p.teamId === filters.teamId);
  if (filters?.featured) result = result.filter((p) => p.featured);
  if (filters?.trending) result = result.filter((p) => p.trending);
  return result;
}

export async function getPlayer(slug: string): Promise<Player | null> {
  const players = await getAllPlayers();
  const player = players.find((p) => p.slug === slug || p.id === slug);
  if (!player) return null;

  const { getTeam } = await import('./teams');
  const team = await getTeam(player.teamId);
  return { ...player, team: team ?? undefined };
}

export const getPlayerById = getPlayer;

export async function getFeaturedPlayers(): Promise<Player[]> {
  return (await getAllPlayers()).filter((p) => p.featured);
}

export async function getTrendingPlayers(): Promise<Player[]> {
  return (await getAllPlayers()).filter((p) => p.trending);
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  return (await getAllPlayers()).filter((p) => p.teamId === teamId);
}
