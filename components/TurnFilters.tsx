'use client';

import type { Flag, TurnEntry } from '@/lib/types';
import {
  DEFAULT_TURN_FILTERS,
  countActiveTurnFilters,
  type TurnFilters as Filters,
} from '@/lib/filters';

type Props = {
  turns: TurnEntry[];
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const inputClass =
  'min-h-11 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';
const labelClass = 'mb-1 block text-sm font-medium';

export function TurnFilters({ turns, filters, onChange }: Props) {
  const active = countActiveTurnFilters(filters);
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const turnNumbers = [...new Set(turns.map((t) => t.turn))].sort((a, b) => a - b);

  const toggleSatisfaction = (n: number) =>
    set({
      satisfaction: filters.satisfaction.includes(n)
        ? filters.satisfaction.filter((s) => s !== n)
        : [...filters.satisfaction, n],
    });

  return (
    <details className="mb-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <summary className="flex min-h-11 cursor-pointer items-center rounded-lg px-4 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        {active > 0 ? `Filters (${active})` : 'Filters'}
      </summary>
      <div className="grid gap-4 p-4 pt-2 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-turn" className={labelClass}>
            Turn
          </label>
          <select
            id="filter-turn"
            value={String(filters.turn)}
            onChange={(e) => set({ turn: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
            className={inputClass}
          >
            <option value="all">All turns</option>
            {turnNumbers.map((n) => (
              <option key={n} value={n}>
                Turn {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-flag" className={labelClass}>
            Flag
          </label>
          <select
            id="filter-flag"
            value={filters.flag}
            onChange={(e) => set({ flag: e.target.value as Flag | 'all' })}
            className={inputClass}
          >
            <option value="all">All flags</option>
            <option value="none">None</option>
            <option value="mistake">Mistake</option>
            <option value="great-play">Great play</option>
          </select>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>Satisfaction</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const on = filters.satisfaction.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleSatisfaction(n)}
                  className={`flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg border px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    on
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </fieldset>
        {active > 0 ? (
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => onChange(DEFAULT_TURN_FILTERS)}
              className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 px-4 font-medium hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
    </details>
  );
}
