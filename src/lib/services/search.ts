import { getTeams } from '@/lib/services/teams';
import { getPlayers } from '@/lib/services/players';
import { getArticles } from '@/lib/services/blog';
import type { SearchResult } from '@/lib/types';

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  try {
    const [teams, players, articles] = await Promise.all([
      getTeams(),
      getPlayers(),
      getArticles(),
    ]);

    // Search teams by name and city
    for (const team of teams) {
      if (
        team.name.toLowerCase().includes(q) ||
        team.city.toLowerCase().includes(q) ||
        team.abbreviation.toLowerCase().includes(q)
      ) {
        const leagueSlug = team.league.toLowerCase();
        results.push({
          type: 'team',
          id: team.id,
          title: team.name,
          subtitle: `${team.league} -- ${team.record}`,
          url: `/teams/${leagueSlug}/${team.slug}`,
        });
      }
    }

    // Search players by name
    for (const player of players) {
      if (
        player.name.toLowerCase().includes(q) ||
        player.firstName.toLowerCase().includes(q) ||
        player.lastName.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'player',
          id: player.id,
          title: player.name,
          subtitle: `${player.position} -- ${player.league}`,
          url: `/players/${player.slug}`,
        });
      }
    }

    // Search articles by title
    for (const article of articles) {
      if (
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'article',
          id: article.id,
          title: article.title,
          subtitle: `${article.category} -- ${article.readingTime} min read`,
          url: `/blog/${article.slug}`,
        });
      }
    }
  } catch {
    // If all fetches fail, return empty results
    return [];
  }

  return results;
}

export async function getTrendingSearches(): Promise<string[]> {
  return [
    'Jayson Tatum',
    'Celtics',
    'Eagles',
    'Saquon Barkley',
    'Shot IQ',
    'NBA Standings',
    'Luka Doncic',
    'Live Games',
  ];
}
