import type { ShotEntry } from '@/lib/types';

/**
 * Generate deterministic shot data for a player in a specific zone.
 * Uses trigonometric functions seeded by index to produce varied but
 * reproducible coordinates within the given bounding box.
 */
// Simple hash to generate a unique seed per player
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateZoneShots(
  playerId: string,
  zone: string,
  shotType: string,
  count: number,
  madeRatio: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  distMin: number,
  distMax: number,
): ShotEntry[] {
  const shots: ShotEntry[] = [];
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const distRange = distMax - distMin;
  const madeCount = Math.round(count * madeRatio);

  // Unique seed per player+zone so every player has different shot patterns
  const seed = hashString(playerId + zone);
  const s1 = 2.1 + (seed % 37) * 0.13;
  const s2 = 1.4 + (seed % 29) * 0.17;
  const s3 = 0.8 + (seed % 43) * 0.11;
  const p1 = (seed % 61) * 0.31;
  const p2 = (seed % 53) * 0.27;
  const p3 = (seed % 47) * 0.23;

  for (let i = 0; i < count; i++) {
    const xOffset = ((Math.sin(i * s1 + p1) + 1) / 2) * xRange;
    const yOffset = ((Math.cos(i * s2 + p2) + 1) / 2) * yRange;
    const distOffset = ((Math.sin(i * s3 + p3) + 1) / 2) * distRange;

    // Shuffle made/missed based on player seed so it's not always first N made
    const shotIndex = (i * (seed % 7 + 3) + seed) % count;
    const isMade = shotIndex < madeCount;

    shots.push({
      id: `${playerId}-${zone.replace(/\s+/g, '-').toLowerCase()}-${i}`,
      playerId,
      zone,
      x: Math.round(xMin + xOffset),
      y: Math.round(yMin + yOffset),
      made: isMade,
      shotType,
      distance: Math.round(distMin + distOffset),
    });
  }
  return shots;
}

// ========================================================================
// Jayson Tatum — 180 shots
// Good from mid-range and three (42% mid, 38% three), elite in paint (62%)
// ========================================================================
const tatumShots: ShotEntry[] = [
  // Restricted Area (30 shots, 62% = 19 made)
  ...generateZoneShots('jayson-tatum', 'Restricted Area', 'layup', 18, 0.61, 220, 280, 30, 80, 0, 4),
  ...generateZoneShots('jayson-tatum', 'Restricted Area', 'dunk', 12, 0.67, 225, 275, 35, 75, 0, 3),

  // Paint non-RA (22 shots, 55%)
  ...generateZoneShots('jayson-tatum', 'Paint', 'mid-range', 22, 0.55, 190, 310, 80, 170, 4, 14),

  // Mid-Range Left (18 shots, 42%)
  ...generateZoneShots('jayson-tatum', 'Mid-Range Left', 'mid-range', 18, 0.42, 60, 190, 80, 250, 10, 20),

  // Mid-Range Right (18 shots, 42%)
  ...generateZoneShots('jayson-tatum', 'Mid-Range Right', 'mid-range', 18, 0.42, 310, 440, 80, 250, 10, 20),

  // Mid-Range Center (12 shots, 42%)
  ...generateZoneShots('jayson-tatum', 'Mid-Range Center', 'mid-range', 12, 0.42, 190, 310, 170, 280, 15, 20),

  // Three Left Corner (12 shots, 38%)
  ...generateZoneShots('jayson-tatum', 'Three Left Corner', 'three-pointer', 12, 0.38, 20, 60, 30, 170, 22, 24),

  // Three Right Corner (12 shots, 38%)
  ...generateZoneShots('jayson-tatum', 'Three Right Corner', 'three-pointer', 12, 0.38, 440, 480, 30, 170, 22, 24),

  // Three Left Wing (18 shots, 38%)
  ...generateZoneShots('jayson-tatum', 'Three Left Wing', 'three-pointer', 18, 0.38, 30, 140, 250, 400, 23, 27),

  // Three Right Wing (18 shots, 38%)
  ...generateZoneShots('jayson-tatum', 'Three Right Wing', 'three-pointer', 18, 0.38, 360, 470, 250, 400, 23, 27),

  // Three Top (10 shots, 38%)
  ...generateZoneShots('jayson-tatum', 'Three Top', 'three-pointer', 10, 0.38, 140, 360, 340, 440, 24, 28),
];

