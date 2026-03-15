import { fetchAllLiveScores } from '@/lib/services/espn';
import { fetchTodaysNBAGames, fetchTodaysNFLGames } from '@/lib/services/web-data';
import { mockGames } from '@/lib/data/mock/games';
import { mockGameEvents } from '@/lib/data/mock/events';
import type { Game, GameStatus, League } from '@/lib/types';

async function getAllGames(): Promise<Game[]> {
  try {
    // ESPN is primary source — real-time, fast, free
    const espn = await fetchAllLiveScores();
    if (espn.games.length > 0) return espn.games;

    // Fall back to Claude web search
    const [nba, nfl] = await Promise.all([fetchTodaysNBAGames(), fetchTodaysNFLGames()]);
    const games = [...nba, ...nfl];
    if (games.length > 0) return games;

    return [...mockGames];
  } catch {
    return [...mockGames];
  }
}

export async function getGames(filters?: {
  league?: League;
  status?: GameStatus;
  featured?: boolean;
}): Promise<Game[]> {
  let result = await getAllGames();
  if (filters?.league) result = result.filter((g) => g.league === filters.league);
  if (filters?.status) result = result.filter((g) => g.status === filters.status);
  if (filters?.featured) result = result.filter((g) => g.featured);
  return result;
}

export async function getGame(id: string): Promise<Game | null> {
  const games = await getAllGames();
  const game = games.find((g) => g.id === id);
  if (game) {
    const events = mockGameEvents[id] ?? [];
    return { ...game, events: game.events?.length ? game.events : events };
  }
  const mockGame = mockGames.find((g) => g.id === id);
  if (!mockGame) return null;
  return { ...mockGame, events: mockGameEvents[id] ?? [] };
}

export const getGameById = getGame;

export async function getLiveGames(league?: League): Promise<Game[]> {
  const allGames = await getAllGames();
  let games = allGames.filter((g) => g.status === 'LIVE');
  if (league) games = games.filter((g) => g.league === league);
  return games;
}

export async function getUpcomingGames(league?: League): Promise<Game[]> {
  const allGames = await getAllGames();
  let games = allGames.filter((g) => g.status === 'SCHEDULED');
  if (league) games = games.filter((g) => g.league === league);
  return games.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export async function getRecentGames(league?: League): Promise<Game[]> {
  const allGames = await getAllGames();
  let games = allGames.filter((g) => g.status === 'FINAL');
  if (league) games = games.filter((g) => g.league === league);
  return games.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export async function getFeaturedGame(): Promise<Game | null> {
  const allGames = await getAllGames();

  // Priority: live Celtics/Eagles game > any live featured > any live > most recent final
  const liveFav = allGames.find(
    (g) => g.status === 'LIVE' && (g.homeTeam.abbreviation === 'BOS' || g.awayTeam.abbreviation === 'BOS' || g.homeTeam.abbreviation === 'PHI' || g.awayTeam.abbreviation === 'PHI')
  );
  if (liveFav) return liveFav;

  const liveFeatured = allGames.find((g) => g.status === 'LIVE' && g.featured);
  if (liveFeatured) return liveFeatured;

  const anyLive = allGames.find((g) => g.status === 'LIVE');
  if (anyLive) return anyLive;

  const finals = allGames
    .filter((g) => g.status === 'FINAL')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  return finals[0] ?? null;
}
