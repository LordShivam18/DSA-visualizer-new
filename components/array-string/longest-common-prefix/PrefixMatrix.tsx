import type { LongestCommonPrefixTraceStep } from "./generateTrace";

export default function PrefixMatrix({
  step,
}: {
  step: LongestCommonPrefixTraceStep;
}) {
  const maxColumns = step.state.words.reduce(
    (best, word) => Math.max(best, word.length),
    0
  );

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Prefix Matrix
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          A vertical scanner tests one character column at a time across all
          words.
        </p>
      </div>

      {step.state.words.length === 0 ? (
        <div className="rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-8 text-center text-sm text-slate-500">
          Enter a JSON list like{" "}
          <span className="font-mono">[&quot;flower&quot;,&quot;flow&quot;,&quot;flight&quot;]</span>.
        </div>
      ) : (
        <div className="space-y-3">
          {step.state.words.map((word, rowIndex) => (
            <div key={`${word}-${rowIndex}`} className="flex items-center gap-3">
              <span className="w-16 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-center text-xs text-slate-400">
                word {rowIndex}
              </span>
              <div
                className="grid flex-1 gap-2"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(maxColumns, 1)}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: Math.max(maxColumns, 1) }).map((_, column) => {
                  const char = word[column] ?? "";
                  const accepted = column < step.state.prefix.length;
                  const activeColumn = step.state.column === column;
                  const activeWord = step.state.compareWord === rowIndex;
                  const mismatchRow = step.state.mismatchWordIndex === rowIndex;

                  let tone =
                    "border-slate-700/80 bg-slate-950/70 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.4)]";
                  if (accepted) {
                    tone =
                      "border-emerald-400/45 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
                  }
                  if (activeColumn) {
                    tone =
                      "border-amber-400/55 bg-amber-500/10 text-amber-50 shadow-[0_0_26px_rgba(245,158,11,0.18)]";
                  }
                  if (activeColumn && activeWord) {
                    tone =
                      "border-cyan-400/65 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.22)]";
                  }
                  if (activeColumn && mismatchRow) {
                    tone =
                      "border-rose-400/60 bg-rose-500/12 text-rose-50 shadow-[0_0_28px_rgba(244,63,94,0.2)]";
                  }

                  return (
                    <div
                      key={`${rowIndex}-${column}`}
                      className={`rounded-[0.9rem] border px-3 py-3 text-center transition-all ${tone}`}
                    >
                      <div className="font-mono text-xl font-semibold">{char || "∅"}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.16em] opacity-70">
                        col {column}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
