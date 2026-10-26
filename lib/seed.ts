import type { Game, TurnEntry } from './types';

// Sample data for development/testing only; there is no UI for it yet.
function turn(
  gameId: string,
  n: number,
  satisfaction: number,
  myScore: number,
  opponentScore: number,
  flag: TurnEntry['flag'],
  note: string,
  opponentNote: string,
): TurnEntry {
  return { id: `${gameId}-t${n}`, turn: n, satisfaction, myScore, opponentScore, flag, note, opponentNote };
}

export function seedDemoGames(): Game[] {
  return [
    {
      id: 'demo-1',
      date: '2026-03-14T18:30:00.000Z',
      deckName: 'Ahri Tempo',
      myLegend: 'Ahri',
      opponentLegend: 'Jinx',
      wentFirst: 'first',
      matchType: 'ranked',
      result: 'win',
      preGameNotes: 'Keep a cheap opener, play around burn.',
      postGameReflection: 'Tempo held up. Should have held back removal on turn 3.',
      turns: [
        turn('demo-1', 1, 4, 1, 0, 'none', 'Played a 1-drop and passed.', 'Played nothing.'),
        turn('demo-1', 2, 3, 2, 1, 'mistake', 'Overextended into a sweeper.', 'Dealt with my board.'),
        turn('demo-1', 3, 5, 4, 1, 'great-play', 'Held removal and won the combat.', 'Missed a land drop.'),
        turn('demo-1', 4, 4, 6, 2, 'none', 'Pressed the advantage.', 'Chump blocked.'),
        turn('demo-1', 5, 5, 8, 2, 'none', 'Finished with lethal.', 'Conceded.'),
      ],
      createdAt: '2026-03-14T18:30:00.000Z',
      updatedAt: '2026-03-14T19:10:00.000Z',
    },
    {
      id: 'demo-2',
      date: '2026-05-02T12:00:00.000Z',
      deckName: 'Viktor Control',
      myLegend: 'Viktor',
      opponentLegend: 'Lux',
      wentFirst: 'second',
      matchType: 'tournament',
      result: 'loss',
      preGameNotes: 'Round 3. Opponent is aggressive.',
      postGameReflection: 'Too slow to stabilise. Mulligan harder for early blockers.',
      turns: [
        turn('demo-2', 1, 2, 0, 1, 'none', 'Kept a slow hand.', 'Opened with a fast attacker.'),
        turn('demo-2', 2, 2, 1, 3, 'mistake', 'Tapped out for value instead of blocking.', 'Hit for a lot.'),
        turn('demo-2', 3, 3, 2, 5, 'none', 'Stabilised the board a bit.', 'Played a burn spell.'),
        turn('demo-2', 4, 1, 2, 8, 'mistake', 'Misjudged lethal range.', 'Went for the win.'),
      ],
      createdAt: '2026-05-02T12:00:00.000Z',
      updatedAt: '2026-05-02T12:45:00.000Z',
    },
    {
      id: 'demo-3',
      date: '2026-06-20T20:15:00.000Z',
      deckName: 'Lux Midrange',
      myLegend: 'Lux',
      opponentLegend: 'Ahri',
      wentFirst: 'first',
      matchType: 'casual',
      result: 'unfinished',
      preGameNotes: 'Testing a new sideboard plan.',
      postGameReflection: 'Stopped early, opponent had to leave.',
      turns: [
        turn('demo-3', 1, 3, 0, 0, 'none', 'Mulligan to a better hand.', 'Kept seven.'),
        turn('demo-3', 2, 4, 2, 1, 'great-play', 'Good curve into a two-drop.', 'Traded evenly.'),
        turn('demo-3', 3, 3, 3, 3, 'none', 'Held mana up for a trick.', 'Attacked into it.'),
      ],
      createdAt: '2026-06-20T20:15:00.000Z',
      updatedAt: '2026-06-20T20:40:00.000Z',
    },
  ];
}
