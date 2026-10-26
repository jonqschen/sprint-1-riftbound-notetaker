'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGames } from '@/hooks/useGames';
import { clearAll, replaceAll } from '@/lib/storage';
import { seedDemoGames } from '@/lib/seed';
import { DEFAULT_GAME_FILTERS, filterGames, type GameFilters as Filters } from '@/lib/filters';
import { EmptyState } from '@/components/EmptyState';
import { GameFilters } from '@/components/GameFilters';
import { ResultBadge } from '@/components/ResultBadge';
import { formatDate } from '@/components/formatDate';

const isDev = process.env.NODE_ENV === 'development';
const devButton =
  'inline-flex min-h-11 items-center rounded-lg border border-zinc-300 px-3 text-sm text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800';

export default function Home() {
  const { status, games } = useGames();
  const [filters, setFilters] = useState<Filters>(DEFAULT_GAME_FILTERS);

  if (status === 'loading') {
    return <p className="text-zinc-600 dark:text-zinc-400">Loading your games…</p>;
  }

  // dev helper — remove before submission if unwanted
  // useGames has no refresh method, so reload the page after writing storage directly.
  const loadDemo = () => {
    replaceAll(seedDemoGames());
    window.location.reload();
  };

  // dev helper — remove before submission if unwanted
  const clearData = () => {
    if (!window.confirm('Delete ALL games? This can\'t be undone.')) return;
    clearAll();
    window.location.reload();
  };

  if (games.length === 0) {
    return (
      <EmptyState
        heading="No games yet"
        message="Log your first game and it will show up here."
        action={
          <>
            <Link
              href="/games/new"
              className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            >
              Log your first game
            </Link>
            {/* dev helper — remove before submission if unwanted */}
            {isDev ? (
              <button type="button" onClick={loadDemo} className={devButton}>
                Load demo games (dev only)
              </button>
            ) : null}
          </>
        }
      />
    );
  }

  const sorted = [...filterGames(games, filters)].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div>
      <h1 className="sr-only">Your games</h1>
      <GameFilters games={games} filters={filters} onChange={setFilters} />
      <p className="my-3 text-sm text-zinc-600 dark:text-zinc-400">
        Showing {sorted.length} of {games.length} games
      </p>
      {sorted.length === 0 ? (
        <EmptyState
          heading="No games match these filters."
          message="Try loosening or clearing the filters."
          action={
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_GAME_FILTERS)}
              className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 px-4 font-medium hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Clear filters
            </button>
          }
        />
      ) : null}
      <ul className="flex flex-col gap-3">
        {sorted.map((g) => (
          <li key={g.id}>
            <Link
              href={`/games/${g.id}`}
              className="block rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 break-words">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatDate(g.date)}</p>
                  <p className="font-semibold">
                    {g.myLegend} vs {g.opponentLegend}
                  </p>
                  {g.deckName ? <p className="text-zinc-700 dark:text-zinc-300">{g.deckName}</p> : null}
                </div>
                <ResultBadge result={g.result} />
              </div>
              <p className="mt-2 text-sm capitalize text-zinc-600 dark:text-zinc-400">
                {g.matchType} · went {g.wentFirst}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {/* dev helper — remove before submission if unwanted */}
      {isDev ? (
        <div className="mt-6">
          <button type="button" onClick={clearData} className={devButton}>
            Clear all data (dev only)
          </button>
        </div>
      ) : null}
    </div>
  );
}
