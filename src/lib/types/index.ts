export type League = 'NBA' | 'NFL';
export type GameStatus = 'SCHEDULED' | 'LIVE' | 'FINAL' | 'POSTPONED';

export interface Team {
  id: string;
  name: string;
  slug: string;
  abbreviation: string;
  city: string;
  league: League;
  conference: string;
  division: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  wins: number;
  losses: number;
  ties?: number;
  record: string;
  standing?: number;
  featured: boolean;
}

export interface Player {
  id: string;
  name: string;
  slug: string;
  firstName: string;
  lastName: string;
  number?: string;
  position: string;
  height?: string;
  weight?: string;
  age?: number;
  imageUrl?: string;
  teamId: string;
  team?: Team;
  league: League;
  seasonStats: Record<string, number>;
  bio?: string;
  featured: boolean;
  trending: boolean;
}

export interface Game {
  id: string;
  league: League;
  season: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: GameStatus;
  quarter?: number;
  timeRemaining?: string;
  possession?: 'home' | 'away';
  startTime: string;
  venue?: string;
  broadcast?: string;
  featured: boolean;
  events?: GameEvent[];
}

export interface GameEvent {
  id: string;
  gameId: string;
  type: string;
  description: string;
  timestamp: string;
  quarter?: number;
  timeRemaining?: string;
  teamId?: string;
  playerId?: string;
  data?: Record<string, unknown>;
}

export interface LiveGameState {
  game: Game;
  events: GameEvent[];
  lastUpdate: string;
  momentum: 'home' | 'away' | 'neutral';
  keyPlayers: { name: string; stats: Record<string, number> }[];
  aiCommentary: string[];
  summary: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName: string;
  authorImage?: string;
  category: string;
  tags: string[];
  readingTime: number;
  featured: boolean;
  published: boolean;
  publishedAt: string;
}

export interface ShotEntry {
  id: string;
  playerId: string;
  zone: string;
  x: number;
  y: number;
  made: boolean;
  shotType: string;
  distance: number;
}

export interface ShotChartSummary {
  playerId: string;
  playerName: string;
  season: string;
  zones: {
    name: string;
    attempts: number;
    makes: number;
    percentage: number;
    avgX: number;
    avgY: number;
  }[];
  totalShots: number;
  totalMade: number;
  overallPct: number;
}

export interface SearchResult {
  type: 'team' | 'player' | 'game' | 'article';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export interface Favorite {
  type: 'team' | 'player' | 'game';
  id: string;
  name: string;
  league?: League;
  addedAt: string;
}

export interface StatLeader {
  rank: number;
  playerName: string;
  playerSlug: string;
  team: string;
  value: number;
}
