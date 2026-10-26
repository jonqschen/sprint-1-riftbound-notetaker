'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { NotFound } from '@/components/NotFound';
import { ResultBadge } from '@/components/ResultBadge';
import { formatDate } from '@/components/formatDate';
import { useGames } from '@/hooks/useGames';

const linkClass =
  'inline-flex min-h-11 items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';
const secondaryButton =
  'inline-flex min-h-11 items-center rounded-lg border border-zinc-300 px-4 font-medium hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800';

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { status, getGame, removeGame } = useGames();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  if (status === 'loading' || deleting) {
    return <p className="text-zinc-600 dark:text-zinc-400">{deleting ? 'Deleting…' : 'Loading game…'}</p>;
  }

  const game = getGame(id);
  if (!game) return <NotFound title="Game not found" />;

  const handleDelete = () => {
    // Set first so the page doesn't flash "not found" once the game is gone.
    setDeleting(true);
    if (removeGame(id)) {
      router.push('/');
    } else {
      setDeleting(false);
      setDeleteFailed(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className={`${linkClass} self-start text-indigo-700 dark:text-indigo-400`}>
        ← Back to games
      </Link>

      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">
            {game.myLegend} vs {game.opponentLegend}
          </h1>
          <ResultBadge result={game.result} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Date</dt>
            <dd>{formatDate(game.date)}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Deck</dt>
            <dd>{game.deckName || '—'}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Match type</dt>
            <dd className="capitalize">{game.matchType}</dd>
          </div>
          <div>
            <dt className="text-zinc-600 dark:text-zinc-400">Turn order</dt>
            <dd>{game.wentFirst === 'first' ? 'Went first' : 'Went second'}</dd>
          </div>
        </dl>
      </div>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Before the game</h2>
        {game.preGameNotes ? (
          <p className="whitespace-pre-wrap">{game.preGameNotes}</p>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">No notes yet.</p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Turns</h2>
        <EmptyState heading="No turns logged yet" message="Turn logging is coming next." />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">After the game</h2>
        {game.postGameReflection ? (
          <p className="whitespace-pre-wrap">{game.postGameReflection}</p>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">No reflection yet.</p>
        )}
      </section>

      <section className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        {deleteFailed ? (
          <p role="alert" className="mb-3 text-sm text-red-700 dark:text-red-400">
            Couldn&apos;t delete — your browser storage may be blocked.
          </p>
        ) : null}
        {confirming ? (
          <div role="alertdialog" aria-label="Confirm delete" className="rounded-lg border border-red-300 p-4 dark:border-red-900">
            <p className="font-medium">Delete this game? This can&apos;t be undone.</p>
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={() => setConfirming(false)} className={secondaryButton}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex min-h-11 items-center rounded-lg bg-red-700 px-4 font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
              >
                Yes, delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href={`/games/${id}/edit`}
              className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            >
              Edit
            </Link>
            <button type="button" onClick={() => setConfirming(true)} className={secondaryButton}>
              Delete
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
