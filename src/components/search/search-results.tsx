'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';

interface SearchResultsProps {
  results: {
    teams: SearchResult[];
    players: SearchResult[];
    articles: SearchResult[];
    total: number;
  };
  loading: boolean;
}

const sectionConfig = {
  teams: { label: 'Teams', icon: Users },
  players: { label: 'Players', icon: User },
  articles: { label: 'Articles', icon: FileText },
} as const;

function ResultItem({ result }: { result: SearchResult }) {
  const config = sectionConfig[result.type as keyof typeof sectionConfig];
  const Icon = config?.icon ?? FileText;

  return (
    <Link href={result.url}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-transparent px-4 py-3',
          'transition-all duration-200 hover:border-[#2a2a3a] hover:bg-[#1a1a24]'
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00a651]/10">
          <Icon className="h-4 w-4 text-[#00a651]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#e5e5e5]">{result.title}</p>
          {result.subtitle && (
            <p className="truncate text-xs text-[#8a8a9a]">{result.subtitle}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

function ResultSection({
  title,
  icon: Icon,
  results,
}: {
  title: string;
  icon: typeof Users;
  results: SearchResult[];
}) {
  if (results.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2 px-4">
        <Icon className="h-4 w-4 text-[#8a8a9a]" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8a8a9a]">
          {title}
        </h3>
        <span className="text-xs text-[#8a8a9a]/60">({results.length})</span>
      </div>
      <div className="space-y-1">
        {results.map((result) => (
          <ResultItem key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  );
}

export function SearchResults({ results, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[#00a651]" />
        <span className="ml-3 text-sm text-[#8a8a9a]">Searching...</span>
      </div>
    );
  }

  if (results.total === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a24]">
          <FileText className="h-7 w-7 text-[#8a8a9a]" />
        </div>
        <p className="text-lg font-medium text-[#e5e5e5]">No results found</p>
        <p className="mt-1 text-sm text-[#8a8a9a]">
          Try a different search term or browse by category
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="mb-6 px-4 text-sm text-[#8a8a9a]">
          {results.total} result{results.total !== 1 ? 's' : ''} found
        </p>

        <ResultSection
          title="Teams"
          icon={Users}
          results={results.teams}
        />
        <ResultSection
          title="Players"
          icon={User}
          results={results.players}
        />
        <ResultSection
          title="Articles"
          icon={FileText}
          results={results.articles}
        />
      </motion.div>
    </AnimatePresence>
  );
}
