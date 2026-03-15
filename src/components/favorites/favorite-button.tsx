'use client';

import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/lib/hooks/use-favorites';
import type { League } from '@/lib/types';

interface FavoriteButtonProps {
  type: 'team' | 'player' | 'game';
  id: string;
  name: string;
  league?: League;
  className?: string;
}

export function FavoriteButton({ type, id, name, league, className }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(type, id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorited) {
      removeFavorite(type, id);
    } else {
      addFavorite({ type, id, name, league });
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.85 }}
      className={cn(
        'group/fav relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200',
        favorited
          ? 'bg-red-500/10 text-red-500'
          : 'bg-[#1a1a24] text-[#8a8a9a] hover:bg-[#2a2a3a] hover:text-red-400',
        className
      )}
      aria-label={favorited ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
    >
      <AnimatePresence mode="wait">
        {favorited ? (
          <motion.div
            key="filled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Heart className="h-4 w-4 fill-current" />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Heart className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
