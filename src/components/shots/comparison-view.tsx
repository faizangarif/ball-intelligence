'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ShotChartSummary } from '@/lib/types';
import { BasketballCourt } from './basketball-court';
import { HotZones } from './hot-zones';
import { PlayerSelector } from './player-selector';

interface ComparisonViewProps {
  players: { slug: string; name: string }[];
}

interface PlayerData {
  summary: ShotChartSummary | null;
  loading: boolean;
}

function getPctColor(pct: number): string {
  if (pct > 45) return 'text-accent';
  if (pct < 35) return 'text-live';
  return 'text-gold';
}

export function ComparisonView({ players }: ComparisonViewProps) {
  const [player1Slug, setPlayer1Slug] = useState(players[0]?.slug ?? '');
  const [player2Slug, setPlayer2Slug] = useState(players[1]?.slug ?? '');
  const [player1Data, setPlayer1Data] = useState<PlayerData>({
    summary: null,
    loading: true,
  });
  const [player2Data, setPlayer2Data] = useState<PlayerData>({
    summary: null,
    loading: true,
  });

  const fetchPlayerData = useCallback(
    async (slug: string, setter: (d: PlayerData) => void) => {
      setter({ summary: null, loading: true });
      try {
        const res = await fetch(`/api/shots/${slug}`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setter({ summary: data.summary, loading: false });
      } catch {
        setter({ summary: null, loading: false });
      }
    },
    [],
  );

  useEffect(() => {
    if (player1Slug) fetchPlayerData(player1Slug, setPlayer1Data);
  }, [player1Slug, fetchPlayerData]);

  useEffect(() => {
    if (player2Slug) fetchPlayerData(player2Slug, setPlayer2Data);
  }, [player2Slug, fetchPlayerData]);

  const allZoneNames = Array.from(
    new Set([
      ...(player1Data.summary?.zones.map((z) => z.name) ?? []),
      ...(player2Data.summary?.zones.map((z) => z.name) ?? []),
    ]),
  );

  return (
    <div className="space-y-6">
      {/* Player selectors */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-xs uppercase tracking-wider text-textMuted font-medium">
            Player 1
          </p>
          <PlayerSelector
            players={players}
            selected={player1Slug}
            onSelect={setPlayer1Slug}
          />
        </div>
        <div className="flex items-end justify-center pb-2">
          <span className="text-textMuted font-bold text-sm">VS</span>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs uppercase tracking-wider text-textMuted font-medium">
            Player 2
          </p>
          <PlayerSelector
            players={players}
            selected={player2Slug}
            onSelect={setPlayer2Slug}
          />
        </div>
      </div>

      {/* Side-by-side courts */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Player 1 court */}
        <div className="flex-1 space-y-2">
          <p className="text-center text-text font-semibold text-sm">
            {player1Data.summary?.playerName ?? 'Loading...'}
          </p>
          <div className="bg-surfaceLight/50 rounded-xl p-3 border border-border/50">
            {player1Data.loading ? (
              <div className="aspect-[500/470] bg-surface animate-pulse rounded-lg" />
            ) : player1Data.summary ? (
              <BasketballCourt>
                <HotZones zones={player1Data.summary.zones} />
              </BasketballCourt>
            ) : (
              <div className="aspect-[500/470] flex items-center justify-center text-textMuted text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Player 2 court */}
        <div className="flex-1 space-y-2">
          <p className="text-center text-text font-semibold text-sm">
            {player2Data.summary?.playerName ?? 'Loading...'}
          </p>
          <div className="bg-surfaceLight/50 rounded-xl p-3 border border-border/50">
            {player2Data.loading ? (
              <div className="aspect-[500/470] bg-surface animate-pulse rounded-lg" />
            ) : player2Data.summary ? (
              <BasketballCourt>
                <HotZones zones={player2Data.summary.zones} />
              </BasketballCourt>
            ) : (
              <div className="aspect-[500/470] flex items-center justify-center text-textMuted text-sm">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      {player1Data.summary && player2Data.summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-surface border border-border rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <p className="text-xs uppercase tracking-wider text-textMuted font-medium">
              Zone-by-Zone Comparison
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-textMuted text-xs uppercase tracking-wider font-medium">
                    Zone
                  </th>
                  <th className="text-right px-4 py-3 text-textMuted text-xs uppercase tracking-wider font-medium">
                    {player1Data.summary.playerName}
                  </th>
                  <th className="text-right px-4 py-3 text-textMuted text-xs uppercase tracking-wider font-medium">
                    {player2Data.summary.playerName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allZoneNames.map((zoneName) => {
                  const z1 = player1Data.summary!.zones.find(
                    (z) => z.name === zoneName,
                  );
                  const z2 = player2Data.summary!.zones.find(
                    (z) => z.name === zoneName,
                  );
                  const p1 = z1?.percentage ?? 0;
                  const p2 = z2?.percentage ?? 0;
                  const p1Better = p1 > p2;
                  const p2Better = p2 > p1;

                  return (
                    <tr
                      key={zoneName}
                      className="border-b border-border/50 hover:bg-surfaceLight/30 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-text text-xs">
                        {zoneName
                          .replace(/-/g, ' ')
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </td>
                      <td
                        className={cn(
                          'text-right px-4 py-2.5 tabular-nums font-semibold text-xs',
                          p1Better ? 'text-accent' : getPctColor(p1),
                        )}
                      >
                        {z1 ? `${p1.toFixed(1)}%` : '--'}
                        {z1 && (
                          <span className="text-textMuted font-normal ml-1">
                            ({z1.attempts})
                          </span>
                        )}
                      </td>
                      <td
                        className={cn(
                          'text-right px-4 py-2.5 tabular-nums font-semibold text-xs',
                          p2Better ? 'text-accent' : getPctColor(p2),
                        )}
                      >
                        {z2 ? `${p2.toFixed(1)}%` : '--'}
                        {z2 && (
                          <span className="text-textMuted font-normal ml-1">
                            ({z2.attempts})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Overall row */}
                <tr className="bg-surfaceLight/50 font-bold">
                  <td className="px-4 py-3 text-text text-xs uppercase">
                    Overall
                  </td>
                  <td
                    className={cn(
                      'text-right px-4 py-3 tabular-nums text-xs',
                      player1Data.summary.overallPct >=
                        player2Data.summary.overallPct
                        ? 'text-accent'
                        : 'text-text',
                    )}
                  >
                    {player1Data.summary.overallPct.toFixed(1)}%
                    <span className="text-textMuted font-normal ml-1">
                      ({player1Data.summary.totalShots})
                    </span>
                  </td>
                  <td
                    className={cn(
                      'text-right px-4 py-3 tabular-nums text-xs',
                      player2Data.summary.overallPct >=
                        player1Data.summary.overallPct
                        ? 'text-accent'
                        : 'text-text',
                    )}
                  >
                    {player2Data.summary.overallPct.toFixed(1)}%
                    <span className="text-textMuted font-normal ml-1">
                      ({player2Data.summary.totalShots})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
