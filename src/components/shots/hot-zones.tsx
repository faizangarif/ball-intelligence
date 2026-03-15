'use client';

import { motion } from 'framer-motion';
import type { ShotChartSummary } from '@/lib/types';

interface HotZonesProps {
  zones: ShotChartSummary['zones'];
}

interface ZoneDef {
  name: string;
  type: 'ellipse' | 'rect' | 'polygon';
  points?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  labelX: number;
  labelY: number;
}

const zoneDefs: ZoneDef[] = [
  {
    name: 'paint',
    type: 'ellipse',
    cx: 250,
    cy: 60,
    rx: 35,
    ry: 25,
    labelX: 250,
    labelY: 60,
  },
  {
    name: 'free-throw',
    type: 'rect',
    x: 180,
    y: 80,
    width: 140,
    height: 100,
    labelX: 250,
    labelY: 130,
  },
  {
    name: 'mid-range-left',
    type: 'polygon',
    points: '60,80 180,80 180,250 100,250',
    labelX: 130,
    labelY: 165,
  },
  {
    name: 'mid-range-right',
    type: 'polygon',
    points: '320,80 440,80 400,250 320,250',
    labelX: 370,
    labelY: 165,
  },
  {
    name: 'mid-range-center',
    type: 'polygon',
    points: '180,180 320,180 320,280 180,280',
    labelX: 250,
    labelY: 230,
  },
  {
    name: 'left-corner-three',
    type: 'rect',
    x: 0,
    y: 0,
    width: 30,
    height: 140,
    labelX: 15,
    labelY: 70,
  },
  {
    name: 'right-corner-three',
    type: 'rect',
    x: 470,
    y: 0,
    width: 30,
    height: 140,
    labelX: 485,
    labelY: 70,
  },
  {
    name: 'left-wing-three',
    type: 'polygon',
    points: '0,140 100,260 140,380 0,380',
    labelX: 60,
    labelY: 280,
  },
  {
    name: 'right-wing-three',
    type: 'polygon',
    points: '400,260 500,140 500,380 360,380',
    labelX: 440,
    labelY: 280,
  },
  {
    name: 'top-of-key-three',
    type: 'polygon',
    points: '140,320 360,320 400,440 100,440',
    labelX: 250,
    labelY: 380,
  },
  {
    name: 'deep-three',
    type: 'polygon',
    points: '100,440 400,440 460,470 40,470',
    labelX: 250,
    labelY: 455,
  },
];

function getZoneColor(pct: number): { fill: string; opacity: number } {
  if (pct >= 55) return { fill: '#00a651', opacity: 0.35 };
  if (pct >= 45) return { fill: '#00a651', opacity: 0.2 };
  if (pct >= 38) return { fill: '#fbbf24', opacity: 0.2 };
  if (pct >= 30) return { fill: '#ef4444', opacity: 0.15 };
  return { fill: '#ef4444', opacity: 0.3 };
}

function matchZone(zoneName: string, dataZones: ShotChartSummary['zones']) {
  // Try exact match first, then partial match
  const exact = dataZones.find((z) => z.name === zoneName);
  if (exact) return exact;
  const partial = dataZones.find(
    (z) => z.name.includes(zoneName) || zoneName.includes(z.name)
  );
  return partial ?? null;
}

export function HotZones({ zones }: HotZonesProps) {
  return (
    <>
      {zoneDefs.map((def, i) => {
        const zoneData = matchZone(def.name, zones);
        if (!zoneData) return null;

        const pct = zoneData.percentage;
        const { fill, opacity } = getZoneColor(pct);

        return (
          <motion.g
            key={def.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            {def.type === 'ellipse' && (
              <ellipse
                cx={def.cx}
                cy={def.cy}
                rx={def.rx}
                ry={def.ry}
                fill={fill}
                opacity={opacity}
              />
            )}
            {def.type === 'rect' && (
              <rect
                x={def.x}
                y={def.y}
                width={def.width}
                height={def.height}
                fill={fill}
                opacity={opacity}
              />
            )}
            {def.type === 'polygon' && (
              <polygon
                points={def.points}
                fill={fill}
                opacity={opacity}
              />
            )}

            {/* FG% label */}
            <text
              x={def.labelX}
              y={def.labelY}
              fill="#ffffff"
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {pct.toFixed(1)}%
            </text>

            {/* Attempts label */}
            <text
              x={def.labelX}
              y={def.labelY + 14}
              fill="#8a8a9a"
              fontSize={9}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {zoneData.attempts} ATT
            </text>
          </motion.g>
        );
      })}
    </>
  );
}
