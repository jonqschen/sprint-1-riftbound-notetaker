import type { Game, StoredData } from './types';

// The only file that touches localStorage.
const STORAGE_KEY = 'riftbound-notes';

export function newId(): string {
  return crypto.randomUUID();
}

export const newGameId = newId;
export const newTurnId = newId;

// Never throws and never overwrites bad data: corrupt or unexpected data reads as empty.
export function listGames(): Game[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Partial<StoredData> | null;
    if (!data || data.version !== 1 || !Array.isArray(data.games)) return [];
    return data.games;
  } catch {
    return [];
  }
}

export function getGame(id: string): Game | undefined {
  return listGames().find((g) => g.id === id);
}

// Returns false on failure (e.g. QuotaExceededError) so the UI can show a message.
function write(games: Game[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const data: StoredData = { version: 1, games };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function saveGame(game: Game): boolean {
  const games = listGames();
  const updated: Game = { ...game, updatedAt: new Date().toISOString() };
  const index = games.findIndex((g) => g.id === game.id);
  if (index === -1) games.push(updated);
  else games[index] = updated;
  return write(games);
}

export function removeGame(id: string): boolean {
  return write(listGames().filter((g) => g.id !== id));
}

export function exportAll(): string {
  const data: StoredData = { version: 1, games: listGames() };
  return JSON.stringify(data, null, 2);
}

export function replaceAll(games: Game[]): boolean {
  return write(games);
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
