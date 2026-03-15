import { describe, it, expect } from 'vitest';
import { getTeams, getTeam, getFeaturedTeams, getStandings } from '@/lib/services/teams';
import { getPlayers, getPlayer, getTrendingPlayers, getPlayersByTeam } from '@/lib/services/players';
import {
  getGames,
  getGame,
  getLiveGames,
  getRecentGames,
  getUpcomingGames,
  getFeaturedGame,
} from '@/lib/services/games';
import { getArticles, getArticle, getFeaturedArticles } from '@/lib/services/blog';
import { getShotChartData, getShotChartSummary, getPlayersWithShotData } from '@/lib/services/shots';
import { searchAll, getTrendingSearches } from '@/lib/services/search';
import { getNBALeaders, getNFLLeaders } from '@/lib/services/stats';

describe('Teams Service', () => {
  it('returns all teams', async () => {
    const teams = await getTeams();
    expect(teams.length).toBeGreaterThan(0);
  });

  it('filters teams by NBA league', async () => {
    const teams = await getTeams('NBA');
    expect(teams.every((t) => t.league === 'NBA')).toBe(true);
  });

  it('filters teams by NFL league', async () => {
    const teams = await getTeams('NFL');
    expect(teams.every((t) => t.league === 'NFL')).toBe(true);
  });

  it('finds Celtics by slug', async () => {
    const team = await getTeam('boston-celtics');
    expect(team).not.toBeNull();
    expect(team!.name).toContain('Celtics');
  });

  it('returns featured teams', async () => {
    const teams = await getFeaturedTeams();
    expect(teams.length).toBeGreaterThan(0);
    expect(teams.every((t) => t.featured)).toBe(true);
  });

  it('returns standings sorted by win%', async () => {
    const standings = await getStandings('NBA');
    expect(standings.length).toBeGreaterThan(0);
    for (let i = 1; i < standings.length; i++) {
      const prevPct = standings[i - 1].wins / (standings[i - 1].wins + standings[i - 1].losses);
      const currPct = standings[i].wins / (standings[i].wins + standings[i].losses);
      expect(prevPct).toBeGreaterThanOrEqual(currPct);
    }
  });
});

describe('Players Service', () => {
  it('returns all players', async () => {
    const players = await getPlayers();
    expect(players.length).toBeGreaterThan(0);
  });

  it('finds Jayson Tatum', async () => {
    const player = await getPlayer('jayson-tatum');
    expect(player).not.toBeNull();
    expect(player!.name).toBe('Jayson Tatum');
    expect(player!.teamId).toBe('bos');
  });

  it('returns trending players', async () => {
    const players = await getTrendingPlayers();
    expect(players.length).toBeGreaterThan(0);
    expect(players.every((p) => p.trending)).toBe(true);
  });

  it('returns players by team', async () => {
    const players = await getPlayersByTeam('bos');
    expect(players.length).toBeGreaterThanOrEqual(2);
    expect(players.every((p) => p.teamId === 'bos')).toBe(true);
  });
});

describe('Games Service', () => {
  it('returns all games', async () => {
    const games = await getGames();
    expect(games.length).toBeGreaterThan(0);
  });

  it('returns live games', async () => {
    const games = await getLiveGames();
    expect(games.every((g) => g.status === 'LIVE')).toBe(true);
  });

  it('returns recent games sorted by date descending', async () => {
    const games = await getRecentGames();
    expect(games.every((g) => g.status === 'FINAL')).toBe(true);
  });

  it('returns upcoming games', async () => {
    const games = await getUpcomingGames();
    expect(games.every((g) => g.status === 'SCHEDULED')).toBe(true);
  });

  it('returns a featured game', async () => {
    const game = await getFeaturedGame();
    expect(game).not.toBeNull();
  });

  it('finds a game by id', async () => {
    const game = await getGame('nba-live-1');
    expect(game).not.toBeNull();
  });
});

describe('Blog Service', () => {
  it('returns articles', async () => {
    const articles = await getArticles();
    expect(articles.length).toBeGreaterThan(0);
  });

  it('finds article by slug', async () => {
    const article = await getArticle('jaylen-brown-mvp-conversation');
    expect(article).not.toBeNull();
    expect(article!.title).toContain('Jaylen Brown');
  });

  it('returns featured articles', async () => {
    const articles = await getFeaturedArticles();
    expect(articles.length).toBeGreaterThan(0);
  });
});

describe('Shots Service', () => {
  it('returns shot data for Tatum', async () => {
    const shots = await getShotChartData('jayson-tatum');
    expect(shots.length).toBeGreaterThan(50);
  });

  it('returns shot chart summary', async () => {
    const summary = await getShotChartSummary('jayson-tatum', 'Jayson Tatum');
    expect(summary.totalShots).toBeGreaterThan(0);
    expect(summary.zones.length).toBeGreaterThan(0);
    expect(summary.overallPct).toBeGreaterThan(0);
    expect(summary.overallPct).toBeLessThan(100);
  });

  it('lists players with shot data', async () => {
    const players = await getPlayersWithShotData();
    expect(players.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Search Service', () => {
  it('searches for Celtics', async () => {
    const results = await searchAll('Celtics');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.includes('Celtics'))).toBe(true);
  });

  it('searches for Tatum', async () => {
    const results = await searchAll('Tatum');
    expect(results.some((r) => r.title.includes('Tatum'))).toBe(true);
  });

  it('returns trending searches', async () => {
    const trends = await getTrendingSearches();
    expect(trends.length).toBeGreaterThan(0);
  });
});

describe('Stats Service', () => {
  it('returns NBA scoring leaders', async () => {
    const leaders = await getNBALeaders('ppg', 5);
    expect(leaders.length).toBe(5);
    expect(leaders[0].value).toBeGreaterThanOrEqual(leaders[1].value);
  });

  it('returns NFL passing leaders', async () => {
    const leaders = await getNFLLeaders('passingYards', 5);
    expect(leaders.length).toBeGreaterThanOrEqual(1);
  });
});
