'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Users, Trophy, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupedResults {
  teams: SearchResult[];
  players: SearchResult[];
  articles: SearchResult[];
  total: number;
}

const trendingSearches = [
  'Jayson Tatum',
  'Celtics',
  'Eagles',
  'Live Games',
  'Shot IQ',
];

const typeIcons: Record<string, React.ReactNode> = {
  team: <Trophy className="w-4 h-4" />,
  player: <Users className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GroupedResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      // Silently fail for search
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 300);
  }

  function handleTrendingClick(term: string) {
    setQuery(term);
    fetchResults(term);
  }

  function handleResultClick() {
    onClose();
  }

  function renderGroup(label: string, items: SearchResult[]) {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-xs text-textMuted uppercase tracking-wide font-semibold px-4 py-2">
          {label}
        </h3>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            onClick={handleResultClick}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-surfaceLight transition-colors"
          >
            <span className="text-textMuted">{typeIcons[item.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-xs text-textMuted truncate">{item.subtitle}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-4 top-[8%] z-50 mx-auto max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-textMuted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search teams, players, articles..."
                className="flex-1 bg-transparent text-lg text-text placeholder:text-textMuted outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] text-textMuted bg-surfaceLight rounded border border-border">
                ESC
              </kbd>
            </div>

            {/* Results area */}
            <div className="overflow-y-auto flex-1">
              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              )}

              {/* Results */}
              {!isLoading && results && results.total > 0 && (
                <div className="py-2">
                  {renderGroup('Teams', results.teams)}
                  {renderGroup('Players', results.players)}
                  {renderGroup('Articles', results.articles)}
                </div>
              )}

              {/* No results */}
              {!isLoading && results && results.total === 0 && query.trim() && (
                <div className="text-center py-8">
                  <p className="text-textMuted text-sm">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}

              {/* Trending (when empty) */}
              {!isLoading && !results && (
                <div className="p-4">
                  <h3 className="text-xs text-textMuted uppercase tracking-wide font-semibold mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTrendingClick(term)}
                        className="px-3 py-1.5 text-sm text-textMuted bg-surfaceLight rounded-full hover:text-text hover:bg-border transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
