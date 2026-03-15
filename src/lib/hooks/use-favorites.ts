'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Favorite, League } from '@/lib/types';

interface FavoritesState {
  favorites: Favorite[];
  addFavorite: (item: Omit<Favorite, 'addedAt'>) => void;
  removeFavorite: (type: Favorite['type'], id: string) => void;
  isFavorite: (type: Favorite['type'], id: string) => boolean;
  getFavoritesByType: (type: Favorite['type']) => Favorite[];
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) => {
        const exists = get().favorites.some(
          (f) => f.type === item.type && f.id === item.id
        );
        if (exists) return;
        set((state) => ({
          favorites: [
            ...state.favorites,
            { ...item, addedAt: new Date().toISOString() },
          ],
        }));
      },

      removeFavorite: (type, id) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.type === type && f.id === id)
          ),
        }));
      },

      isFavorite: (type, id) => {
        return get().favorites.some((f) => f.type === type && f.id === id);
      },

      getFavoritesByType: (type) => {
        return get().favorites.filter((f) => f.type === type);
      },
    }),
    {
      name: 'ball-intelligence-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
