'use client';

import { useRouter } from 'next/navigation';
import { GameForm } from '@/components/GameForm';
import { useGames } from '@/hooks/useGames';

export default function NewGamePage() {
  const router = useRouter();
  const { saveGame } = useGames();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">New game</h1>
      <GameForm
        onSubmit={(game) => {
          const ok = saveGame(game);
          if (ok) router.push(`/games/${game.id}`);
          return ok;
        }}
      />
    </div>
  );
}
