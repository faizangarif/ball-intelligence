import Link from 'next/link';
import { cn, formatGameTime, isGameLive } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LiveIndicator } from '@/components/ui/live-indicator';
import type { Game } from '@/lib/types';

interface GameCardMiniProps {
  game: Game;
  className?: string;
}

export function GameCardMini({ game, className }: GameCardMiniProps) {
  const live = isGameLive(game.status);
  const statusText = formatGameTime(game.status, game.quarter, game.timeRemaining);

  const content = (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl p-4 min-w-[220px] snap-start transition-all',
        live && 'border-live/30',
        'hover:border-accent/30 hover:scale-[1.01] cursor-pointer',
        className
      )}
    >
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        {live ? (
          <LiveIndicator />
        ) : (
          <Badge variant={game.status === 'FINAL' ? 'default' : 'info'}>
            {statusText}
          </Badge>
        )}
        {game.broadcast && (
          <span className="text-xs text-textMuted">{game.broadcast}</span>
        )}
      </div>

      {/* Away Team */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: game.awayTeam.primaryColor }}
          />
          <span className="text-sm font-semibold text-text">
            {game.awayTeam.abbreviation}
          </span>
        </div>
        <span
          className={cn(
            'text-lg font-bold',
            game.status === 'FINAL' && game.awayScore > game.homeScore
              ? 'text-text'
              : game.status === 'FINAL'
                ? 'text-textMuted'
                : 'text-text'
          )}
        >
          {game.status !== 'SCHEDULED' ? game.awayScore : '-'}
        </span>
      </div>

      {/* Home Team */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: game.homeTeam.primaryColor }}
          />
          <span className="text-sm font-semibold text-text">
            {game.homeTeam.abbreviation}
          </span>
        </div>
        <span
          className={cn(
            'text-lg font-bold',
            game.status === 'FINAL' && game.homeScore > game.awayScore
              ? 'text-text'
              : game.status === 'FINAL'
                ? 'text-textMuted'
                : 'text-text'
          )}
        >
          {game.status !== 'SCHEDULED' ? game.homeScore : '-'}
        </span>
      </div>

      {/* Venue */}
      {game.venue && (
        <p className="text-xs text-textMuted mt-2 truncate">{game.venue}</p>
      )}
    </div>
  );

  if (live) {
    return <Link href={`/live/${game.id}`}>{content}</Link>;
  }

  return content;
}
