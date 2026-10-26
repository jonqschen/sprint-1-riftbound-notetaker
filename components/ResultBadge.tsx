import type { Result } from '@/lib/types';

const STYLES: Record<Result, { label: string; className: string }> = {
  win: { label: 'Win', className: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
  loss: { label: 'Loss', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  draw: { label: 'Draw', className: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200' },
  unfinished: { label: 'Unfinished', className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
};

export function ResultBadge({ result }: { result: Result }) {
  const { label, className } = STYLES[result];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-medium ${className}`}>{label}</span>
  );
}
