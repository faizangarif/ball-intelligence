import { getPlayers } from '@/lib/services/players';
import { getTeams } from '@/lib/services/teams';
import type { StatLeader, League } from '@/lib/types';

export async function getNBALeaders(
  stat: string,
  limit: number = 10,
): Promise<StatLeader[]> {
  return getLeadersByLeague('NBA', stat, limit);
}

export async function getNFLLeaders(
  stat: string,
  limit: number = 10,
): Promise<StatLeader[]> {
  return getLeadersByLeague('NFL', stat, limit);
}

async function getLeadersByLeague(
  league: League,
  stat: string,
  limit: number,
): Promise<StatLeader[]> {
  try {
    const [allPlayers, allTeams] = await Promise.all([
      getPlayers({ league }),
      getTeams(league),
    ]);

    const players = allPlayers.filter(
      (p) => p.seasonStats[stat] !== undefined,
    );

    const sorted = [...players].sort(
      (a, b) => (b.seasonStats[stat] ?? 0) - (a.seasonStats[stat] ?? 0),
    );

    return sorted.slice(0, limit).map((p, index) => {
      const team = allTeams.find((t) => t.id === p.teamId);
      return {
        rank: index + 1,
        playerName: p.name,
        playerSlug: p.slug,
        team: team?.abbreviation ?? '',
        value: p.seasonStats[stat] ?? 0,
      };
    });
  } catch {
    // Return empty on failure - the caller can handle it
    return [];
  }
}

export async function getStatCategories(
  league: League,
): Promise<{ key: string; label: string }[]> {
  if (league === 'NBA') {
    return [
      { key: 'ppg', label: 'Points Per Game' },
      { key: 'rpg', label: 'Rebounds Per Game' },
      { key: 'apg', label: 'Assists Per Game' },
      { key: 'spg', label: 'Steals Per Game' },
      { key: 'bpg', label: 'Blocks Per Game' },
      { key: 'fgPct', label: 'Field Goal %' },
      { key: 'threePct', label: 'Three-Point %' },
      { key: 'ftPct', label: 'Free Throw %' },
    ];
  }

  return [
    { key: 'passingYards', label: 'Passing Yards' },
    { key: 'passingTDs', label: 'Passing Touchdowns' },
    { key: 'rushingYards', label: 'Rushing Yards' },
    { key: 'rushingTDs', label: 'Rushing Touchdowns' },
    { key: 'receptions', label: 'Receptions' },
    { key: 'receivingYards', label: 'Receiving Yards' },
    { key: 'receivingTDs', label: 'Receiving Touchdowns' },
    { key: 'completionPct', label: 'Completion %' },
    { key: 'qbRating', label: 'QB Rating' },
  ];
}
