import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatGameTime,
  formatRecord,
  slugify,
  getPlayerInitials,
  getStatLabel,
  isGameLive,
  getGameStatusColor,
} from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('handles tailwind conflicts', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });
});

describe('formatGameTime', () => {
  it('returns Final for FINAL status', () => {
    expect(formatGameTime('FINAL')).toBe('Final');
  });

  it('returns quarter and time for LIVE', () => {
    expect(formatGameTime('LIVE', 3, '4:22')).toBe('Q3 4:22');
  });

  it('returns Postponed', () => {
    expect(formatGameTime('POSTPONED')).toBe('Postponed');
  });
});

describe('formatRecord', () => {
  it('formats win-loss', () => {
    expect(formatRecord(52, 18)).toBe('52-18');
  });

  it('includes ties when present', () => {
    expect(formatRecord(13, 4, 1)).toBe('13-4-1');
  });

  it('omits ties when zero', () => {
    expect(formatRecord(13, 4, 0)).toBe('13-4');
  });
});

describe('slugify', () => {
  it('creates URL-safe slug', () => {
    expect(slugify('Boston Celtics')).toBe('boston-celtics');
  });

  it('handles special characters', () => {
    expect(slugify("A.J. Brown's Stats")).toBe('aj-browns-stats');
  });
});

describe('getPlayerInitials', () => {
  it('returns two initials', () => {
    expect(getPlayerInitials('Jayson Tatum')).toBe('JT');
  });

  it('handles single name', () => {
    expect(getPlayerInitials('Giannis')).toBe('G');
  });
});

describe('getStatLabel', () => {
  it('maps ppg to PTS', () => {
    expect(getStatLabel('ppg')).toBe('PTS');
  });

  it('maps rpg to REB', () => {
    expect(getStatLabel('rpg')).toBe('REB');
  });

  it('falls back to uppercase', () => {
    expect(getStatLabel('custom')).toBe('CUSTOM');
  });
});

describe('isGameLive', () => {
  it('returns true for LIVE', () => {
    expect(isGameLive('LIVE')).toBe(true);
  });

  it('returns false for FINAL', () => {
    expect(isGameLive('FINAL')).toBe(false);
  });
});

describe('getGameStatusColor', () => {
  it('returns live color for LIVE', () => {
    expect(getGameStatusColor('LIVE')).toBe('text-live');
  });
});
