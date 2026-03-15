import type { Game, GameEvent } from '@/lib/types';

/**
 * ScoreCast: AI-style sports broadcast commentary generator.
 * Uses templates and event data to produce engaging, broadcast-style commentary.
 */

const SCORE_TEMPLATES = [
  'What a play! {description} -- the crowd is on its feet!',
  '{description}. That is textbook execution right there.',
  'BANG! {description}! This player is feeling it tonight.',
  '{description} -- and that is exactly what this team needed.',
  'Pure skill on display. {description}.',
  '{description}! You cannot guard that. Absolutely unstoppable.',
];

const TURNOVER_TEMPLATES = [
  'And the ball is loose! {description}. That could be a turning point.',
  '{description} -- a costly mistake that could shift the momentum.',
  'Uh oh! {description}. The coaching staff will not be happy about that one.',
  '{description}. That is the kind of play that changes ball games.',
];

const GENERAL_TEMPLATES = [
  '{description}. The intensity is ratcheting up.',
  '{description} -- a key moment as this game unfolds.',
  '{description}. Both teams are leaving everything on the floor.',
];

const FOUL_TEMPLATES = [
  '{description}. The referee was right on top of it.',
  '{description} -- and the whistle blows. Free throws coming up.',
];

const TIMEOUT_TEMPLATES = [
  '{description}. A smart move to regroup and draw something up.',
  '{description}. The coaching staff needs to settle their squad down.',
];

function pickTemplate(templates: string[]): string {
  return templates[Math.floor(Math.random() * templates.length)];
}

function fillTemplate(template: string, event: GameEvent): string {
  return template.replace('{description}', event.description);
}

export async function generateEventCommentary(event: GameEvent): Promise<string> {
  let templates: string[];

  switch (event.type) {
    case 'score':
    case 'touchdown':
      templates = SCORE_TEMPLATES;
      break;
    case 'turnover':
      templates = TURNOVER_TEMPLATES;
      break;
    case 'foul':
      templates = FOUL_TEMPLATES;
      break;
    case 'timeout':
      templates = TIMEOUT_TEMPLATES;
      break;
    default:
      templates = GENERAL_TEMPLATES;
      break;
  }

  return fillTemplate(pickTemplate(templates), event);
}

export async function generateGameSummary(
  game: Game,
  events: GameEvent[],
): Promise<string> {
  const homeName = game.homeTeam.name;
  const awayName = game.awayTeam.name;
  const homeScore = game.homeScore;
  const awayScore = game.awayScore;
  const diff = Math.abs(homeScore - awayScore);
  const leadTeam = homeScore > awayScore ? homeName : awayName;
  const trailTeam = homeScore > awayScore ? awayName : homeName;

  const scoringEvents = events.filter(
    (e) => e.type === 'score' || e.type === 'touchdown',
  );
  const turnovers = events.filter((e) => e.type === 'turnover');

  let summary = '';

  if (game.status === 'LIVE') {
    if (homeScore === awayScore) {
      summary = `We have a barnburner on our hands, folks! The ${homeName} and ${awayName} are deadlocked at ${homeScore} apiece.`;
    } else if (diff <= 5) {
      summary = `This one is going down to the wire. The ${leadTeam} cling to a slim ${diff}-point lead over the ${trailTeam}, ${homeScore}-${awayScore}.`;
    } else if (diff <= 15) {
      summary = `The ${leadTeam} are in command with a ${diff}-point cushion over the ${trailTeam}, ${homeScore}-${awayScore}. But there is plenty of game left to play.`;
    } else {
      summary = `The ${leadTeam} are rolling tonight, building a commanding ${diff}-point lead, ${homeScore}-${awayScore}. The ${trailTeam} need a miracle run to get back in this one.`;
    }
  } else if (game.status === 'FINAL') {
    if (diff <= 5) {
      summary = `What a thriller! The ${leadTeam} edged out the ${trailTeam} in a nail-biter, final score ${homeScore}-${awayScore}.`;
    } else {
      summary = `The ${leadTeam} took care of business against the ${trailTeam}, winning convincingly ${homeScore}-${awayScore}.`;
    }
  } else {
    summary = `The ${homeName} host the ${awayName} in what promises to be an exciting matchup.`;
  }

  // Add context from events
  if (scoringEvents.length > 0) {
    const recentScorer = scoringEvents[0];
    summary += ` ${recentScorer.description} was the latest highlight.`;
  }

  if (turnovers.length > 0) {
    summary += ` There have been ${turnovers.length} turnover${turnovers.length > 1 ? 's' : ''} so far -- ball security will be key down the stretch.`;
  }

  if (game.quarter && game.timeRemaining) {
    const period = game.league === 'NFL' ? 'quarter' : 'quarter';
    summary += ` We are in the ${getOrdinal(game.quarter)} ${period} with ${game.timeRemaining} on the clock.`;
  }

  return summary;
}

export async function generateMomentumNarrative(
  game: Game,
  momentum: 'home' | 'away' | 'neutral',
): Promise<string> {
  const homeName = game.homeTeam.name;
  const awayName = game.awayTeam.name;

  if (momentum === 'home') {
    return `The ${homeName} have seized control of this game. The energy in ${game.venue ?? 'the arena'} is electric right now, and the ${awayName} are struggling to find answers. When the ${homeName} are playing with this kind of rhythm, they are one of the toughest teams in the league to slow down.`;
  }

  if (momentum === 'away') {
    return `The ${awayName} have flipped the script and grabbed the momentum! They came into ${game.venue ?? 'this arena'} and are silencing the home crowd. The ${homeName} need to find a spark quickly before this one slips away.`;
  }

  return `Neither team has been able to establish sustained momentum. This is a chess match -- every possession matters, and the next big play could tilt the scales decisively. It is anyone's game right now.`;
}

function getOrdinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  if (n === 4) return '4th';
  return `${n}th`;
}
