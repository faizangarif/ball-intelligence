import { fetchESPNLeaders } from '@/lib/services/espn';
import { getPlayers } from '@/lib/services/players';
import { getTeams } from '@/lib/services/teams';
import type { StatLeader, League } from '@/lib/types';

// Cache ESPN leaders in memory per request
let nbaLeadersCache: Record<string, StatLeader[]> | null = null;
let nflLeadersCache: Record<string, StatLeader[]> | null = null;

async function getESPNLeaders(league: League): Promise<Record<string, StatLeader[]>> {
  if (league === 'NBA' && nbaLeadersCache) return nbaLeadersCache;
  if (league === 'NFL' && nflLeadersCache) return nflLeadersCache;

  try {
    const leaders = await fetchESPNLeaders(league);
    if (Object.keys(leaders).length > 0) {
      if (league === 'NBA') nbaLeadersCache = leaders;
      else nflLeadersCache = leaders;
      return leaders;
    }
  } catch {
    // Fall through to player-based approach
  }

  // Fallback: compute from player data
  return computeLeadersFromPlayers(league);
}

async function computeLeadersFromPlayers(league: League): Promise<Record<string, StatLeader[]>> {
  const [allPlayers, allTeams] = await Promise.all([
    getPlayers({ league }),
    getTeams(league),
  ]);

  const result: Record<string, StatLeader[]> = {};
  const statKeys = league === 'NBA'
    ? ['ppg', 'rpg', 'apg', 'spg', 'bpg', 'fgPct', 'threePct']
    : ['passingYards', 'passingTDs', 'rushingYards', 'rushingTDs', 'receivingYards'];

  for (const stat of statKeys) {
    const players = allPlayers.filter((p) => p.seasonStats[stat] !== undefined && p.seasonStats[stat] > 0);
    const sorted = [...players].sort((a, b) => (b.seasonStats[stat] ?? 0) - (a.seasonStats[stat] ?? 0));
    result[stat] = sorted.slice(0, 10).map((p, i) => {
      const team = allTeams.find((t) => t.id === p.teamId);
      return { rank: i + 1, playerName: p.name, playerSlug: p.slug, team: team?.abbreviation ?? '', value: p.seasonStats[stat] ?? 0 };
    });
  }

  return result;
}

export async function getNBALeaders(stat: string, limit = 10): Promise<StatLeader[]> {
  const leaders = await getESPNLeaders('NBA');
  return (leaders[stat] || []).slice(0, limit);
}

export async function getNFLLeaders(stat: string, limit = 10): Promise<StatLeader[]> {
  const leaders = await getESPNLeaders('NFL');
  return (leaders[stat] || []).slice(0, limit);
}

export async function getStatCategories(league: League): Promise<{ key: string; label: string }[]> {
  if (league === 'NBA') {
    return [
      { key: 'ppg', label: 'Points Per Game' },
      { key: 'rpg', label: 'Rebounds Per Game' },
      { key: 'apg', label: 'Assists Per Game' },
      { key: 'spg', label: 'Steals Per Game' },
      { key: 'bpg', label: 'Blocks Per Game' },
      { key: 'fgPct', label: 'Field Goal %' },
      { key: 'threePct', label: 'Three-Point %' },
    ];
  }
  return [
    { key: 'passingYards', label: 'Passing Yards' },
    { key: 'passingTDs', label: 'Passing Touchdowns' },
    { key: 'rushingYards', label: 'Rushing Yards' },
    { key: 'rushingTDs', label: 'Rushing Touchdowns' },
    { key: 'receivingYards', label: 'Receiving Yards' },
  ];
}
