'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Compass,
  Users,
  User,
  BarChart3,
  FileText,
  TrendingUp,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchResults } from '@/components/search/search-results';
import type { SearchResult } from '@/lib/types';

const trendingSearches = [
  'Celtics',
  'Jayson Tatum',
  'Eagles',
  'NBA MVP',
  'NFL Draft',
  'Patrick Mahomes',
  'Shot Charts',
  'Playoffs',
];

const browseCategories = [
  {
    label: 'Teams',
    description: 'Browse all NBA and NFL teams',
    icon: Users,
    href: '/teams',
    color: '#00a651',
  },
  {
    label: 'Players',
    description: 'Discover featured and trending players',
    icon: User,
    href: '/players',
    color: '#3b82f6',
  },
  {
    label: 'Stats',
    description: 'Dive into advanced stats and leaders',
    icon: BarChart3,
    href: '/stats',
    color: '#f59e0b',
  },
  {
    label: 'Blog',
    description: 'Read expert analysis and features',
    icon: FileText,
    href: '/blog',
    color: '#8b5cf6',
  },
];

const quickLinks = [
  { label: 'Live Games', href: '/live', icon: Zap },
  { label: 'NBA Standings', href: '/nba', icon: BarChart3 },
  { label: 'NFL Overview', href: '/nfl', icon: Users },
  { label: 'Shot IQ', href: '/shot-iq', icon: TrendingUp },
];

const featuredPicks = [
  {
    title: "Celtics' Championship Window",
    subtitle: 'Analysis',
    href: '/blog/celtics-championship-window',
  },
  {
    title: 'Jayson Tatum',
    subtitle: 'Player Profile',
    href: '/players/jayson-tatum',
  },
  {
    title: 'NBA MVP Race 2026',
    subtitle: 'Feature',
    href: '/blog/nba-mvp-race-2026',
  },
];

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    teams: SearchResult[];
    players: SearchResult[];
    articles: SearchResult[];
    total: number;
  }>({ teams: [], players: [], articles: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ teams: [], players: [], articles: [], total: 0 });
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ teams: [], players: [], articles: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#2a2a3a] bg-[#111118] px-5 py-2">
            <Compass className="h-5 w-5 text-[#00a651]" />
            <span className="text-sm font-semibold uppercase tracking-widest text-[#8a8a9a]">
              Explore
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-[#e5e5e5] md:text-5xl">
            <span className="text-[#00a651]">DISCOVER</span>
          </h1>
          <p className="mx-auto max-w-md text-base text-[#8a8a9a]">
            Search for teams, players, articles, and more.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a8a9a]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, players, articles..."
              className={cn(
                'w-full rounded-xl border border-[#2a2a3a] bg-[#111118] py-4 pl-12 pr-4 text-[#e5e5e5]',
                'placeholder-[#8a8a9a]/60 outline-none transition-all duration-200',
                'focus:border-[#00a651]/50 focus:ring-1 focus:ring-[#00a651]/20'
              )}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#00a651] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00a651]/80"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="mx-auto mb-12 max-w-2xl rounded-xl border border-[#2a2a3a] bg-[#111118] p-4">
            <SearchResults results={results} loading={loading} />
          </div>
        )}

        {/* Trending Searches */}
        {!hasSearched && (
          <>
            <div className="mx-auto mb-12 max-w-2xl">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#8a8a9a]">
                <TrendingUp className="h-4 w-4 text-[#00a651]" />
                Trending Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className={cn(
                      'rounded-full border border-[#2a2a3a] bg-[#111118] px-4 py-2 text-sm text-[#e5e5e5]',
                      'transition-all duration-200 hover:border-[#00a651]/40 hover:text-[#00a651]'
                    )}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Category */}
            <section className="mb-12">
              <h2 className="mb-6 text-center text-lg font-bold text-[#e5e5e5]">
                Browse by Category
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {browseCategories.map((cat) => (
                  <Link key={cat.label} href={cat.href}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={cn(
                        'flex flex-col items-center rounded-xl border border-[#2a2a3a] bg-[#111118] p-6 text-center',
                        'transition-colors duration-200 hover:border-[#00a651]/40'
                      )}
                    >
                      <div
                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <cat.icon className="h-6 w-6" style={{ color: cat.color }} />
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-[#e5e5e5]">{cat.label}</h3>
                      <p className="text-xs text-[#8a8a9a]">{cat.description}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Featured Content Picks */}
            <section className="mb-12">
              <h2 className="mb-6 text-center text-lg font-bold text-[#e5e5e5]">
                Featured Picks
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {featuredPicks.map((pick) => (
                  <Link key={pick.title} href={pick.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={cn(
                        'rounded-xl border border-[#2a2a3a] bg-[#111118] p-5',
                        'transition-colors duration-200 hover:border-[#00a651]/40'
                      )}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#00a651]">
                        {pick.subtitle}
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-[#e5e5e5]">{pick.title}</h3>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <h2 className="mb-6 text-center text-lg font-bold text-[#e5e5e5]">Quick Links</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map((link) => (
                  <Link key={link.label} href={link.href}>
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-lg border border-[#2a2a3a] bg-[#111118] px-4 py-3',
                        'transition-colors duration-200 hover:border-[#00a651]/30 hover:bg-[#1a1a24]'
                      )}
                    >
                      <link.icon className="h-4 w-4 text-[#00a651]" />
                      <span className="text-sm font-medium text-[#e5e5e5]">{link.label}</span>
                      <ArrowRight className="ml-auto h-4 w-4 text-[#8a8a9a]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
