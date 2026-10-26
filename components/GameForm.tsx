'use client';

import Link from 'next/link';
import { useState } from 'react';
import { newId } from '@/lib/storage';
import type { Game, MatchType, Result, WentFirst } from '@/lib/types';

type Props = {
  initial?: Game;
  onSubmit: (game: Game) => boolean;
};

const inputClass =
  'min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';
const labelClass = 'mb-1 block text-sm font-medium';
const errorClass = 'mt-1 text-sm text-red-700 dark:text-red-400';

function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type SegmentedProps<T extends string> = {
  legend: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
};

function Segmented<T extends string>({ legend, name, value, options, onChange }: SegmentedProps<T>) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-11 min-w-20 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 px-3 text-center has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 dark:border-zinc-700"
          >
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

export function GameForm({ initial, onSubmit }: Props) {
  const [date, setDate] = useState(initial ? initial.date.slice(0, 10) : today());
  const [deckName, setDeckName] = useState(initial?.deckName ?? '');
  const [myLegend, setMyLegend] = useState(initial?.myLegend ?? '');
  const [opponentLegend, setOpponentLegend] = useState(initial?.opponentLegend ?? '');
  const [wentFirst, setWentFirst] = useState<WentFirst>(initial?.wentFirst ?? 'first');
  const [matchType, setMatchType] = useState<MatchType>(initial?.matchType ?? 'casual');
  const [result, setResult] = useState<Result>(initial?.result ?? 'unfinished');
  const [preGameNotes, setPreGameNotes] = useState(initial?.preGameNotes ?? '');
  const [postGameReflection, setPostGameReflection] = useState(initial?.postGameReflection ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const dateError = submitted && !date ? 'Pick a date.' : '';
  const myLegendError = submitted && !myLegend.trim() ? 'Enter your legend.' : '';
  const opponentLegendError = submitted && !opponentLegend.trim() ? "Enter your opponent's legend." : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSaveFailed(false);
    if (!date || !myLegend.trim() || !opponentLegend.trim()) return;
    const now = new Date().toISOString();
    const game: Game = {
      id: initial?.id ?? newId(),
      date,
      deckName: deckName.trim(),
      myLegend: myLegend.trim(),
      opponentLegend: opponentLegend.trim(),
      wentFirst,
      matchType,
      result,
      preGameNotes,
      postGameReflection,
      turns: initial?.turns ?? [],
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    };
    if (!onSubmit(game)) setSaveFailed(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="date" className={labelClass}>
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-invalid={!!dateError}
          aria-describedby={dateError ? 'date-error' : undefined}
          className={inputClass}
        />
        {dateError ? (
          <p id="date-error" className={errorClass}>
            {dateError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="deckName" className={labelClass}>
          Deck name (optional)
        </label>
        <input id="deckName" type="text" value={deckName} onChange={(e) => setDeckName(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor="myLegend" className={labelClass}>
          My legend
        </label>
        <input
          id="myLegend"
          type="text"
          value={myLegend}
          onChange={(e) => setMyLegend(e.target.value)}
          aria-invalid={!!myLegendError}
          aria-describedby={myLegendError ? 'myLegend-error' : undefined}
          className={inputClass}
        />
        {myLegendError ? (
          <p id="myLegend-error" className={errorClass}>
            {myLegendError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="opponentLegend" className={labelClass}>
          Opponent&apos;s legend
        </label>
        <input
          id="opponentLegend"
          type="text"
          value={opponentLegend}
          onChange={(e) => setOpponentLegend(e.target.value)}
          aria-invalid={!!opponentLegendError}
          aria-describedby={opponentLegendError ? 'opponentLegend-error' : undefined}
          className={inputClass}
        />
        {opponentLegendError ? (
          <p id="opponentLegend-error" className={errorClass}>
            {opponentLegendError}
          </p>
        ) : null}
      </div>

      <Segmented
        legend="Went first or second"
        name="wentFirst"
        value={wentFirst}
        onChange={setWentFirst}
        options={[
          { value: 'first', label: 'First' },
          { value: 'second', label: 'Second' },
        ]}
      />

      <Segmented
        legend="Match type"
        name="matchType"
        value={matchType}
        onChange={setMatchType}
        options={[
          { value: 'casual', label: 'Casual' },
          { value: 'ranked', label: 'Ranked' },
          { value: 'tournament', label: 'Tournament' },
        ]}
      />

      <Segmented
        legend="Result"
        name="result"
        value={result}
        onChange={setResult}
        options={[
          { value: 'win', label: 'Win' },
          { value: 'loss', label: 'Loss' },
          { value: 'draw', label: 'Draw' },
          { value: 'unfinished', label: 'Unfinished' },
        ]}
      />

      <div>
        <label htmlFor="preGameNotes" className={labelClass}>
          Before the game
        </label>
        <textarea id="preGameNotes" rows={3} value={preGameNotes} onChange={(e) => setPreGameNotes(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor="postGameReflection" className={labelClass}>
          After the game: reflection
        </label>
        <textarea
          id="postGameReflection"
          rows={4}
          value={postGameReflection}
          onChange={(e) => setPostGameReflection(e.target.value)}
          className={inputClass}
        />
      </div>

      {saveFailed ? (
        <p role="alert" className={errorClass}>
          Couldn&apos;t save — your browser storage may be full or blocked.
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          Save game
        </button>
        <Link
          href={initial ? `/games/${initial.id}` : '/'}
          className="inline-flex min-h-11 items-center rounded-lg px-4 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
