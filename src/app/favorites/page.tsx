'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, User, Tv, X, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/lib/hooks/use-favorites';
import type { Favorite } from '@/lib/types';

type Tab = 'team' | 'player' | 'game';

const tabs: { value: Tab; label: string; icon: typeof Users }[] = [
  { value: 'team', label: 'Teams', icon: Users },
  { value: 'player', label: 'Players', icon: User },
  { value: 'game', label: 'Games', icon: Tv },
];

const emptyMessages: Record<Tab, string> = {
  team: 'No favorite teams yet — discover teams to follow',
  player: 'No favorite players yet — explore players to follow',
  game: 'No favorite games yet — check out live games',
};

function FavoriteCard({
  item,
  onRemove,
}: {
  item: Favorite;
  onRemove: () => void;
}) {
  const href =
    item.type === 'team'
      ? `/teams/${item.id}`
      : item.type === 'player'
        ? `/players/${item.id}`
        : `/live/${item.id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex items-center gap-4 rounded-xl border border-[#2a2a3a] bg-[#111118] p-4',
        'transition-colors duration-200 hover:border-[#00a651]/40'
      )}
    >
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-4">
        {/* Avatar Placeholder */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1a1a24]">
          <span className="text-lg font-bold text-[#00a651]">
            {item.name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#e5e5e5] transition-colors group-hover:text-[#00a651]">
            {item.name}
          </p>
          {item.league && (
            <span className="mt-0.5 inline-block rounded bg-[#1a1a24] px-2 py-0.5 text-xs font-medium text-[#8a8a9a]">
              {item.league}
            </span>
          )}
        </div>
      </Link>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          'text-[#8a8a9a] transition-all duration-200 hover:bg-red-500/10 hover:text-red-400'
        )}
        aria-label={`Remove ${item.name} from favorites`}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('team');
  const { getFavoritesByType, removeFavorite } = useFavorites();

  const items = getFavoritesByType(activeTab);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#2a2a3a] bg-[#111118] px-5 py-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold uppercase tracking-widest text-[#8a8a9a]">
              Saved
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-[#e5e5e5] md:text-5xl">
            MY <span className="text-[#00a651]">FAVORITES</span>
          </h1>
          <p className="mx-auto max-w-md text-base text-[#8a8a9a]">
            Your saved teams, players, and games — all in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center gap-2">
          {tabs.map((tab) => {
            const count = getFavoritesByType(tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200',
                  activeTab === tab.value
                    ? 'bg-[#00a651] text-white'
                    : 'border border-[#2a2a3a] bg-[#111118] text-[#8a8a9a] hover:border-[#00a651]/30 hover:text-[#e5e5e5]'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      'ml-1 rounded-full px-2 py-0.5 text-xs font-bold',
                      activeTab === tab.value
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1a1a24] text-[#8a8a9a]'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {items.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-3 sm:grid-cols-2"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <FavoriteCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onRemove={() => removeFavorite(item.type, item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#111118] ring-1 ring-[#2a2a3a]">
                <Heart className="h-8 w-8 text-[#8a8a9a]" />
              </div>
              <p className="mb-6 text-base text-[#8a8a9a]">{emptyMessages[activeTab]}</p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-full bg-[#00a651] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00a651]/80"
              >
                <Compass className="h-4 w-4" />
                Discover
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
