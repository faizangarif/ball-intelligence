'use client';

import { motion } from 'framer-motion';
import { Trophy, Globe, Tv, Sparkles, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';

// Animated soccer ball that bounces and rotates
function AnimatedSoccerBall() {
  return (
    <div className="relative w-64 h-64 mx-auto mb-10">
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,166,81,0.15) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Soccer ball */}
      <motion.div
        className="absolute inset-8"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, -10, 5, 0],
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="ballGradient" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#3a3a4a" />
              <stop offset="100%" stopColor="#1a1a24" />
            </radialGradient>
            <radialGradient id="shine" cx="35%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          {/* Ball body */}
          <circle cx="100" cy="100" r="90" fill="url(#ballGradient)" stroke="#2a2a3a" strokeWidth="2" />
          {/* Pentagon panels */}
          <polygon points="100,30 120,55 112,80 88,80 80,55" fill="#111118" stroke="#2a2a3a" strokeWidth="1.5" />
          <polygon points="145,75 165,100 155,128 130,125 125,95" fill="#111118" stroke="#2a2a3a" strokeWidth="1.5" />
          <polygon points="55,75 75,95 70,125 45,128 35,100" fill="#111118" stroke="#2a2a3a" strokeWidth="1.5" />
          <polygon points="75,140 90,125 110,125 125,140 115,168 85,168" fill="#111118" stroke="#2a2a3a" strokeWidth="1.5" />
          <polygon points="35,115 50,135 45,155 25,145" fill="#111118" stroke="#2a2a3a" strokeWidth="1.5" />
          <polygon points="165,115 175,145 155,155 150,135" fill="#111118" stroke="#2a2a3a" strokeWidth="1.5" />
          {/* Shine overlay */}
          <circle cx="100" cy="100" r="88" fill="url(#shine)" />
          {/* Accent glow line */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="#00a651" strokeWidth="1" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full bg-accent/10 blur-md"
        animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbiting particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent"
          style={{ top: '50%', left: '50%' }}
          animate={{
            x: [
              Math.cos((i * 72 * Math.PI) / 180) * 100,
              Math.cos(((i * 72 + 360) * Math.PI) / 180) * 100,
            ],
            y: [
              Math.sin((i * 72 * Math.PI) / 180) * 100,
              Math.sin(((i * 72 + 360) * Math.PI) / 180) * 100,
            ],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Floating league badges
function FloatingBadges() {
  const badges = [
    { label: 'Champions League', delay: 0, x: '10%', y: '15%' },
    { label: 'Premier League', delay: 1.5, x: '75%', y: '20%' },
    { label: 'World Cup 2026', delay: 3, x: '15%', y: '75%' },
    { label: 'La Liga', delay: 4.5, x: '80%', y: '70%' },
    { label: 'Serie A', delay: 2, x: '5%', y: '45%' },
    { label: 'Bundesliga', delay: 3.5, x: '88%', y: '45%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {badges.map((badge) => (
        <motion.div
          key={badge.label}
          className="absolute px-3 py-1 rounded-full border border-border/30 bg-surface/50 text-[10px] font-semibold text-textMuted backdrop-blur-sm"
          style={{ left: badge.x, top: badge.y }}
          animate={{
            y: [0, -8, 0, 8, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            delay: badge.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {badge.label}
        </motion.div>
      ))}
    </div>
  );
}

const features = [
  { icon: Trophy, title: 'Champions League', desc: 'Full coverage of Europe\'s elite club competition' },
  { icon: Globe, title: 'World Cup 2026', desc: 'USA, Mexico & Canada — the biggest World Cup ever' },
  { icon: Tv, title: 'Premier League', desc: 'The world\'s most-watched football league' },
  { icon: Sparkles, title: 'AI Match Analysis', desc: 'AI-powered tactical breakdowns and predictions' },
  { icon: BarChart3, title: 'Player Intelligence', desc: 'Advanced stats, heatmaps, and performance data' },
  { icon: Zap, title: 'Live Match Center', desc: 'Real-time scores, events, and commentary' },
];

export default function SoccerPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <FloatingBadges />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-semibold mb-6"
            animate={{ boxShadow: ['0 0 10px rgba(0,166,81,0.1)', '0 0 25px rgba(0,166,81,0.2)', '0 0 10px rgba(0,166,81,0.1)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-3.5 h-3.5" />
            Coming Soon
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-text mb-4">
            <span className="text-gradient">Soccer</span>
          </h1>
          <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
            The beautiful game meets Ball Intelligence. World-class football analysis powered by AI.
          </p>
        </motion.div>

        {/* Animated Soccer Ball */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AnimatedSoccerBall />
        </motion.div>

        {/* Leagues coming */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-textMuted mb-4">Leagues & Tournaments</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Champions League', 'Premier League', 'World Cup 2026', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'MLS'].map((league, i) => (
              <motion.span
                key={league}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-sm font-medium text-text hover:border-accent/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {league}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Feature preview grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-surface border border-border rounded-xl p-5 hover:border-accent/20 transition-all group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-3 group-hover:bg-accent/20 transition-colors">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-text mb-1">{f.title}</h3>
              <p className="text-xs text-textMuted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-textMuted mb-4">Want to be notified when Soccer launches?</p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
