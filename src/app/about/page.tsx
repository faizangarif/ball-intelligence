import {
  Info,
  Target,
  User,
  Zap,
  Code2,
  Heart,
  BarChart3,
  Tv,
  Brain,
  Crosshair,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'About | BALL INTELLIGENCE',
  description:
    'Learn about BALL INTELLIGENCE — a premium sports intelligence portal created by Ayaan Arif.',
};

const features = [
  {
    icon: Tv,
    title: 'Live Game Tracking',
    description: 'Real-time scores, play-by-play, and momentum tracking across NBA and NFL games.',
  },
  {
    icon: Crosshair,
    title: 'Shot IQ Charts',
    description: 'Interactive shot charts with zone breakdowns, percentages, and visual heatmaps.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Recaps',
    description: 'Intelligent game summaries and commentary generated in real time.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Stats',
    description: 'Deep statistical analysis with league leaders, player comparisons, and trends.',
  },
  {
    icon: Heart,
    title: 'Personalized Favorites',
    description: 'Save your favorite teams, players, and games for quick access.',
  },
  {
    icon: Zap,
    title: 'Expert Blog',
    description: 'Original analysis, draft coverage, previews, and feature stories.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#2a2a3a] bg-[#111118] px-5 py-2">
            <Info className="h-5 w-5 text-[#00a651]" />
            <span className="text-sm font-semibold uppercase tracking-widest text-[#8a8a9a]">
              About
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[#e5e5e5] md:text-5xl">
            ABOUT <span className="text-[#00a651]">BALL INTELLIGENCE</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-[#8a8a9a]">
            The premium sports intelligence platform where data meets passion.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#111118]">
            <div className="bg-gradient-to-r from-[#00a651]/10 via-transparent to-transparent p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00a651]/10">
                  <Target className="h-6 w-6 text-[#00a651]" />
                </div>
                <div>
                  <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#00a651]">
                    Our Mission
                  </h2>
                  <h3 className="mb-4 text-2xl font-black text-[#e5e5e5] md:text-3xl">
                    Gain Ball Knowledge
                  </h3>
                  <p className="max-w-2xl text-base leading-relaxed text-[#8a8a9a]">
                    BALL INTELLIGENCE is built for the modern sports fan who wants more than just box scores.
                    We combine real-time data, advanced analytics, and expert storytelling to give you
                    the deepest understanding of the games you love. Whether you are tracking a live
                    game, studying shot charts, or reading in-depth analysis, BALL INTELLIGENCE is your
                    all-in-one sports intelligence hub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="mb-16">
          <div className="overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#111118] p-8 md:p-10">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00a651] to-[#00a651]/40">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#00a651]">
                  Creator
                </h2>
                <h3 className="mb-3 text-2xl font-black text-[#e5e5e5]">Ayaan Arif</h3>
                <p className="max-w-2xl text-base leading-relaxed text-[#8a8a9a]">
                  Ayaan is a young, ambitious developer and lifelong sports fan who built BALL INTELLIGENCE
                  from the ground up. With a passion for both technology and athletics, he set out to
                  create the sports platform he always wished existed — one that combines beautiful
                  design, real-time data, and intelligent analysis in a single experience. BALL INTELLIGENCE
                  represents the intersection of his two greatest passions: building software and
                  understanding sports at the deepest level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#00a651]">
            What You Can Do
          </h2>
          <h3 className="mb-8 text-center text-2xl font-black text-[#e5e5e5]">
            Features
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  'rounded-xl border border-[#2a2a3a] bg-[#111118] p-5',
                  'transition-colors duration-200 hover:border-[#00a651]/30'
                )}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00a651]/10">
                  <feature.icon className="h-5 w-5 text-[#00a651]" />
                </div>
                <h4 className="mb-1.5 text-sm font-bold text-[#e5e5e5]">{feature.title}</h4>
                <p className="text-xs leading-relaxed text-[#8a8a9a]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Section */}
        <section className="mb-16">
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#111118] p-8 text-center md:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00a651]/10">
              <Code2 className="h-6 w-6 text-[#00a651]" />
            </div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#00a651]">
              Under the Hood
            </h2>
            <h3 className="mb-4 text-2xl font-black text-[#e5e5e5]">
              Built with Modern Web Technology
            </h3>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#8a8a9a]">
              BALL INTELLIGENCE is powered by Next.js, React, TypeScript, and Tailwind CSS — delivering a
              fast, responsive, and beautiful experience on every device. Real-time data flows
              through optimized APIs, and every interaction is crafted with attention to detail using
              Framer Motion for smooth animations.
            </p>
          </div>
        </section>

        {/* Favorite Teams */}
        <section className="mb-8">
          <div className="overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#111118]">
            <div className="bg-gradient-to-r from-[#007A33]/10 via-transparent to-[#004C54]/10 p-8 md:p-10">
              <h2 className="mb-1 text-center text-xs font-semibold uppercase tracking-wider text-[#00a651]">
                Representing
              </h2>
              <h3 className="mb-6 text-center text-2xl font-black text-[#e5e5e5]">
                Favorite Teams
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Celtics */}
                <div className="flex items-center gap-4 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-5">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#007A3320' }}
                  >
                    <span className="text-xl font-black" style={{ color: '#007A33' }}>
                      BOS
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#e5e5e5]">Boston Celtics</p>
                    <p className="text-sm text-[#8a8a9a]">NBA &middot; Eastern Conference</p>
                  </div>
                </div>

                {/* Eagles */}
                <div className="flex items-center gap-4 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-5">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#004C5420' }}
                  >
                    <span className="text-xl font-black" style={{ color: '#004C54' }}>
                      PHI
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#e5e5e5]">Philadelphia Eagles</p>
                    <p className="text-sm text-[#8a8a9a]">NFL &middot; NFC East</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
