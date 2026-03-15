'use client';

import { motion } from 'framer-motion';
import type { GameEvent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Activity, AlertCircle, Clock, Zap, Flag } from 'lucide-react';

interface EventTimelineProps {
  events: GameEvent[];
}

function getEventIcon(type: string) {
  switch (type) {
    case 'score':
      return <Activity className="w-4 h-4" />;
    case 'turnover':
      return <AlertCircle className="w-4 h-4" />;
    case 'timeout':
      return <Clock className="w-4 h-4" />;
    case 'foul':
      return <Flag className="w-4 h-4" />;
    default:
      return <Zap className="w-4 h-4" />;
  }
}

function getEventBorderColor(type: string) {
  switch (type) {
    case 'score':
      return 'border-l-accent';
    case 'turnover':
      return 'border-l-live';
    case 'timeout':
      return 'border-l-textMuted';
    case 'foul':
      return 'border-l-gold';
    default:
      return 'border-l-border';
  }
}

export function EventTimeline({ events }: EventTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-lg font-bold text-text mb-4">Play-by-Play</h3>
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
        {sortedEvents.length === 0 && (
          <p className="text-textMuted text-sm text-center py-8">
            No plays recorded yet.
          </p>
        )}
        {sortedEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={cn(
              'border-l-2 pl-3 py-2',
              getEventBorderColor(event.type)
            )}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-textMuted">{getEventIcon(event.type)}</span>
              {event.quarter && event.timeRemaining && (
                <span className="text-xs text-textMuted">
                  Q{event.quarter} {event.timeRemaining}
                </span>
              )}
            </div>
            <p
              className={cn(
                'text-sm',
                event.type === 'score' ? 'font-semibold text-text' : 'text-textMuted'
              )}
            >
              {event.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
