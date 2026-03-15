'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIScorecastPanelProps {
  commentary: string[];
  summary: string;
}

export function AIScorecastPanel({ commentary, summary }: AIScorecastPanelProps) {
  return (
    <div className="bg-surface border border-accent/20 rounded-xl p-5 shadow-[0_0_30px_rgba(var(--accent-rgb,59,130,246),0.05)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold text-text">AI SCORECAST</h3>
        <Badge variant="success" className="ml-auto">Powered by Ball Intelligence</Badge>
      </div>

      {/* Summary */}
      <p className="text-textMuted italic text-sm mb-5 leading-relaxed">
        {summary}
      </p>

      {/* Commentary */}
      <div className="space-y-2">
        {commentary.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="bg-surfaceLight rounded-lg p-3"
          >
            <p className="text-sm text-text">
              <span className="text-accent font-bold mr-2">&gt;</span>
              {line}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
