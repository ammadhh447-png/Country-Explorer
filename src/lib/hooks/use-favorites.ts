"use client";

import { useCallback, useEffect, useState } from "react";
import type { FavoriteEntry, FavoritesState } from "@/types/country";

const STORAGE_KEY = "country-explorer-favorites";

const DEFAULT_STATE: FavoritesState = {
  favorites: [],
};

function loadState(): FavoritesState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<FavoritesState>;
    return { favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [] };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: FavoritesState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useFavorites() {
  const [state, setState] = useState<FavoritesState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  const updateState = useCallback((updater: (prev: FavoritesState) => FavoritesState) => {
    setState((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      saveState(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (entry: Omit<FavoriteEntry, "addedAt">) => {
      let added = false;
      updateState((prev) => {
        const exists = prev.favorites.some((f) => f.cca3 === entry.cca3);
        added = !exists;
        const favorites = exists
          ? prev.favorites.filter((f) => f.cca3 !== entry.cca3)
          : [...prev.favorites, { ...entry, addedAt: new Date().toISOString() }];
        return { ...prev, favorites };
      });
      return added;
    },
    [updateState]
  );

  const isFavorite = useCallback(
    (cca3: string) => state.favorites.some((f) => f.cca3 === cca3),
    [state.favorites]
  );

  const clearAll = useCallback(() => {
    updateState(() => DEFAULT_STATE);
  }, [updateState]);

  return {
    ...state,
    loaded,
    toggleFavorite,
    isFavorite,
    clearAll,
  };
}
