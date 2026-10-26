# Riftbound Notes

Single-user, no-backend note-taking app for logging Riftbound TCG games, used mainly on a phone during play. All data lives in the browser (localStorage).

## Stack
- Next.js (App Router), TypeScript (strict), Tailwind CSS
- No extra runtime dependencies without asking first
- Next.js APIs change between versions: check `node_modules/next/dist/docs` (if present) before using APIs from memory

## Commands
- `npm run dev` (pinned to port 3000: `next dev -p 3000`; storage is per-origin, so always open http://localhost:3000)
- `npm run lint`
- `npm run build`
- Run `npm run lint && npm run build` before calling any phase done

## Architecture
- `lib/types.ts`: Game and TurnEntry types
- `lib/storage.ts`: the ONLY file that touches `localStorage`. Exposes list, get, save, remove, exportAll
- `lib/filters.ts`: pure filter functions for the games list and the turn log
- `hooks/useGames.ts`: hydration-safe access to storage with a `loading | ready` state
- `app/`: routes. Pages that read stored data are client components
- `docs/storage-decision.md`: why localStorage was chosen (research and sources)

## Data model
Stored as one versioned JSON blob: `{ version: 1, games: Game[] }`. Dates are ISO strings.

Game: id, date, deckName, myLegend, opponentLegend, wentFirst (first|second), matchType (casual|ranked|tournament), result (win|loss|draw|unfinished), preGameNotes, postGameReflection, turns: TurnEntry[], createdAt, updatedAt

TurnEntry: id, turn (number), satisfaction (1-5), myScore (0-8), opponentScore (0-8), flag (none|mistake|great-play), note (my play and thinking), opponentNote (what the opponent did)

No card selection, card tagging or card database. Free text only.

## Routes
- `/` games list (filter by result, legend matchup, date range; newest first)
- `/games/new` create a game
- `/games/[id]` detail page: turn log, filters (turn, satisfaction, flag), edit and delete
- `/games/[id]/edit` edit a game
- Unknown ids show a friendly not-found message

## Conventions
- Ids via `crypto.randomUUID()`
- Never read storage during render; read in `useEffect` and show a loading state first (avoids hydration mismatch)
- Distinguish loading from empty: every list has an empty state, every id lookup has a not-found state
- Do writes in event handlers, not effects (React Strict Mode runs effects twice in dev)
- Wrap `JSON.parse` and `setItem` in try/catch; fall back to an empty list on corrupt data
- Confirm before deleting
- Mobile-first: 44px+ tap targets; verify at 375px and 1280px widths
- Keep components small and match the surrounding code style

## Git
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `style:`), one commit per phase
- Only commit when lint and build pass
- Never push or create remotes without explicit approval
