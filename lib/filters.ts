import type { Flag, Game, Result, TurnEntry } from './types';

export type GameFilters = {
  result: Result | 'all';
  myLegend: string; // '' = any
  opponentLegend: string; // '' = any
  dateFrom: string; // YYYY-MM-DD, '' = open
  dateTo: string; // YYYY-MM-DD, '' = open
};

export type TurnFilters = {
  turn: number | 'all';
  satisfaction: number[]; // empty = any
  flag: Flag | 'all';
};

export const DEFAULT_GAME_FILTERS: GameFilters = {
  result: 'all',
  myLegend: '',
  opponentLegend: '',
  dateFrom: '',
  dateTo: '',
};

export const DEFAULT_TURN_FILTERS: TurnFilters = {
  turn: 'all',
  satisfaction: [],
  flag: 'all',
};

const norm = (s: string) => s.trim().toLowerCase();

export function filterGames(games: Game[], f: GameFilters): Game[] {
  const my = norm(f.myLegend);
  const opp = norm(f.opponentLegend);
  return games.filter((g) => {
    if (f.result !== 'all' && g.result !== f.result) return false;
    if (my && norm(g.myLegend) !== my) return false;
    if (opp && norm(g.opponentLegend) !== opp) return false;
    const day = g.date.slice(0, 10);
    if (f.dateFrom && day < f.dateFrom.slice(0, 10)) return false;
    if (f.dateTo && day > f.dateTo.slice(0, 10)) return false;
    return true;
  });
}

export function filterTurns(turns: TurnEntry[], f: TurnFilters): TurnEntry[] {
  return turns.filter((t) => {
    if (f.turn !== 'all' && t.turn !== f.turn) return false;
    if (f.satisfaction.length > 0 && !f.satisfaction.includes(t.satisfaction)) return false;
    if (f.flag !== 'all' && t.flag !== f.flag) return false;
    return true;
  });
}

export function countActiveGameFilters(f: GameFilters): number {
  return [
    f.result !== 'all',
    norm(f.myLegend) !== '',
    norm(f.opponentLegend) !== '',
    f.dateFrom !== '',
    f.dateTo !== '',
  ].filter(Boolean).length;
}

export function countActiveTurnFilters(f: TurnFilters): number {
  return [f.turn !== 'all', f.satisfaction.length > 0, f.flag !== 'all'].filter(Boolean).length;
}

// Case-insensitively de-duplicated, sorted display values (first spelling seen wins).
export function distinctLegends(games: Game[], key: 'myLegend' | 'opponentLegend'): string[] {
  const seen = new Map<string, string>();
  for (const g of games) {
    const display = g[key].trim();
    if (display && !seen.has(display.toLowerCase())) seen.set(display.toLowerCase(), display);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
