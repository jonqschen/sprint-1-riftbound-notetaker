'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { GameForm } from '@/components/GameForm';
import { NotFound } from '@/components/NotFound';
import { useGames } from '@/hooks/useGames';

export default function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { status, getGame, saveGame } = useGames();

  if (status === 'loading') {
    return <p className="text-zinc-600 dark:text-zinc-400">Loading game…</p>;
  }

  const game = getGame(id);
  if (!game) return <NotFound title="Game not found" />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Edit game</h1>
      <GameForm
        initial={game}
        onSubmit={(updated) => {
          const ok = saveGame(updated);
          if (ok) router.push(`/games/${id}`);
          return ok;
        }}
      />
    </div>
  );
}
