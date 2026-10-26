'use client';

import { useCallback, useEffect, useState } from 'react';
import * as storage from '@/lib/storage';
import type { Game } from '@/lib/types';

export function useGames() {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [games, setGames] = useState<Game[]>([]);

  const refresh = useCallback(() => setGames(storage.listGames()), []);

  // Read storage only after mount to avoid hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount read of localStorage
    refresh();
    setStatus('ready');
    // Refresh when another tab changes the data.
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [refresh]);

  const getGame = useCallback(
    (id: string) => games.find((g) => g.id === id),
    [games],
  );

  const saveGame = useCallback(
    (game: Game) => {
      const ok = storage.saveGame(game);
      refresh();
      return ok;
    },
    [refresh],
  );

  const removeGame = useCallback(
    (id: string) => {
      const ok = storage.removeGame(id);
      refresh();
      return ok;
    },
    [refresh],
  );

  return { status, games, getGame, saveGame, removeGame };
}
