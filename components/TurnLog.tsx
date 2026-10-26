'use client';

import { useState } from 'react';
import type { Game, TurnEntry } from '@/lib/types';
import { nextTurnDefaults } from '@/lib/turns';
import { DEFAULT_TURN_FILTERS, filterTurns, type TurnFilters as Filters } from '@/lib/filters';
import { EmptyState } from '@/components/EmptyState';
import { TurnCard } from '@/components/TurnCard';
import { TurnFilters } from '@/components/TurnFilters';
import { TurnForm } from '@/components/TurnForm';

type Props = {
  game: Game;
  onChange: (turns: TurnEntry[]) => boolean;
};

const primaryButton =
  'inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950';

export function TurnLog({ game, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_TURN_FILTERS);

  // Array.prototype.sort is stable, so duplicate turn numbers keep their stored order.
  const sorted = [...game.turns].sort((a, b) => a.turn - b.turn);
  const turnFilter = filters.turn !== 'all' && !game.turns.some((t) => t.turn === filters.turn) ? 'all' : filters.turn;
  const effectiveFilters: Filters = { ...filters, turn: turnFilter };
  const visible = filterTurns(sorted, effectiveFilters);

  const commit = (turns: TurnEntry[]): boolean => {
    const ok = onChange(turns);
    setSaveFailed(!ok);
    return ok;
  };

  const handleAdd = (turn: TurnEntry) => {
    if (commit([...game.turns, turn])) setAdding(false);
  };

  // Edit and delete report failure inline on the card, so they don't set the top-level alert.
  const commitInline = (turns: TurnEntry[]): boolean => {
    const ok = onChange(turns);
    if (ok) setSaveFailed(false);
    return ok;
  };

  const handleSave = (turn: TurnEntry): boolean => commitInline(game.turns.map((t) => (t.id === turn.id ? turn : t)));

  const handleDelete = (id: string): boolean => commitInline(game.turns.filter((t) => t.id !== id));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Turns</h2>
        {!adding ? (
          <button type="button" onClick={() => setAdding(true)} className={primaryButton}>
            Add turn
          </button>
        ) : null}
      </div>

      {saveFailed ? (
        <p role="alert" className="mb-3 text-sm text-red-700 dark:text-red-400">
          Couldn&apos;t save — your browser storage may be full or blocked.
        </p>
      ) : null}

      {game.turns.length > 0 ? (
        <>
          <TurnFilters turns={game.turns} filters={effectiveFilters} onChange={setFilters} />
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
            Showing {visible.length} of {game.turns.length} turns
          </p>
        </>
      ) : null}

      <div className="flex flex-col gap-3">
        {adding ? (
          <TurnForm
            defaults={nextTurnDefaults(game.turns)}
            submitLabel="Add turn"
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
          />
        ) : null}
        {sorted.length === 0 && !adding ? (
          <EmptyState heading="No turns logged yet" message="Tap Add turn to log your first turn." />
        ) : null}
        {sorted.length > 0 && visible.length === 0 ? (
          <EmptyState
            heading="No turns match these filters."
            message="Try loosening or clearing the filters."
            action={
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_TURN_FILTERS)}
                className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 px-4 font-medium hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Clear filters
              </button>
            }
          />
        ) : null}
        {visible.map((t) => <TurnCard key={t.id} turn={t} onSave={handleSave} onDelete={handleDelete} />)}
      </div>

      {!adding ? (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <button type="button" onClick={() => setAdding(true)} className={`${primaryButton} w-full justify-center`}>
            Add turn
          </button>
        </div>
      ) : null}
    </div>
  );
}
