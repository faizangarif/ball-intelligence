import { getCached } from '@/lib/services/cache';
import { mockPlayers } from '@/lib/data/mock/players';
import type { Player, League } from '@/lib/types';

// Read from cache (populated by agents) or fall back to mock data instantly
function getAllPlayers(): Player[] {
  const cachedNBA = getCached<Player[]>('nba-players');
  const cachedNFL = getCached<Player[]>('nfl-players');

  const nba = cachedNBA && cachedNBA.length > 0 ? cachedNBA : mockPlayers.filter((p) => p.league === 'NBA');
  const nfl = cachedNFL && cachedNFL.length > 0 ? cachedNFL : mockPlayers.filter((p) => p.league === 'NFL');

  return [...nba, ...nfl];
}

export async function getPlayers(filters?: {
  league?: League;
  teamId?: string;
  featured?: boolean;
  trending?: boolean;
}): Promise<Player[]> {
  let result = getAllPlayers();
  if (filters?.league) result = result.filter((p) => p.league === filters.league);
  if (filters?.teamId) result = result.filter((p) => p.teamId === filters.teamId);
  if (filters?.featured) result = result.filter((p) => p.featured);
  if (filters?.trending) result = result.filter((p) => p.trending);
  return result;
}

export async function getPlayer(slug: string): Promise<Player | null> {
  const players = getAllPlayers();
  const player = players.find((p) => p.slug === slug || p.id === slug);
  if (!player) return null;

  // Attach team
  const { getTeam } = await import('./teams');
  const team = await getTeam(player.teamId);
  return { ...player, team: team ?? undefined };
}

export const getPlayerById = getPlayer;

export async function getFeaturedPlayers(): Promise<Player[]> {
  return getAllPlayers().filter((p) => p.featured);
}

export async function getTrendingPlayers(): Promise<Player[]> {
  return getAllPlayers().filter((p) => p.trending);
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  return getAllPlayers().filter((p) => p.teamId === teamId);
}
