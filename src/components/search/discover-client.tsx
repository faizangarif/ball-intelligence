'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Trophy, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';

const trendingSearches = [
  'Jayson Tatum',
  'Celtics',
  'Eagles',
  'Live Games',
  'Shot IQ',
  'Saquon Barkley',
  'Luka Doncic',
  'NBA Standings',
];

const iconMap: Record<string, React.ReactNode> = {
  team: <Trophy className="w-4 h-4" />,
  player: <Users className="w-4 h-4" />,
  article: <Newspaper className="w-4 h-4" />,
};

export function DiscoverClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const grouped = {
    team: results.filter((r) => r.type === 'team'),
    player: results.filter((r) => r.type === 'player'),
    article: results.filter((r) => r.type === 'article'),
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players, teams, articles..."
          className={cn(
            'w-full pl-12 pr-4 py-4 text-lg rounded-xl',
            'bg-surfaceLight border border-border text-text',
            'placeholder:text-textMuted focus:outline-none focus:border-accent/50',
            'transition-colors'
          )}
          autoFocus
        />
      </div>

      {!query && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-textMuted font-semibold mb-3">
            Trending Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-text hover:border-accent/30 transition"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-textMuted">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Searching...
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <p className="text-textMuted text-center py-8">No results found for &ldquo;{query}&rdquo;</p>
      )}

      {Object.entries(grouped).map(
        ([type, items]) =>
          items.length > 0 && (
            <div key={type}>
              <h3 className="text-sm uppercase tracking-wider text-textMuted font-semibold mb-3 flex items-center gap-2">
                {iconMap[type]}
                {type === 'team' ? 'Teams' : type === 'player' ? 'Players' : 'Articles'}
              </h3>
              <div className="space-y-2">
                {items.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border hover:border-accent/30 transition"
                  >
                    <span className="text-accent">{iconMap[result.type]}</span>
                    <div>
                      <div className="text-text font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-textMuted">{result.subtitle}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
