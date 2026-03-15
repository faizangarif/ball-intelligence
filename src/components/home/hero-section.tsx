'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tv, Zap, Trophy, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LiveIndicator } from '@/components/ui/live-indicator';
import { cn } from '@/lib/utils';
import type { Game } from '@/lib/types';

interface HeroSectionProps {
  featuredGame: Game | null;
  liveGameCount: number;
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-5%`,
            animation: `floatUp ${6 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.15 + Math.random() * 0.35,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: var(--tw-opacity, 0.3);
          }
          90% {
            opacity: var(--tw-opacity, 0.3);
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const subtitleLetters = 'GAIN BALL KNOWLEDGE'.split('');

export function HeroSection({ featuredGame, liveGameCount }: HeroSectionProps) {
  const isLive = featuredGame?.status === 'LIVE';

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,166,81,0.08) 0%, transparent 70%)',
        }}
      />

      <Particles />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-8">
        {/* Live game count badge */}
        {liveGameCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-live/10 border border-live/20 hover:bg-live/20 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live" />
              </span>
              <span className="text-live text-sm font-semibold">
                {liveGameCount} game{liveGameCount > 1 ? 's' : ''} live now
              </span>
            </Link>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="text-text">BALL</span>{' '}
            <span className="text-gradient">INTELLIGENCE</span>
          </h1>
        </motion.div>

        {/* Subtitle with staggered letters */}
        <motion.div
          className="flex flex-wrap justify-center gap-[2px]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {subtitleLetters.map((char, i) => (
            <motion.span
              key={i}
              variants={fadeUpItem}
              className="text-textMuted text-sm md:text-lg tracking-[0.3em] uppercase font-medium"
            >
              {char === ' ' ? '\u00A0\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Featured game card */}
        {featuredGame && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md mt-4"
          >
            <Link href={isLive ? `/live/${featuredGame.id}` : `/games/${featuredGame.id}`}>
              <div
                className={cn(
                  'relative bg-surface/80 backdrop-blur-md border rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-accent/40',
                  isLive ? 'border-live/30 glow-live' : 'border-border'
                )}
              >
                {isLive && (
                  <div className="absolute top-3 right-3">
                    <LiveIndicator />
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  {/* Away team */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-white"
                      style={{ backgroundColor: featuredGame.awayTeam.primaryColor }}
                    >
                      {featuredGame.awayTeam.abbreviation}
                    </div>
                    <span className="text-xs text-textMuted">{featuredGame.awayTeam.name}</span>
                    {(isLive || featuredGame.status === 'FINAL') && (
                      <span className="text-2xl font-black text-text">{featuredGame.awayScore}</span>
                    )}
                  </div>

                  {/* Center */}
                  <div className="flex flex-col items-center gap-1">
                    {isLive ? (
                      <>
                        <span className="text-xs text-textMuted uppercase font-medium">
                          Q{featuredGame.quarter} {featuredGame.timeRemaining}
                        </span>
                        <span className="text-xs text-live font-semibold">
                          {featuredGame.broadcast && `on ${featuredGame.broadcast}`}
                        </span>
                      </>
                    ) : featuredGame.status === 'FINAL' ? (
                      <span className="text-xs text-textMuted uppercase font-medium">Final</span>
                    ) : (
                      <span className="text-xs text-textMuted uppercase font-medium">VS</span>
                    )}
                  </div>

                  {/* Home team */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-white"
                      style={{ backgroundColor: featuredGame.homeTeam.primaryColor }}
                    >
                      {featuredGame.homeTeam.abbreviation}
                    </div>
                    <span className="text-xs text-textMuted">{featuredGame.homeTeam.name}</span>
                    {(isLive || featuredGame.status === 'FINAL') && (
                      <span className="text-2xl font-black text-text">{featuredGame.homeScore}</span>
                    )}
                  </div>
                </div>

                {isLive && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-light transition-colors">
                      Watch Live <span aria-hidden>&rarr;</span>
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )}

        {/* If no featured game, show "Next Game" placeholder */}
        {!featuredGame && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-md mt-4"
          >
            <div className="bg-surface/80 backdrop-blur-md border border-border rounded-2xl p-6 text-center">
              <p className="text-textMuted text-sm uppercase tracking-wider mb-2">Next Game</p>
              <p className="text-text text-lg font-bold">Coming Soon</p>
              <p className="text-textMuted text-sm mt-1">Check back for upcoming matchups</p>
            </div>
          </motion.div>
        )}

        {/* Quick action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-2"
        >
          <Link
            href="/nba"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-nbaBlue text-white text-sm font-semibold hover:brightness-110 transition-all hover:scale-105"
          >
            <Trophy className="w-4 h-4" />
            NBA
          </Link>
          <Link
            href="/nfl"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-nflBlue text-white text-sm font-semibold hover:brightness-110 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4" />
            NFL
          </Link>
          <Link
            href="/live"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-live text-white text-sm font-semibold hover:brightness-110 transition-all hover:scale-105"
          >
            <Tv className="w-4 h-4" />
            Live Games
          </Link>
          <Link
            href="/shot-iq"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all hover:scale-105"
          >
            <Target className="w-4 h-4" />
            Shot IQ
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
