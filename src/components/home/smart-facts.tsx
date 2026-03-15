'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeader } from '@/components/ui/section-header';
import { Lightbulb } from 'lucide-react';

interface SmartFact {
  id: string;
  highlight: string;
  before: string;
  after: string;
  numericValue?: number;
}

const facts: SmartFact[] = [
  {
    id: 'tatum-30',
    before: 'Jayson Tatum has scored 30+ in',
    highlight: '8',
    after: 'of his last 12 games',
    numericValue: 8,
  },
  {
    id: 'barkley-2k',
    before: 'Saquon Barkley rushed for',
    highlight: '2,000+',
    after: 'yards this season',
    numericValue: 2000,
  },
  {
    id: 'celtics-home',
    before: 'The Celtics are',
    highlight: '31-4',
    after: 'at home this season',
  },
  {
    id: 'sga-30',
    before: 'SGA is averaging',
    highlight: '30+',
    after: 'PPG on 53% shooting',
    numericValue: 30,
  },
];

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, value]);

  return <>{display.toLocaleString()}</>;
}

function FactCard({ fact, index }: { fact: SmartFact; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-surface rounded-xl p-4 border border-border min-w-[220px] snap-start"
    >
      <p className="text-2xl font-black text-accent mb-2">
        {fact.numericValue !== undefined ? (
          <>
            <AnimatedNumber value={fact.numericValue} inView={isInView} />
            {fact.highlight.includes('+') ? '+' : ''}
          </>
        ) : (
          <span>{fact.highlight}</span>
        )}
      </p>
      <p className="text-sm text-textMuted leading-relaxed">
        {fact.before} <span className="text-text font-medium">{fact.highlight}</span> {fact.after}
      </p>
    </motion.div>
  );
}

export function SmartFacts() {
  return (
    <section>
      <SectionHeader
        title="Today's Smartest Sports Facts"
        action={<Lightbulb className="w-5 h-5 text-accent" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map((fact, i) => (
          <FactCard key={fact.id} fact={fact} index={i} />
        ))}
      </div>
    </section>
  );
}
