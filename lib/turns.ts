import type { TurnEntry } from './types';

// Quick-entry defaults for a new turn: next turn number, scores carried over from the latest turn.
export function nextTurnDefaults(turns: TurnEntry[]): Partial<TurnEntry> {
  if (turns.length === 0) return { turn: 1, myScore: 0, opponentScore: 0 };
  let latest = turns[0];
  for (const t of turns) if (t.turn >= latest.turn) latest = t;
  return { turn: latest.turn + 1, myScore: latest.myScore, opponentScore: latest.opponentScore };
}
