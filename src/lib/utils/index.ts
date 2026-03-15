import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GameStatus, League } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatGameTime(
  status: GameStatus,
  quarter?: number,
  timeRemaining?: string
): string {
  if (status === 'FINAL') return 'Final';
  if (status === 'SCHEDULED') return formatDate(new Date().toISOString());
  if (status === 'POSTPONED') return 'Postponed';
  if (quarter && timeRemaining) return `Q${quarter} ${timeRemaining}`;
  if (quarter) return `Q${quarter}`;
  return 'Live';
}

export function formatRecord(wins: number, losses: number, ties?: number): string {
  if (ties !== undefined && ties > 0) return `${wins}-${losses}-${ties}`;
  return `${wins}-${losses}`;
}

export function formatStat(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getPlayerInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatLabel(key: string): string {
  const labels: Record<string, string> = {
    ppg: 'PTS',
    rpg: 'REB',
    apg: 'AST',
    spg: 'STL',
    bpg: 'BLK',
    fgPct: 'FG%',
    threePct: '3P%',
    ftPct: 'FT%',
    gamesPlayed: 'GP',
    minutesPerGame: 'MIN',
    passingYards: 'PASS YDS',
    passingTDs: 'PASS TD',
    rushingYards: 'RUSH YDS',
    rushingTDs: 'RUSH TD',
    receivingYards: 'REC YDS',
    receivingTDs: 'REC TD',
    receptions: 'REC',
    completionPct: 'CMP%',
    tackles: 'TKL',
    sacks: 'SACK',
    interceptions: 'INT',
  };
  return labels[key] || key.toUpperCase();
}

export function isGameLive(status: GameStatus): boolean {
  return status === 'LIVE';
}

export function getGameStatusColor(status: GameStatus): string {
  switch (status) {
    case 'LIVE':
      return 'text-live';
    case 'FINAL':
      return 'text-textMuted';
    case 'SCHEDULED':
      return 'text-accent';
    case 'POSTPONED':
      return 'text-gold';
    default:
      return 'text-text';
  }
}

export function getLeagueColor(league: League): string {
  return league === 'NBA' ? '#1d428a' : '#013369';
}
