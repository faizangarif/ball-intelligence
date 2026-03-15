import { fetchCelticsLiveGame, fetchEaglesLiveGame } from '@/lib/services/web-data';
import { getGame } from '@/lib/services/games';
import { getPlayers } from '@/lib/services/players';
import { mockGameEvents } from '@/lib/data/mock/events';
import { mockPlayers } from '@/lib/data/mock/players';
import type { Game, GameEvent, LiveGameState, Player } from '@/lib/types';

export async function getLiveGameState(
  gameId: string,
): Promise<LiveGameState | null> {
  try {
    // Try to get game from the updated games service (which uses web data)
    let game = await getGame(gameId);

    // Also check for Celtics/Eagles live games if relevant
    if (!game) {
      try {
        const [celticsGame, eaglesGame] = await Promise.all([
          fetchCelticsLiveGame(),
          fetchEaglesLiveGame(),
        ]);
        if (celticsGame && celticsGame.id === gameId) game = celticsGame;
        else if (eaglesGame && eaglesGame.id === gameId) game = eaglesGame;
      } catch {
        // ignore
      }
    }

    if (!game) return null;

    const events = game.events ?? mockGameEvents[gameId] ?? [];

    // Try to get real player data for key player extraction
    let allPlayers: Player[];
    try {
      allPlayers = await getPlayers();
    } catch {
      allPlayers = [...mockPlayers];
    }

    const momentum = calculateMomentum(events, game);
    const aiCommentary = generateCommentary(events, game);
    const keyPlayers = extractKeyPlayers(events, game, allPlayers);
    const summary = generateSummary(game, events, momentum, allPlayers);

    return {
      game,
      events,
      lastUpdate: new Date().toISOString(),
      momentum,
      keyPlayers,
      aiCommentary,
      summary,
    };
  } catch {
    return null;
  }
}

function calculateMomentum(
  events: GameEvent[],
  game: Game,
): 'home' | 'away' | 'neutral' {
  const recentEvents = events.slice(0, 4);
  if (recentEvents.length === 0) return 'neutral';

  const homeTeamId = game.homeTeam.id;
  const awayTeamId = game.awayTeam.id;

  let homeCount = 0;
  let awayCount = 0;

  for (const event of recentEvents) {
    if (!event.teamId) continue;
    if (event.teamId === homeTeamId) {
      if (event.type === 'score' || event.type === 'turnover' || event.type === 'touchdown') {
        homeCount++;
      }
    } else if (event.teamId === awayTeamId) {
      if (event.type === 'score' || event.type === 'turnover' || event.type === 'touchdown') {
        awayCount++;
      }
    }
  }

  if (homeCount > awayCount) return 'home';
  if (awayCount > homeCount) return 'away';
  return 'neutral';
}

export function generateCommentary(
  events: GameEvent[],
  game: Game,
): string[] {
  const commentary: string[] = [];
  const recentEvents = events.slice(0, 5);
  const homeName = game.homeTeam.name;
  const awayName = game.awayTeam.name;
  const homeScore = game.homeScore;
  const awayScore = game.awayScore;
  const leadTeam = homeScore > awayScore ? homeName : homeScore < awayScore ? awayName : null;
  const leadAmount = Math.abs(homeScore - awayScore);

  // Generate commentary from recent events
  for (const event of recentEvents) {
    if (event.type === 'score' || event.type === 'touchdown') {
      const leadsTrails =
        homeScore > awayScore
          ? `${homeName} leads ${homeScore}-${awayScore}`
          : homeScore < awayScore
            ? `${awayName} leads ${awayScore}-${homeScore}`
            : `Tied at ${homeScore}`;
      commentary.push(`${event.description} -- ${leadsTrails}`);
    } else if (event.type === 'turnover') {
      commentary.push(`Turnover: ${event.description}`);
    }
  }

  // Add momentum commentary
  if (leadTeam && leadAmount >= 5) {
    commentary.push(
      `${leadTeam} holds a ${leadAmount}-point advantage and is controlling the tempo.`,
    );
  } else if (leadTeam) {
    commentary.push(`Tight game -- ${leadTeam} leads by just ${leadAmount}.`);
  } else {
    commentary.push('We have a dead heat -- neither team is willing to blink.');
  }

  // Add quarter context
  if (game.quarter && game.timeRemaining) {
    const periodLabel = 'quarter';
    commentary.push(
      `${game.timeRemaining} remaining in the ${getOrdinal(game.quarter)} ${periodLabel}.`,
    );
  }

  return commentary.slice(0, 5);
}

