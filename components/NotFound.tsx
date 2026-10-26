import Link from 'next/link';

type Props = {
  title?: string;
  message?: string;
};

export function NotFound({ title = 'Not found', message = "We couldn't find that game." }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 p-8 text-center dark:border-zinc-800">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{message}</p>
      <Link
        href="/"
        className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
      >
        Back to your games
      </Link>
    </div>
  );
}
