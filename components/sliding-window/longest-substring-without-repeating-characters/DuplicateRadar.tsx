import type { LongestSubstringWithoutRepeatingCharactersTraceStep } from "./generateTrace";

export default function DuplicateRadar({
  step,
}: {
  step: LongestSubstringWithoutRepeatingCharactersTraceStep;
}) {
  const duplicates = step.state.ledgerEntries.filter(
    (entry) => Number(entry.have ?? "0") > 1
  );

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Duplicate Radar
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Repeats trigger a leftward cleanup sweep
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            duplicates.length > 0
              ? "border-rose-400/35 bg-rose-500/10 text-rose-100"
              : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
          }`}
        >
          duplicates: {duplicates.length}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        This animation category shows duplicate removal as a visible purge: the
        right edge injects characters, and the left edge sweeps until the
        character-count ledger is clean again.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {duplicates.length === 0 ? (
          <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
            window is unique
          </span>
        ) : (
          duplicates.map((entry) => (
            <span
              key={entry.id}
              className="rounded-full border border-rose-400/35 bg-rose-500/10 px-3 py-1 text-xs text-rose-100"
            >
              {entry.key} x {entry.have}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
