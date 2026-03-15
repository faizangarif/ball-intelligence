/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Game, Team, GameEvent } from '@/lib/types';

const NBA_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
const NFL_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

// Team color map for teams ESPN returns
const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  BOS: { primary: '#007A33', secondary: '#BA9653' },
  BKN: { primary: '#000000', secondary: '#FFFFFF' },
  NYK: { primary: '#006BB6', secondary: '#F58426' },
  PHI: { primary: '#006BB6', secondary: '#ED174C' },
  TOR: { primary: '#CE1141', secondary: '#000000' },
  CHI: { primary: '#CE1141', secondary: '#000000' },
  CLE: { primary: '#860038', secondary: '#041E42' },
  DET: { primary: '#C8102E', secondary: '#1D42BA' },
  IND: { primary: '#002D62', secondary: '#FDBB30' },
  MIL: { primary: '#00471B', secondary: '#EEE1C6' },
  ATL: { primary: '#E03A3E', secondary: '#C1D32F' },
  CHA: { primary: '#1D1160', secondary: '#00788C' },
  MIA: { primary: '#98002E', secondary: '#F9A01B' },
  ORL: { primary: '#0077C0', secondary: '#C4CED4' },
  WAS: { primary: '#002B5C', secondary: '#E31837' },
  DAL: { primary: '#00538C', secondary: '#002B5E' },
  HOU: { primary: '#CE1141', secondary: '#000000' },
  MEM: { primary: '#5D76A9', secondary: '#12173F' },
  NOP: { primary: '#0C2340', secondary: '#C8102E' },
  SAS: { primary: '#C4CED4', secondary: '#000000' },
  DEN: { primary: '#0E2240', secondary: '#FEC524' },
  MIN: { primary: '#0C2340', secondary: '#236192' },
  OKC: { primary: '#007AC1', secondary: '#EF6100' },
  POR: { primary: '#E03A3E', secondary: '#000000' },
  UTA: { primary: '#002B5C', secondary: '#00471B' },
  GSW: { primary: '#1D428A', secondary: '#FFC72C' },
  LAC: { primary: '#C8102E', secondary: '#1D428A' },
  LAL: { primary: '#552583', secondary: '#FDB927' },
  PHX: { primary: '#1D1160', secondary: '#E56020' },
  SAC: { primary: '#5A2D81', secondary: '#63727A' },
};

