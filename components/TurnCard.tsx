'use client';

import { useState } from 'react';
import type { Flag, TurnEntry } from '@/lib/types';
import { TurnForm } from '@/components/TurnForm';

type Props = {
  turn: TurnEntry;
  onSave: (turn: TurnEntry) => boolean;
  onDelete: (id: string) => boolean;
};

const FLAG_STYLES: Record<Exclude<Flag, 'none'>, { label: string; className: string }> = {
  mistake: { label: 'Mistake', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  'great-play': { label: 'Great play', className: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
};

const secondaryButton =
  'inline-flex min-h-11 items-center rounded-lg border border-zinc-300 px-4 font-medium hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800';

function Note({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      {text ? (
        <p className="whitespace-pre-wrap">{text}</p>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400">—</p>
      )}
    </div>
  );
}

export function TurnCard({ turn, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);

  const failure = failed ? (
    <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">
      Couldn&apos;t save — your browser storage may be full or blocked.
    </p>
  ) : null;

  if (editing) {
    return (
      <div>
        <TurnForm
          initial={turn}
          submitLabel="Save turn"
          onSubmit={(t) => {
            if (onSave(t)) {
              setFailed(false);
              setEditing(false);
            } else {
              setFailed(true);
            }
          }}
          onCancel={() => {
            setFailed(false);
            setEditing(false);
          }}
        />
        {failure}
      </div>
    );
  }

  const flag = turn.flag === 'none' ? null : FLAG_STYLES[turn.flag];

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">Turn {turn.turn}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Satisfaction {turn.satisfaction}/5</p>
        </div>
        {flag ? (
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-medium ${flag.className}`}>
            {flag.label}
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-medium">
        Me {turn.myScore} – {turn.opponentScore} Opponent
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <Note label="My play and thinking" text={turn.note} />
        <Note label="What the opponent did" text={turn.opponentNote} />
      </div>
      {confirming ? (
        <div role="alertdialog" aria-label="Confirm delete turn" className="mt-3 rounded-lg border border-red-300 p-3 dark:border-red-900">
          <p className="font-medium">Delete this turn?</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setConfirming(false);
              }}
              className={secondaryButton}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setFailed(!onDelete(turn.id))}
              className="inline-flex min-h-11 items-center rounded-lg bg-red-700 px-4 font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            >
              Yes, delete
            </button>
          </div>
          {failure}
        </div>
      ) : (
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={() => setEditing(true)} className={secondaryButton}>
            Edit
          </button>
          <button type="button" onClick={() => setConfirming(true)} className={secondaryButton}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