// ========================================================================
// Jaylen Brown — 160 shots
// Strong driving (65% restricted), good mid-range left (48%), below avg 3 (35%)
// ========================================================================
const brownShots: ShotEntry[] = [
  // Restricted Area (35 shots, 65%)
  ...generateZoneShots('jaylen-brown', 'Restricted Area', 'layup', 20, 0.65, 222, 278, 32, 78, 0, 4),
  ...generateZoneShots('jaylen-brown', 'Restricted Area', 'dunk', 15, 0.67, 228, 272, 34, 72, 0, 3),

  // Paint non-RA (20 shots, 52%)
  ...generateZoneShots('jaylen-brown', 'Paint', 'mid-range', 20, 0.52, 190, 310, 80, 170, 4, 14),

  // Mid-Range Left (20 shots, 48%)
  ...generateZoneShots('jaylen-brown', 'Mid-Range Left', 'mid-range', 20, 0.48, 60, 190, 80, 250, 10, 20),

  // Mid-Range Right (15 shots, 40%)
  ...generateZoneShots('jaylen-brown', 'Mid-Range Right', 'mid-range', 15, 0.40, 310, 440, 80, 250, 10, 20),

  // Mid-Range Center (10 shots, 42%)
  ...generateZoneShots('jaylen-brown', 'Mid-Range Center', 'mid-range', 10, 0.42, 190, 310, 170, 280, 15, 20),

  // Three Left Corner (8 shots, 35%)
  ...generateZoneShots('jaylen-brown', 'Three Left Corner', 'three-pointer', 8, 0.35, 20, 60, 30, 170, 22, 24),

  // Three Right Corner (8 shots, 35%)
  ...generateZoneShots('jaylen-brown', 'Three Right Corner', 'three-pointer', 8, 0.35, 440, 480, 30, 170, 22, 24),

  // Three Left Wing (10 shots, 35%)
  ...generateZoneShots('jaylen-brown', 'Three Left Wing', 'three-pointer', 10, 0.35, 30, 140, 250, 400, 23, 27),

  // Three Right Wing (10 shots, 35%)
  ...generateZoneShots('jaylen-brown', 'Three Right Wing', 'three-pointer', 10, 0.35, 360, 470, 250, 400, 23, 27),

  // Three Top (4 shots, 35%)
  ...generateZoneShots('jaylen-brown', 'Three Top', 'three-pointer', 4, 0.35, 140, 360, 340, 440, 24, 28),
];

// ========================================================================
// LeBron James — 120 shots
// Elite at rim (68%), good mid (45%), decent three (38%)
// ========================================================================
const lebronShots: ShotEntry[] = [
  // Restricted Area (30 shots, 68%)
  ...generateZoneShots('lebron-james', 'Restricted Area', 'layup', 18, 0.67, 220, 280, 30, 80, 0, 4),
  ...generateZoneShots('lebron-james', 'Restricted Area', 'dunk', 12, 0.70, 225, 275, 32, 74, 0, 3),

  // Paint non-RA (15 shots, 50%)
  ...generateZoneShots('lebron-james', 'Paint', 'mid-range', 15, 0.50, 190, 310, 80, 170, 4, 14),

  // Mid-Range Left (10 shots, 45%)
  ...generateZoneShots('lebron-james', 'Mid-Range Left', 'mid-range', 10, 0.45, 60, 190, 80, 250, 10, 20),

  // Mid-Range Right (10 shots, 45%)
  ...generateZoneShots('lebron-james', 'Mid-Range Right', 'mid-range', 10, 0.45, 310, 440, 80, 250, 10, 20),

  // Mid-Range Center (7 shots, 45%)
  ...generateZoneShots('lebron-james', 'Mid-Range Center', 'mid-range', 7, 0.45, 190, 310, 170, 280, 15, 20),

  // Three Left Corner (6 shots, 38%)
  ...generateZoneShots('lebron-james', 'Three Left Corner', 'three-pointer', 6, 0.38, 20, 60, 30, 170, 22, 24),

  // Three Right Corner (6 shots, 38%)
  ...generateZoneShots('lebron-james', 'Three Right Corner', 'three-pointer', 6, 0.38, 440, 480, 30, 170, 22, 24),

  // Three Left Wing (8 shots, 38%)
  ...generateZoneShots('lebron-james', 'Three Left Wing', 'three-pointer', 8, 0.38, 30, 140, 250, 400, 23, 27),

  // Three Right Wing (8 shots, 38%)
  ...generateZoneShots('lebron-james', 'Three Right Wing', 'three-pointer', 8, 0.38, 360, 470, 250, 400, 23, 27),

  // Three Top (6 shots, 38%)
  ...generateZoneShots('lebron-james', 'Three Top', 'three-pointer', 6, 0.38, 140, 360, 340, 440, 24, 28),
];

