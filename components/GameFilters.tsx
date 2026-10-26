'use client';

import type { Game, Result } from '@/lib/types';
import {
  DEFAULT_GAME_FILTERS,
  countActiveGameFilters,
  distinctLegends,
  type GameFilters as Filters,
} from '@/lib/filters';

type Props = {
  games: Game[];
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const inputClass =
  'min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';
const labelClass = 'mb-1 block text-sm font-medium';

export function GameFilters({ games, filters, onChange }: Props) {
  const active = countActiveGameFilters(filters);
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <details className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <summary className="flex min-h-11 cursor-pointer items-center rounded-lg px-4 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        {active > 0 ? `Filters (${active})` : 'Filters'}
      </summary>
      <div className="grid gap-4 p-4 pt-2 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-result" className={labelClass}>
            Result
          </label>
          <select
            id="filter-result"
            value={filters.result}
            onChange={(e) => set({ result: e.target.value as Result | 'all' })}
            className={inputClass}
          >
            <option value="all">All results</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="draw">Draw</option>
            <option value="unfinished">Unfinished</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-my-legend" className={labelClass}>
            My legend
          </label>
          <select
            id="filter-my-legend"
            value={filters.myLegend}
            onChange={(e) => set({ myLegend: e.target.value })}
            className={inputClass}
          >
            <option value="">Any legend</option>
            {distinctLegends(games, 'myLegend').map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-opponent-legend" className={labelClass}>
            Opponent&apos;s legend
          </label>
          <select
            id="filter-opponent-legend"
            value={filters.opponentLegend}
            onChange={(e) => set({ opponentLegend: e.target.value })}
            className={inputClass}
          >
            <option value="">Any legend</option>
            {distinctLegends(games, 'opponentLegend').map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="filter-from" className={labelClass}>
              From
            </label>
            <input
              id="filter-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => set({ dateFrom: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="filter-to" className={labelClass}>
              To
            </label>
            <input
              id="filter-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => set({ dateTo: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        {active > 0 ? (
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => onChange(DEFAULT_GAME_FILTERS)}
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
