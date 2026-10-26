'use client';

import { useState } from 'react';
import { newId } from '@/lib/storage';
import type { Flag, TurnEntry } from '@/lib/types';
import { ScoreStepper } from '@/components/ScoreStepper';

type Props = {
  initial?: TurnEntry;
  defaults?: Partial<TurnEntry>;
  onSubmit: (turn: TurnEntry) => void;
  onCancel: () => void;
  submitLabel: string;
};

const inputClass =
  'min-h-11 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';
const labelClass = 'mb-1 block text-sm font-medium';
const errorClass = 'mt-1 text-sm text-red-700 dark:text-red-400';
const segmentClass =
  'flex min-h-11 min-w-11 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 px-3 text-center has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 dark:border-zinc-700';

type SegmentedProps<T extends string | number> = {
  legend: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
};

function Segmented<T extends string | number>({ legend, name, value, options, onChange }: SegmentedProps<T>) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className={segmentClass}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TurnForm({ initial, defaults, onSubmit, onCancel, submitLabel }: Props) {
  const start = { ...defaults, ...initial };
  const [turn, setTurn] = useState(String(start.turn ?? 1));
  const [satisfaction, setSatisfaction] = useState(start.satisfaction ?? 3);
  const [myScore, setMyScore] = useState(start.myScore ?? 0);
  const [opponentScore, setOpponentScore] = useState(start.opponentScore ?? 0);
  const [flag, setFlag] = useState<Flag>(start.flag ?? 'none');
  const [note, setNote] = useState(start.note ?? '');
  const [opponentNote, setOpponentNote] = useState(start.opponentNote ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [idBase] = useState(() => newId());

  const turnNumber = Number(turn);
  const turnValid = turn.trim() !== '' && Number.isInteger(turnNumber) && turnNumber >= 1;
  const turnError = submitted && !turnValid ? 'Enter a whole turn number, 1 or higher.' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!turnValid) return;
    onSubmit({
      id: initial?.id ?? newId(),
      turn: turnNumber,
      satisfaction,
      myScore,
      opponentScore,
      flag,
      note,
      opponentNote,
    });
  };

  const turnId = `turn-${idBase}`;
  const noteId = `note-${idBase}`;
  const opponentNoteId = `opponentNote-${idBase}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <div>
        <label htmlFor={turnId} className={labelClass}>
          Turn number
        </label>
        <input
          id={turnId}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          value={turn}
          onChange={(e) => setTurn(e.target.value)}
          aria-invalid={!!turnError}
          aria-describedby={turnError ? `${turnId}-error` : undefined}
          className={inputClass}
        />
        {turnError ? (
          <p id={`${turnId}-error`} className={errorClass}>
            {turnError}
          </p>
        ) : null}
      </div>

      <Segmented
        legend="How happy were you with your line?"
        name={`satisfaction-${idBase}`}
        value={satisfaction}
        onChange={setSatisfaction}
        options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
      />

      <div className="flex gap-3 sm:gap-4">
        <ScoreStepper label="Me" value={myScore} onChange={setMyScore} />
        <ScoreStepper label="Opponent" value={opponentScore} onChange={setOpponentScore} />
      </div>

      <Segmented
        legend="Flag"
        name={`flag-${idBase}`}
        value={flag}
        onChange={setFlag}
        options={[
          { value: 'none', label: 'None' },
          { value: 'mistake', label: 'Mistake' },
          { value: 'great-play', label: 'Great play' },
        ]}
      />

      <div>
        <label htmlFor={noteId} className={labelClass}>
          My play and thinking
        </label>
        <textarea id={noteId} rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor={opponentNoteId} className={labelClass}>
          What the opponent did
        </label>
        <textarea
          id={opponentNoteId}
          rows={3}
          value={opponentNote}
          onChange={(e) => setOpponentNote(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center rounded-lg px-4 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
