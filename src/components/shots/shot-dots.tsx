'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShotEntry } from '@/lib/types';

interface ShotDotsProps {
  shots: ShotEntry[];
  showMade?: boolean;
  showMissed?: boolean;
}

interface TooltipData {
  shot: ShotEntry;
  svgX: number;
  svgY: number;
}

export function ShotDots({ shots, showMade = true, showMissed = true }: ShotDotsProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const filteredShots = shots.filter((s) => {
    if (s.made && !showMade) return false;
    if (!s.made && !showMissed) return false;
    return true;
  });

  const handleMouseEnter = useCallback((shot: ShotEntry) => {
    setTooltip({ shot, svgX: shot.x, svgY: shot.y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <>
      {filteredShots.map((shot, i) => (
        <motion.circle
          key={shot.id}
          cx={shot.x}
          cy={shot.y}
          r={shot.made ? 4 : 3.5}
          fill={shot.made ? '#00a651' : '#ef4444'}
          initial={{ opacity: 0 }}
          animate={{ opacity: shot.made ? 0.7 : 0.35 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.004, 1.5) }}
          onMouseEnter={() => handleMouseEnter(shot)}
          onMouseLeave={handleMouseLeave}
          className="cursor-pointer"
          style={{ filter: shot.made ? 'drop-shadow(0 0 3px rgba(0,166,81,0.5))' : undefined }}
        />
      ))}

      {/* Tooltip rendered inside SVG */}
      <AnimatePresence>
        {tooltip && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <rect
              x={tooltip.svgX + 10}
              y={tooltip.svgY - 40}
              width={140}
              height={48}
              rx={6}
              fill="#1a1a24"
              stroke="#2a2a3a"
              strokeWidth={1}
            />
            <text
              x={tooltip.svgX + 18}
              y={tooltip.svgY - 22}
              fill="#e5e5e5"
              fontSize={11}
              fontWeight="600"
            >
              {tooltip.shot.zone} &bull; {tooltip.shot.made ? 'Made' : 'Missed'}
            </text>
            <text
              x={tooltip.svgX + 18}
              y={tooltip.svgY - 6}
              fill="#8a8a9a"
              fontSize={10}
            >
              {tooltip.shot.shotType} &bull; {tooltip.shot.distance}ft
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </>
  );
}
