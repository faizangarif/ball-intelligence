'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

// Simulated shot data for the mini court visualization
const shots = [
  { x: 75, y: 40, made: true },
  { x: 150, y: 55, made: true },
  { x: 225, y: 45, made: false },
  { x: 120, y: 90, made: true },
  { x: 180, y: 85, made: true },
  { x: 90, y: 130, made: false },
  { x: 210, y: 125, made: true },
  { x: 150, y: 150, made: false },
  { x: 50, y: 70, made: true },
  { x: 250, y: 70, made: true },
  { x: 150, y: 20, made: true },
  { x: 100, y: 60, made: false },
  { x: 200, y: 60, made: true },
  { x: 140, y: 110, made: true },
  { x: 160, y: 110, made: false },
  { x: 70, y: 100, made: true },
  { x: 230, y: 100, made: false },
  { x: 130, y: 35, made: true },
  { x: 170, y: 35, made: false },
  { x: 150, y: 80, made: true },
];

const dotVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.8 + i * 0.08,
      duration: 0.3,
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  }),
};

function MiniCourt() {
  return (
    <motion.svg
      viewBox="0 0 300 180"
      className="w-full max-w-[340px] h-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Court surface */}
      <rect x="0" y="0" width="300" height="180" rx="8" fill="#1a1a24" />

      {/* Court outline */}
      <rect x="10" y="5" width="280" height="170" rx="4" fill="none" stroke="#2a2a3a" strokeWidth="1" />

      {/* Three-point arc */}
      <path
        d="M 30 5 L 30 40 Q 150 180 270 40 L 270 5"
        fill="none"
        stroke="#2a2a3a"
        strokeWidth="1"
      />

      {/* Paint / key */}
      <rect x="110" y="5" width="80" height="70" fill="none" stroke="#2a2a3a" strokeWidth="1" />

      {/* Free throw circle */}
      <circle cx="150" cy="75" r="25" fill="none" stroke="#2a2a3a" strokeWidth="1" />

      {/* Basket */}
      <circle cx="150" cy="12" r="4" fill="none" stroke="#3a3a4a" strokeWidth="1.5" />
      <line x1="140" y1="8" x2="160" y2="8" stroke="#3a3a4a" strokeWidth="1.5" />

      {/* Shot dots */}
      {shots.map((shot, i) => (
        <motion.circle
          key={i}
          cx={shot.x}
          cy={shot.y}
          r="5"
          fill={shot.made ? '#00a651' : '#ef4444'}
          opacity={shot.made ? 0.85 : 0.45}
          custom={i}
          variants={dotVariants}
        />
      ))}
    </motion.svg>
  );
}

export function ShotIQTeaser() {
  return (
    <section className="border-t border-b border-border py-16 -mx-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Text content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <Target className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-black text-gradient">SHOT IQ</h2>
            </div>

            <p className="text-textMuted text-lg leading-relaxed mb-6 max-w-md">
              See where players shoot best. Discover hot zones. Get smarter about the game with
              interactive shot charts and advanced analytics.
            </p>

            <Link href="/shot-iq">
              <Button size="lg" className="group">
                Explore Shot IQ
                <span className="group-hover:translate-x-1 transition-transform" aria-hidden>
                  &rarr;
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Mini court visualization */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MiniCourt />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
