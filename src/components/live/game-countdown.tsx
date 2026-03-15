'use client';

import { useState, useEffect } from 'react';
import type { Game } from '@/lib/types';

interface GameCountdownProps {
  game: Game;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(startTime: string): TimeLeft {
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-3 min-w-[64px] text-center">
      <p className="text-2xl font-black text-text">{String(value).padStart(2, '0')}</p>
      <p className="text-[10px] text-textMuted uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

export function GameCountdown({ game }: GameCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(game.startTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(game.startTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [game.startTime]);

  const gameDate = new Date(game.startTime);

  return (
    <div className="bg-surfaceLight/30 border border-border rounded-xl p-6 text-center">
      <p className="text-sm text-textMuted mb-1">Next Game</p>
      <p className="text-lg font-bold text-text mb-4">
        {game.homeTeam.name} vs {game.awayTeam.name}
      </p>

      <div className="flex justify-center gap-3 mb-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hrs" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Sec" />
      </div>

      <p className="text-xs text-textMuted">
        {gameDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}{' '}
        at{' '}
        {gameDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}
        {game.venue && ` \u2014 ${game.venue}`}
      </p>
    </div>
  );
}