// ========================================================================
// Stephen Curry — 150 shots
// LOTS of threes (~90), incredible 43% from three, fewer paint shots
// ========================================================================
const curryShots: ShotEntry[] = [
  // Restricted Area (15 shots, 60%)
  ...generateZoneShots('stephen-curry', 'Restricted Area', 'layup', 15, 0.60, 220, 280, 30, 80, 0, 4),

  // Paint non-RA (10 shots, 48%)
  ...generateZoneShots('stephen-curry', 'Paint', 'mid-range', 10, 0.48, 190, 310, 80, 170, 4, 14),

  // Mid-Range Left (8 shots, 45%)
  ...generateZoneShots('stephen-curry', 'Mid-Range Left', 'mid-range', 8, 0.45, 60, 190, 80, 250, 10, 20),

  // Mid-Range Right (8 shots, 45%)
  ...generateZoneShots('stephen-curry', 'Mid-Range Right', 'mid-range', 8, 0.45, 310, 440, 80, 250, 10, 20),

  // Mid-Range Center (7 shots, 45%)
  ...generateZoneShots('stephen-curry', 'Mid-Range Center', 'mid-range', 7, 0.45, 190, 310, 170, 280, 15, 20),

  // Three Left Corner (12 shots, 43%)
  ...generateZoneShots('stephen-curry', 'Three Left Corner', 'three-pointer', 12, 0.43, 20, 60, 30, 170, 22, 24),

  // Three Right Corner (12 shots, 43%)
  ...generateZoneShots('stephen-curry', 'Three Right Corner', 'three-pointer', 12, 0.43, 440, 480, 30, 170, 22, 24),

  // Three Left Wing (22 shots, 43%)
  ...generateZoneShots('stephen-curry', 'Three Left Wing', 'three-pointer', 22, 0.43, 30, 140, 250, 400, 23, 27),

  // Three Right Wing (22 shots, 43%)
  ...generateZoneShots('stephen-curry', 'Three Right Wing', 'three-pointer', 22, 0.43, 360, 470, 250, 400, 23, 27),

  // Three Top (22 shots, 43%)
  ...generateZoneShots('stephen-curry', 'Three Top', 'three-pointer', 22, 0.43, 140, 360, 340, 440, 24, 28),

  // Deep threes beyond normal range (12 shots, 40%)
  ...generateZoneShots('stephen-curry', 'Three Top', 'three-pointer', 12, 0.40, 160, 340, 420, 460, 28, 32),
];

// ========================================================================
// Luka Doncic — 130 shots
// Good step-back threes (36%), elite paint (63%), average mid-range
// ========================================================================
const lukaShots: ShotEntry[] = [
  // Restricted Area (28 shots, 63%)
  ...generateZoneShots('luka-doncic', 'Restricted Area', 'layup', 20, 0.63, 220, 280, 30, 80, 0, 4),
  ...generateZoneShots('luka-doncic', 'Restricted Area', 'dunk', 8, 0.63, 228, 272, 36, 72, 0, 3),

  // Paint non-RA (18 shots, 50%)
  ...generateZoneShots('luka-doncic', 'Paint', 'mid-range', 18, 0.50, 190, 310, 80, 170, 4, 14),

  // Mid-Range Left (10 shots, 40%)
  ...generateZoneShots('luka-doncic', 'Mid-Range Left', 'mid-range', 10, 0.40, 60, 190, 80, 250, 10, 20),

  // Mid-Range Right (10 shots, 40%)
  ...generateZoneShots('luka-doncic', 'Mid-Range Right', 'mid-range', 10, 0.40, 310, 440, 80, 250, 10, 20),

  // Mid-Range Center (8 shots, 40%)
  ...generateZoneShots('luka-doncic', 'Mid-Range Center', 'mid-range', 8, 0.40, 190, 310, 170, 280, 15, 20),

  // Three Left Corner (6 shots, 36%)
  ...generateZoneShots('luka-doncic', 'Three Left Corner', 'three-pointer', 6, 0.36, 20, 60, 30, 170, 22, 24),

  // Three Right Corner (6 shots, 36%)
  ...generateZoneShots('luka-doncic', 'Three Right Corner', 'three-pointer', 6, 0.36, 440, 480, 30, 170, 22, 24),

  // Three Left Wing (14 shots, 36%)
  ...generateZoneShots('luka-doncic', 'Three Left Wing', 'three-pointer', 14, 0.36, 30, 140, 250, 400, 23, 27),

  // Three Right Wing (14 shots, 36%)
  ...generateZoneShots('luka-doncic', 'Three Right Wing', 'three-pointer', 14, 0.36, 360, 470, 250, 400, 23, 27),

  // Three Top — step-backs (16 shots, 36%)
  ...generateZoneShots('luka-doncic', 'Three Top', 'three-pointer', 16, 0.36, 140, 360, 340, 440, 24, 28),
];

export const mockShotData: Record<string, ShotEntry[]> = {
  'jayson-tatum': tatumShots,
  'jaylen-brown': brownShots,
  'lebron-james': lebronShots,
  'stephen-curry': curryShots,
  'luka-doncic': lukaShots,
};
