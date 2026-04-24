import type { FirstOccurrenceTraceStep } from "./generateTrace";

export default function MatchLedger({
  step,
}: {
  step: FirstOccurrenceTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Attempt Ledger
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Each entry records what happened at a candidate starting index.
        </p>
      </div>

      {step.state.attempts.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
          Candidate starts will appear here as the scan progresses.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {step.state.attempts.map((attempt) => {
            const tone =
              attempt.status === "match"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-50"
                : attempt.status === "mismatch"
                ? "border-rose-400/40 bg-rose-500/10 text-rose-50"
                : "border-violet-400/35 bg-violet-500/10 text-violet-50";

            return (
              <div key={`attempt-${attempt.start}`} className={`rounded-[1rem] border px-4 py-3 ${tone}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                    start {attempt.start}
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] opacity-75">
                    {attempt.status}
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm">
                  matched prefix = {attempt.matched}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
