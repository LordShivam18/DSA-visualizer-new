import type { QueryRecord } from "./generateTrace";
import { formatValue } from "./generateTrace";

type Props = {
  queries: QueryRecord[];
  answers: (number | null)[];
  currentQueryIndex: number | null;
};

export default function QueryStrip({
  queries,
  answers,
  currentQueryIndex,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Query Ledger
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Every query reuses the same weighted graph and launches a fresh search.
          </p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {queries.length}
        </span>
      </div>

      {queries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-6 text-sm text-slate-500">
          Add at least one query to see the search replay.
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          {queries.map((query, index) => {
            const answer = answers[index];
            const isCurrent = currentQueryIndex === index;

            return (
              <div
                key={`${query.from}-${query.to}-${index}`}
                className={`rounded-xl border px-3 py-3 transition-all ${
                  isCurrent
                    ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.14)]"
                    : answer !== null
                    ? "border-emerald-400/35 bg-emerald-500/8 text-emerald-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm">
                    {query.from} / {query.to}
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-950/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                    {answer === null ? "waiting" : "ready"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Answer snapshot:{" "}
                  <span className="font-mono text-slate-200">
                    {formatValue(answer)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