const NFL_COLORS: Record<string, { primary: string; secondary: string }> = {
  PHI: { primary: '#004C54', secondary: '#A5ACAF' },
  KC: { primary: '#E31837', secondary: '#FFB81C' },
  BUF: { primary: '#00338D', secondary: '#C60C30' },
  BAL: { primary: '#241773', secondary: '#9E7C0C' },
  DAL: { primary: '#003594', secondary: '#869397' },
  SF: { primary: '#AA0000', secondary: '#B3995D' },
  DET: { primary: '#0076B6', secondary: '#B0B7BC' },
  GB: { primary: '#203731', secondary: '#FFB612' },
  MIN: { primary: '#4F2683', secondary: '#FFC62F' },
  SEA: { primary: '#002244', secondary: '#69BE28' },
  WAS: { primary: '#5A1414', secondary: '#FFB612' },
  PIT: { primary: '#FFB612', secondary: '#101820' },
  DEN: { primary: '#FB4F14', secondary: '#002244' },
  LAC: { primary: '#0080C6', secondary: '#FFC20E' },
  MIA: { primary: '#008E97', secondary: '#FC4C02' },
  CIN: { primary: '#FB4F14', secondary: '#000000' },
  HOU: { primary: '#03202F', secondary: '#A71930' },
  TEN: { primary: '#0C2340', secondary: '#4B92DB' },
  IND: { primary: '#002C5F', secondary: '#A2AAAD' },
  JAX: { primary: '#006778', secondary: '#D7A22A' },
  NE: { primary: '#002244', secondary: '#C60C30' },
  NYJ: { primary: '#125740', secondary: '#000000' },
  NYG: { primary: '#0B2265', secondary: '#A71930' },
  LV: { primary: '#000000', secondary: '#A5ACAF' },
  CLE: { primary: '#311D00', secondary: '#FF3C00' },
  NO: { primary: '#D3BC8D', secondary: '#101820' },
  TB: { primary: '#D50A0A', secondary: '#FF7900' },
  CAR: { primary: '#0085CA', secondary: '#101820' },
  ATL: { primary: '#A71930', secondary: '#000000' },
  ARI: { primary: '#97233F', secondary: '#000000' },
  CHI: { primary: '#0B162A', secondary: '#C83803' },
  LAR: { primary: '#003594', secondary: '#FFA300' },
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function mapEspnStatus(status: string): 'LIVE' | 'FINAL' | 'SCHEDULED' | 'POSTPONED' {
  const s = status.toLowerCase();
  if (s.includes('in progress') || s.includes('halftime') || s.includes('end of')) return 'LIVE';
  if (s.includes('final')) return 'FINAL';
  if (s.includes('postponed') || s.includes('canceled')) return 'POSTPONED';
  return 'SCHEDULED';
}

function parseEspnTeam(espnTeam: any, league: 'NBA' | 'NFL'): Team {
  const abbr = espnTeam.team?.abbreviation || '';
  const colors = league === 'NBA' ? TEAM_COLORS[abbr] : NFL_COLORS[abbr];
  const name = espnTeam.team?.displayName || espnTeam.team?.name || '';
  const record = espnTeam.records?.[0]?.summary || '0-0';
  const [wins, losses] = record.split('-').map(Number);

  return {
    id: abbr.toLowerCase(),
    name,
    slug: slugify(name),
    abbreviation: abbr,
    city: espnTeam.team?.location || '',
    league,
    conference: '',
    division: '',
    primaryColor: colors?.primary || '#333',
    secondaryColor: colors?.secondary || '#666',
    wins: wins || 0,
    losses: losses || 0,
    record,
    featured: (league === 'NBA' && abbr === 'BOS') || (league === 'NFL' && abbr === 'PHI'),
  };
}

function parseEspnGame(event: any, league: 'NBA' | 'NFL'): Game {
  const comp = event.competitions?.[0];
  if (!comp) throw new Error('No competition data');

  const homeComp = comp.competitors?.find((c: any) => c.homeAway === 'home');
  const awayComp = comp.competitors?.find((c: any) => c.homeAway === 'away');

  const homeTeam = parseEspnTeam(homeComp, league);
  const awayTeam = parseEspnTeam(awayComp, league);

  const statusDetail = comp.status?.type?.description || event.status?.type?.description || '';
  const status = mapEspnStatus(statusDetail);
  const period = comp.status?.period || event.status?.period || 0;
  const clock = comp.status?.displayClock || event.status?.displayClock || '';

  const homeScore = parseInt(homeComp?.score || '0', 10);
  const awayScore = parseInt(awayComp?.score || '0', 10);

  // Parse key plays/events
  const events: GameEvent[] = [];
  const headlines = comp.headlines || [];
  for (const hl of headlines) {
    if (hl.description) {
      events.push({
        id: `evt-${hl.type || 'general'}`,
        gameId: event.id,
        type: 'general',
        description: hl.description,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Situation data for possession
  const situation = comp.situation;
  const possession = situation?.possession
    ? situation.possession === homeComp?.id
      ? 'home' as const
      : 'away' as const
    : undefined;

  return {
    id: `${league.toLowerCase()}-espn-${event.id}`,
    league,
    season: '2025-26',
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status,
    quarter: period || undefined,
    timeRemaining: clock || undefined,
    possession,
    startTime: event.date || new Date().toISOString(),
    venue: comp.venue?.fullName || '',
    broadcast: comp.broadcasts?.[0]?.names?.[0] || '',
    featured: homeTeam.featured || awayTeam.featured,
    events: events.length > 0 ? events : undefined,
  };
}

export async function fetchESPNScoreboard(league: 'NBA' | 'NFL'): Promise<Game[]> {
  const url = league === 'NBA' ? NBA_SCOREBOARD : NFL_SCOREBOARD;
  try {
    const res = await fetch(url, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const events = data.events || [];
    return events.map((e: any) => parseEspnGame(e, league));
  } catch (error) {
    console.error(`[espn] Failed to fetch ${league} scoreboard:`, error);
    return [];
  }
}

export async function fetchAllLiveScores(): Promise<{
  games: Game[];
  live: Game[];
  final: Game[];
  scheduled: Game[];
}> {
  const [nba, nfl] = await Promise.all([
    fetchESPNScoreboard('NBA'),
    fetchESPNScoreboard('NFL'),
  ]);

  const games = [...nba, ...nfl];
  return {
    games,
    live: games.filter((g) => g.status === 'LIVE'),
    final: games.filter((g) => g.status === 'FINAL'),
    scheduled: games.filter((g) => g.status === 'SCHEDULED'),
  };
}
