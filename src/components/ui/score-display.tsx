import { cn } from '@/lib/utils';
import type { GameStatus } from '@/lib/types';
import { Badge } from './badge';

interface ScoreDisplayProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: GameStatus;
  quarter?: number;
  timeRemaining?: string;
  homeColor?: string;
  awayColor?: string;
  className?: string;
}

export function ScoreDisplay({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  quarter,
  timeRemaining,
  homeColor,
  awayColor,
  className,
}: ScoreDisplayProps) {
  const homeLeading = homeScore > awayScore;
  const awayLeading = awayScore > homeScore;
  const isLive = status === 'LIVE';
  const isFinal = status === 'FINAL';

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Status badge */}
      <div className="flex items-center justify-center gap-2">
        {isLive && <Badge variant="live">LIVE</Badge>}
        {isFinal && <Badge variant="default">FINAL</Badge>}
        {isLive && quarter && timeRemaining && (
          <span className="text-xs text-textMuted">
            Q{quarter} {timeRemaining}
          </span>
        )}
      </div>

      {/* Scores */}
      <div className="flex items-center justify-between gap-4">
        {/* Away team */}
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: awayColor || '#2a2a3a' }}
          />
          <span
            className={cn(
              'text-sm font-semibold',
              awayLeading && (isLive || isFinal) ? 'text-text' : 'text-textMuted'
            )}
          >
            {awayTeam}
          </span>
        </div>
        <span
          className={cn(
            'text-xl font-bold tabular-nums',
            awayLeading && (isLive || isFinal) ? 'text-text' : 'text-textMuted'
          )}
        >
          {awayScore}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Home team */}
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: homeColor || '#2a2a3a' }}
          />
          <span
            className={cn(
              'text-sm font-semibold',
              homeLeading && (isLive || isFinal) ? 'text-text' : 'text-textMuted'
            )}
          >
            {homeTeam}
          </span>
        </div>
        <span
          className={cn(
            'text-xl font-bold tabular-nums',
            homeLeading && (isLive || isFinal) ? 'text-text' : 'text-textMuted'
          )}
        >
          {homeScore}
        </span>
      </div>
    </div>
  );
}
