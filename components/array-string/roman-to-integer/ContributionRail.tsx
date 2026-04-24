import type { RomanToIntegerTraceStep } from "./generateTrace";

export default function ContributionRail({
  step,
}: {
  step: RomanToIntegerTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Signed Contributions
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Every processed symbol becomes one signed number in the accumulator.
        </p>
      </div>

      {step.state.contributions.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
          Contributions will appear here as soon as symbols are processed.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {step.state.contributions.map((entry, index) => {
            const positive = entry.signedValue >= 0;

            return (
              <div
                key={`${entry.symbol}-${index}`}
                className={`rounded-[1rem] border px-4 py-3 ${
                  positive
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-50"
                    : "border-rose-400/40 bg-rose-500/10 text-rose-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                    {entry.symbol}
                  </span>
                  <span className="font-mono text-lg">
                    {entry.signedValue > 0 ? "+" : ""}
                    {entry.signedValue}
                  </span>
                </div>
                <p className="mt-2 text-sm opacity-80">{entry.reason}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
