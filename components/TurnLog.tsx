'use client';

import { useState } from 'react';
import type { Game, TurnEntry } from '@/lib/types';
import { nextTurnDefaults } from '@/lib/turns';
import { EmptyState } from '@/components/EmptyState';
import { TurnCard } from '@/components/TurnCard';
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

  // Array.prototype.sort is stable, so duplicate turn numbers keep their stored order.
  const sorted = [...game.turns].sort((a, b) => a.turn - b.turn);

  const commit = (turns: TurnEntry[]): boolean => {
    const ok = onChange(turns);
    setSaveFailed(!ok);
    return ok;
  };

  const handleAdd = (turn: TurnEntry) => {
    if (commit([...game.turns, turn])) setAdding(false);
  };

  const handleSave = (turn: TurnEntry) => {
    commit(game.turns.map((t) => (t.id === turn.id ? turn : t)));
  };

  const handleDelete = (id: string) => {
    commit(game.turns.filter((t) => t.id !== id));
  };

  return (
    <div className={adding ? '' : 'pb-24 md:pb-0'}>
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
        ) : (
          sorted.map((t) => <TurnCard key={t.id} turn={t} onSave={handleSave} onDelete={handleDelete} />)
        )}
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
