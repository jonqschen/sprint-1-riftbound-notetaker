# Storage decision: why localStorage

## Context

- Riftbound Notes is used by one person, on one browser, with no backend and no login.
- Data must survive a page reload and also closing and reopening the tab or browser.
- Expected size is small: a few hundred games at most, each with a handful of turns of short text.

## Options considered

| Option | Capacity | Sync / async | Survives tab close | Main drawback |
| --- | --- | --- | --- | --- |
| localStorage [3] | About 5 MiB per origin [1] | Sync | Yes | Strings only (UTF-16), blocks the main thread on big reads/writes, no locking [15] |
| sessionStorage [4] | About 5 MiB per origin [1] | Sync | No, cleared when the tab closes | Fails the "reopen the tab" requirement |
| IndexedDB (raw) [5] | Large, a share of free disk [1] | Async | Yes | Verbose, event/callback-style API |
| IndexedDB via Dexie [8][9] or idb [11] | Same as IndexedDB | Async | Yes | Extra dependency, async loading states, more code for tiny data |
| Cookies [6] | About 4 KB | Sync | Only if given an expiry | Far too small, sent with every request |
| Cache API [12] | Same pool as IndexedDB | Async | Yes | Made for HTTP responses, not app records |
| OPFS [13] | Same pool as IndexedDB | Async | Yes | File-based, you build your own record format and querying |

## Decision

Use localStorage, hidden behind one repository module, `lib/storage.ts`. The whole app state is a single versioned JSON blob under the key `riftbound-notes`: `{ version: 1, games: [...] }`.

Why:

- The data is small. As a rough estimate (arithmetic, not measured), 300 games could use about half of the ~5 MiB cap.
- Filtering is done in plain JavaScript over the loaded list, so IndexedDB indexes would add little.
- No extra dependency is needed.
- It is easy to debug: open DevTools, Application, Local Storage, and read the JSON.
- Only `lib/storage.ts` touches localStorage, so the rest of the app never needs to know how data is stored.

## Initially recommended: IndexedDB via Dexie

Honest note: the first round of research leaned towards IndexedDB with Dexie, because it has much more headroom and is the usual choice for larger apps. The decision changed because the data is small and this is a learning sprint with a limited scope. Dexie would add a dependency, async loading states and more moving parts for a benefit this app does not need yet.

## When to switch

- Stored data grows past roughly 1-2 MB, or saves start to feel slow (every save rewrites the whole blob).
- Because of the repository module, switching should be a one-file swap of `lib/storage.ts` (the hook and pages would need small changes to handle async).

## Risks and mitigations

- **Eviction or "clear site data" wipes everything.** Browsers can evict or the user can clear storage [1]. Safari has a 7-day rule for script-written storage [1]; whether it applies to localhost is unverified.
- **Storage is per origin, and the origin includes the port [14].** Changing host or port shows empty data. Mitigation: the dev server is pinned to port 3000 (`npm run dev` runs `next dev -p 3000`).
- **Private windows** use temporary storage that is discarded when the window closes.
- **Quota full (QuotaExceededError).** `lib/storage.ts` catches write errors and `saveGame`/`removeGame` return `false`; the UI shows a message such as "Couldn't save — your browser storage may be full or blocked."
- **Hydration safety.** Server-rendered HTML cannot see localStorage, and client components are still prerendered [17], so reading it during render causes a mismatch [7]. The `useGames` hook reads storage only in `useEffect` and shows a loading state first.
- **Backup.** `lib/storage.ts` has an `exportAll` function that returns the data as JSON text. There is no button for it in the UI yet, so today it is a code-level helper only (a grep finds it only in `lib/storage.ts`).

## Unverified claims

- Whether Safari's 7-day rule applies on localhost.
- Whether browsers count the 5 MiB limit in bytes or in characters (UTF-16 units).
- How Chrome decides the outcome of `navigator.storage.persist()` on localhost [10].

## Sources

1. https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria (quotas, 5 MiB, eviction, Safari 7-day rule)
2. https://web.dev/articles/storage-for-the-web (which storage for what; sync APIs)
3. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage (persists across sessions, UTF-16 strings, per origin)
4. https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage (cleared when the tab closes)
5. https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API (async, structured clone, indexes)
6. https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies (4 KB, sent with every request)
7. https://nextjs.org/docs/messages/react-hydration-error (hydration mismatch causes)
8. https://dexie.org/docs/MultiEntry-Index
9. https://dexie.org/docs/dexie-react-hooks/useLiveQuery()
10. https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
11. https://github.com/jakearchibald/idb
12. https://developer.mozilla.org/en-US/docs/Web/API/Cache
13. https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
14. https://developer.mozilla.org/en-US/docs/Glossary/Origin (origin includes the port)
15. https://html.spec.whatwg.org/multipage/webstorage.html (no locking; spec sets no fixed size)
16. https://dexie.org/docs/ExportImport/dexie-export-import
17. https://nextjs.org/docs/app/guides/lazy-loading (client components are prerendered)
