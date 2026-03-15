/**
 * Ball Intelligence Data Agents
 *
 * A system of AI-powered agents that keep the site's data fresh.
 *
 * Agent 1: ScoreKeeper — Polls ESPN every request for real-time scores (instant, free)
 * Agent 2: StandingsAgent — Updates team standings via Claude web search (every 6h)
 * Agent 3: PlayerStatsAgent — Updates player stats via Claude web search (every 6h)
 * Agent 4: NewsAgent — Fetches latest sports news via Claude web search (every 6h)
 * Agent 5: RecapAgent — Generates AI recaps when games finish (on-demand)
 * Agent 6: LiveMonitor — Detects active Celtics/Eagles games for priority updates
 */

import { fetchESPNScoreboard } from './espn';
import {
  fetchNBATeams,
  fetchNFLTeams,
  fetchNBAPlayers,
  fetchNFLPlayers,
  fetchLatestSportsNews,
} from './web-data';
import { invalidateCache, getCached, setCache, SIX_HOURS, ONE_HOUR } from './cache';
import { generateGameRecap } from './ai';
import type { Game } from '@/lib/types';

// ============================================================
// Agent 1: ScoreKeeper — real-time scores from ESPN
// ============================================================
export async function runScoreKeeper(): Promise<{
  nbaGames: Game[];
  nflGames: Game[];
  liveCount: number;
}> {
  const [nba, nfl] = await Promise.all([
    fetchESPNScoreboard('NBA'),
    fetchESPNScoreboard('NFL'),
  ]);

  const allGames = [...nba, ...nfl];
  const liveGames = allGames.filter((g) => g.status === 'LIVE');

  // Cache the latest scores for server-side pages
  setCache('espn-nba-scores', nba, 15 * 1000); // 15s cache
  setCache('espn-nfl-scores', nfl, 15 * 1000);
  setCache('espn-all-scores', allGames, 15 * 1000);

  return { nbaGames: nba, nflGames: nfl, liveCount: liveGames.length };
}

// ============================================================
// Agent 2: StandingsAgent — team standings + records
// ============================================================
export async function runStandingsAgent(): Promise<{ nbaCount: number; nflCount: number }> {
  // Invalidate old data
  invalidateCache('nba-teams');
  invalidateCache('nfl-teams');

  const [nba, nfl] = await Promise.all([fetchNBATeams(), fetchNFLTeams()]);

  return { nbaCount: nba.length, nflCount: nfl.length };
}

// ============================================================
// Agent 3: PlayerStatsAgent — player season stats
// ============================================================
export async function runPlayerStatsAgent(): Promise<{ nbaCount: number; nflCount: number }> {
  invalidateCache('nba-players');
  invalidateCache('nfl-players');

  const [nba, nfl] = await Promise.all([fetchNBAPlayers(), fetchNFLPlayers()]);

  return { nbaCount: nba.length, nflCount: nfl.length };
}

// ============================================================
// Agent 4: NewsAgent — latest sports news
// ============================================================
export async function runNewsAgent(): Promise<{ articleCount: number }> {
  invalidateCache('sports-news');

  const articles = await fetchLatestSportsNews();

  return { articleCount: articles.length };
}

// ============================================================
// Agent 5: RecapAgent — AI recaps for finished games
// ============================================================
export async function runRecapAgent(games: Game[]): Promise<{ recapsGenerated: number }> {
  const finishedGames = games.filter((g) => g.status === 'FINAL');
  let recapsGenerated = 0;

  for (const game of finishedGames) {
    const cacheKey = `recap-${game.id}`;
    const existing = getCached<string>(cacheKey);
    if (existing) continue; // Already have a recap

    try {
      const events = game.events?.map((e) => e.description) || [];
      const recap = await generateGameRecap(
        game.homeTeam.name,
        game.awayTeam.name,
        game.homeScore,
        game.awayScore,
        game.league,
        events
      );
      if (recap) {
        setCache(cacheKey, recap, SIX_HOURS);
        recapsGenerated++;
      }
    } catch {
      // Skip failed recaps
    }
  }

  return { recapsGenerated };
}

// ============================================================
// Agent 6: LiveMonitor — priority monitoring for favorite teams
// ============================================================
export async function runLiveMonitor(): Promise<{
  celticsPlaying: boolean;
  eaglesPlaying: boolean;
  celticsGame: Game | null;
  eaglesGame: Game | null;
}> {
  const [nba, nfl] = await Promise.all([
    fetchESPNScoreboard('NBA'),
    fetchESPNScoreboard('NFL'),
  ]);

  const celticsGame = nba.find(
    (g) =>
      g.status === 'LIVE' &&
      (g.homeTeam.abbreviation === 'BOS' || g.awayTeam.abbreviation === 'BOS')
  ) || null;

  const eaglesGame = nfl.find(
    (g) =>
      g.status === 'LIVE' &&
      (g.homeTeam.abbreviation === 'PHI' || g.awayTeam.abbreviation === 'PHI')
  ) || null;

  if (celticsGame) setCache('celtics-live-game', celticsGame, 30 * 1000);
  if (eaglesGame) setCache('eagles-live-game', eaglesGame, 30 * 1000);

  return {
    celticsPlaying: !!celticsGame,
    eaglesPlaying: !!eaglesGame,
    celticsGame,
    eaglesGame,
  };
}

// ============================================================
// Master Orchestrator — runs all agents based on schedule
// ============================================================
export async function runAllAgents(force = false): Promise<{
  timestamp: string;
  scores: Awaited<ReturnType<typeof runScoreKeeper>>;
  standings: Awaited<ReturnType<typeof runStandingsAgent>> | null;
  players: Awaited<ReturnType<typeof runPlayerStatsAgent>> | null;
  news: Awaited<ReturnType<typeof runNewsAgent>> | null;
  recaps: Awaited<ReturnType<typeof runRecapAgent>> | null;
  liveMonitor: Awaited<ReturnType<typeof runLiveMonitor>>;
}> {
  // Always run: ScoreKeeper + LiveMonitor (fast, ESPN-based)
  const [scores, liveMonitor] = await Promise.all([
    runScoreKeeper(),
    runLiveMonitor(),
  ]);

  // Run slow agents only if forced or cache is stale (every 6h)
  let standings = null;
  let players = null;
  let news = null;
  let recaps = null;

  const lastFullRefresh = getCached<number>('last-full-refresh');
  const needsFullRefresh = force || !lastFullRefresh;

  if (needsFullRefresh) {
    // Run these sequentially to avoid rate limits
    try {
      standings = await runStandingsAgent();
    } catch (e) { console.error('[agents] Standings failed:', e); }

    try {
      players = await runPlayerStatsAgent();
    } catch (e) { console.error('[agents] Players failed:', e); }

    try {
      news = await runNewsAgent();
    } catch (e) { console.error('[agents] News failed:', e); }

    // Generate recaps for today's finished games
    try {
      const allGames = [...scores.nbaGames, ...scores.nflGames];
      recaps = await runRecapAgent(allGames);
    } catch (e) { console.error('[agents] Recaps failed:', e); }

    setCache('last-full-refresh', Date.now(), SIX_HOURS);
  }

  return {
    timestamp: new Date().toISOString(),
    scores,
    standings,
    players,
    news,
    recaps,
    liveMonitor,
  };
}
