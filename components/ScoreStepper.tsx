type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const MIN = 0;
const MAX = 8;
const stepButton =
  'inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-zinc-300 text-xl font-semibold hover:bg-zinc-100 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800';

export function ScoreStepper({ label, value, onChange }: Props) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1 text-sm font-medium">{label}</p>
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label={`Decrease ${label} score`}
          disabled={value <= MIN}
          onClick={() => onChange(Math.max(MIN, value - 1))}
          className={stepButton}
        >
          −
        </button>
        <span aria-live="polite" className="min-w-6 text-center text-3xl font-semibold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label} score`}
          disabled={value >= MAX}
          onClick={() => onChange(Math.min(MAX, value + 1))}
          className={stepButton}
        >
          +
        </button>
      </div>
    </div>
  );
}
