'use client';

import { motion } from 'framer-motion';
import {
  User,
  BookOpen,
  Code2,
  Heart,
  Rocket,
  Mail,
  Trophy,
  Cpu,
  BarChart3,
  Gamepad2,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function stagger(index: number) {
  return { ...fadeIn, transition: { duration: 0.5, delay: index * 0.1 } };
}

const buildItems = [
  { icon: Trophy, label: 'Sports websites' },
  { icon: Cpu, label: 'AI powered platforms' },
  { icon: BarChart3, label: 'Statistics dashboards' },
  { icon: Gamepad2, label: 'Interactive sports tools' },
  { icon: Sparkles, label: 'Creative digital projects' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <motion.div className="mb-16 text-center" {...fadeIn}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            About the Creator
          </p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-text md:text-5xl">
            Meet the Creator Behind{' '}
            <span className="text-gradient">Ball-Intelligence</span>
          </h1>
        </motion.div>

        {/* ── Hero / Creator Card ── */}
        <motion.section className="mb-14" {...stagger(1)}>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
            {/* Gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-emerald-500/5 pointer-events-none" />
            <div className="relative flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left md:p-10">
              {/* Avatar */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-emerald-600 shadow-lg shadow-accent/20">
                <User className="h-14 w-14 text-white" />
              </div>
              <div>
                <h2 className="mb-1 text-3xl font-black text-text md:text-4xl">
                  Ayaan G. Arif
                </h2>
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
                  Creator of Ball-Intelligence
                </p>
                <p className="max-w-2xl text-base leading-relaxed text-textMuted">
                  Ayaan G. Arif is a young creator passionate about sports, technology, and building
                  things with AI. Ball-Intelligence is one of his first major platforms, combining
                  his love for sports with modern technology to help fans understand the game on a
                  deeper level.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── The Story ── */}
        <motion.section className="mb-14" {...stagger(2)}>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Origin Story
                </p>
                <h2 className="text-2xl font-black text-text">
                  The Story Behind Ball-Intelligence
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-textMuted pl-0 md:pl-[60px]">
              <p>
                Ayaan G. Arif was born on September 19, 2013 and has always been fascinated by
                technology. From a very young age he was naturally drawn to video games, phones,
                computers, and digital tools.
              </p>
              <p>
                Instead of only using technology, Ayaan became curious about how things actually
                work. That curiosity led him to start exploring how websites, software, and AI
                platforms are built.
              </p>
              <p>
                Now at just 12 years old, with the guidance and encouragement of his parents, Ayaan
                is already learning how to create his own digital projects.
              </p>
              <p>
                Ball-Intelligence is one of those projects — a sports platform designed to help fans
                explore stats, highlights, and game insights in a fun and interactive way.
              </p>
              <p className="text-text font-semibold text-lg italic border-l-2 border-accent pl-4">
                The goal of Ball-Intelligence is simple: Help people gain real ball knowledge.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Technology & Creativity ── */}
        <motion.section className="mb-14" {...stagger(3)}>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Code2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Building
                </p>
                <h2 className="text-2xl font-black text-text">Technology and Creativity</h2>
              </div>
            </div>
            <div className="pl-0 md:pl-[60px]">
              <p className="mb-4 text-base leading-relaxed text-textMuted">
                Ayaan enjoys experimenting with technology and building whatever ideas come to mind.
                He loves what he calls &ldquo;vibe coding&rdquo; — sitting down with an idea and
                turning it into something real using modern tools and AI.
              </p>
              <p className="mb-5 text-base leading-relaxed text-textMuted">
                Some of the things Ayaan enjoys building include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {buildItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border border-border/50 bg-surfaceLight px-4 py-3',
                      'hover:border-accent/30 transition-colors duration-200'
                    )}
                  >
                    <item.icon className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm font-medium text-text">{item.label}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-base leading-relaxed text-textMuted">
                Ball-Intelligence represents the beginning of many projects he hopes to build in the
                future.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Inspired by Family ── */}
        <motion.section className="mb-14" {...stagger(4)}>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Family
                </p>
                <h2 className="text-2xl font-black text-text">Inspired by Family</h2>
              </div>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-textMuted pl-0 md:pl-[60px]">
              <p>
                Ayaan&apos;s curiosity and creativity are strongly supported by his parents.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Father */}
                <div className="rounded-xl border border-border/50 bg-surfaceLight p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">Faizan G. Arif, MD</p>
                      <p className="text-xs text-textMuted">Father</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-textMuted">
                    Emergency Physician, Biotech Researcher, and AI architect who has always
                    encouraged learning, building, and exploring new technologies.
                  </p>
                </div>
                {/* Mother */}
                <div className="rounded-xl border border-border/50 bg-surfaceLight p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Heart className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">Zubaida Saya</p>
                      <p className="text-xs text-textMuted">Mother</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-textMuted">
                    Studied marketing and finance and is now both an entrepreneur and an incredible
                    mother. She plays an important role in supporting Ayaan&apos;s ambitions and
                    helping him turn ideas into real projects.
                  </p>
                </div>
              </div>
              <p>
                Together they encourage Ayaan to stay curious, keep learning, and keep building.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Looking Ahead ── */}
        <motion.section className="mb-14" {...stagger(5)}>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 md:p-10">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-emerald-500/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Rocket className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    The Future
                  </p>
                  <h2 className="text-2xl font-black text-text">Looking Ahead</h2>
                </div>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-textMuted pl-0 md:pl-[60px]">
                <p className="text-lg font-semibold text-text">
                  Ball-Intelligence is just the beginning.
                </p>
                <p>
                  Ayaan hopes to continue building new platforms, exploring artificial intelligence,
                  and creating tools that help people learn, create, and have fun with technology.
                </p>
                <p>
                  He also enjoys helping friends and classmates build their own ideas and projects.
                </p>
                <p>
                  One day he hopes to create many more platforms that combine sports, technology, and
                  creativity.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Contact ── */}
        <motion.section className="mb-8" {...stagger(6)}>
          <div className="rounded-2xl border border-accent/20 bg-surface p-8 text-center md:p-10 glow-accent">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-7 w-7 text-accent" />
            </div>
            <h2 className="mb-2 text-2xl font-black text-text">Contact Ayaan</h2>
            <div className="mx-auto max-w-md space-y-1 text-base text-textMuted mb-6">
              <p>Have an idea for a project?</p>
              <p>Want help building something?</p>
              <p>Or just want to talk about sports and technology?</p>
            </div>
            <p className="mb-5 text-sm text-textMuted">Feel free to reach out.</p>
            <a
              href="mailto:ayaanarif919@outlook.com"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-6 py-3',
                'bg-accent text-white font-semibold text-sm',
                'hover:bg-accent-light transition-colors duration-200',
                'shadow-lg shadow-accent/20'
              )}
            >
              <Mail className="h-4 w-4" />
              ayaanarif919@outlook.com
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