function generateSummary(
  game: Game,
  events: GameEvent[],
  momentum: 'home' | 'away' | 'neutral',
  allPlayers: Player[],
): string {
  const homeName = game.homeTeam.name;
  const awayName = game.awayTeam.name;
  const leadTeam = game.homeScore > game.awayScore ? homeName : awayName;
  const trailTeam = game.homeScore > game.awayScore ? awayName : homeName;
  const diff = Math.abs(game.homeScore - game.awayScore);

  if (game.homeScore === game.awayScore) {
    return `The ${homeName} and ${awayName} are locked in a tight battle, tied at ${game.homeScore} apiece. Neither team is giving an inch.`;
  }

  const momentumTeam =
    momentum === 'home'
      ? homeName
      : momentum === 'away'
        ? awayName
        : null;

  let summary = `The ${leadTeam} hold a ${diff}-point lead over the ${trailTeam}, ${game.homeScore}-${game.awayScore}.`;

  if (momentumTeam) {
    summary += ` Momentum is firmly with the ${momentumTeam}.`;
  }

  // Highlight key player from recent events
  const scoringEvents = events.filter((e) => e.type === 'score' || e.type === 'touchdown');
  if (scoringEvents.length > 0 && scoringEvents[0].playerId) {
    const playerSlug = scoringEvents[0].playerId;
    const player = allPlayers.find((p) => p.slug === playerSlug || p.id === playerSlug);
    if (player) {
      summary += ` ${player.name} has been the story of the game.`;
    }
  }

  return summary;
}

function extractKeyPlayers(
  events: GameEvent[],
  _game: Game,
  allPlayers: Player[],
): { name: string; stats: Record<string, number> }[] {
  const playerEventCounts: Record<
    string,
    { scores: number; events: number; teamId: string }
  > = {};

  for (const event of events) {
    if (!event.playerId) continue;
    if (!playerEventCounts[event.playerId]) {
      playerEventCounts[event.playerId] = {
        scores: 0,
        events: 0,
        teamId: event.teamId ?? '',
      };
    }
    playerEventCounts[event.playerId].events++;
    if (event.type === 'score' || event.type === 'touchdown') {
      playerEventCounts[event.playerId].scores++;
    }
  }

  // Get top players by event involvement
  const topPlayerIds = Object.entries(playerEventCounts)
    .sort(([, a], [, b]) => b.events - a.events)
    .slice(0, 4)
    .map(([id]) => id);

  return topPlayerIds.map((playerId) => {
    const player = allPlayers.find(
      (p) => p.slug === playerId || p.id === playerId,
    );
    const counts = playerEventCounts[playerId];

    if (player) {
      const stats: Record<string, number> = {
        scoringPlays: counts.scores,
        totalInvolvement: counts.events,
      };

      if (player.seasonStats.ppg !== undefined) stats.ppg = player.seasonStats.ppg;
      if (player.seasonStats.rpg !== undefined) stats.rpg = player.seasonStats.rpg;
      if (player.seasonStats.apg !== undefined) stats.apg = player.seasonStats.apg;

      return { name: player.name, stats };
    }

    return {
      name: playerId,
      stats: {
        scoringPlays: counts.scores,
        totalInvolvement: counts.events,
      },
    };
  });
}

function getOrdinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  if (n === 4) return '4th';
  return `${n}th`;
}
