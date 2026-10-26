export type Result = 'win' | 'loss' | 'draw' | 'unfinished';
export type WentFirst = 'first' | 'second';
export type MatchType = 'casual' | 'ranked' | 'tournament';
export type Flag = 'none' | 'mistake' | 'great-play';

export type TurnEntry = {
  id: string;
  turn: number;
  satisfaction: number; // 1-5
  myScore: number; // 0-8
  opponentScore: number; // 0-8
  flag: Flag;
  note: string; // my play and thinking
  opponentNote: string; // what the opponent did
};

export type Game = {
  id: string;
  date: string; // ISO
  deckName: string;
  myLegend: string;
  opponentLegend: string;
  wentFirst: WentFirst;
  matchType: MatchType;
  result: Result;
  preGameNotes: string;
  postGameReflection: string;
  turns: TurnEntry[];
  createdAt: string;
  updatedAt: string;
};

export type StoredData = {
  version: 1;
  games: Game[];
};
