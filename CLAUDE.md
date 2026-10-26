@AGENTS.md

## Working style
- This is a study project: briefly explain non-obvious choices as you go.
- Plan before coding anything that touches more than 2 files, and wait for approval.
- Stay inside the current phase; no refactors outside it.
- Do not add dependencies, a backend, or a card API without asking.
- After any storage change, verify persistence manually: create, edit and delete an item, reload the page, close and reopen the tab, and confirm the state survived.
- Documentation is part of the deliverable: keep README.md and docs/ current as features land.

## Product requirements (v1)
Quick-entry notes app for logging Riftbound games, used mainly on a PHONE DURING play. Laptop review afterwards is secondary. Speed of entry beats completeness.

### Assignment requirements (must all be met)
1. At least two pages, including a detail page with its own address (`/games/[id]`) that opens the right item directly.
2. The user can create, edit and delete games.
3. Data persists after a full reload and after closing and reopening the tab (localStorage; see docs/storage-decision.md).
4. No blank screens: a readable empty state, and a friendly not-found message for unknown addresses.
5. Responsive layout that works on a laptop and on a phone.

### Game (main entity: create / edit / delete)
date, deckName, myLegend, opponentLegend, wentFirst (first|second), matchType (casual|ranked|tournament), result (win|loss|draw|unfinished), preGameNotes, postGameReflection, turns[]

### Turn entry (nested in a game; add / edit / delete inline on the detail page)
turn (auto-increments), satisfaction (1-5, tap buttons), myScore and opponentScore (0-8 each), flag (none|mistake|great-play), note (my play and thinking), opponentNote (what the opponent did). No card selection; free text only.

### Views and filters
- Games list: filter by result, legend matchup, date range
- Game detail: turn log, filter by turn, satisfaction, flag. Notes are split into "during game" (turn notes) and "after game" (reflection)
- Empty state on every list; friendly not-found for unknown ids

### UX rules
- Phone-first: 44px+ tap targets, minimal typing, sensible defaults
- "Add turn" is one tap from the detail page and pre-fills the next turn number and the previous scores
- Must also work at laptop width (1280px)

### Out of scope (v1)
Card tagging, card database or API, accounts, sync, deck building, free-text search.

## Git and submission
- Work is committed to git and submitted via GitHub.
- Conventional Commits, one commit per phase, each ending with the attribution trailer Claude Code provides.
- Never push or create a remote without explicit approval.
- README.md must cover: what the app is, how to run it, features mapped to the assignment requirements, the storage choice, and the manual test results.
