import type { ReactNode } from 'react';

type Props = {
  heading: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ heading, message, action }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
      <h2 className="text-lg font-semibold">{heading}</h2>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{message}</p>
      {action ? <div className="mt-4 flex flex-col items-center gap-3">{action}</div> : null}
    </div>
  );
}
