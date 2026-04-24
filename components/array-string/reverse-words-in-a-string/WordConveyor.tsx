import type { ReverseWordsTraceStep } from "./generateTrace";

function rowTone(active: boolean, tone: "cyan" | "green") {
  if (!active) {
    return "border-slate-700/80 bg-slate-950/75 text-slate-200";
  }
  return tone === "cyan"
    ? "border-cyan-400/50 bg-cyan-500/12 text-cyan-50"
    : "border-emerald-400/50 bg-emerald-500/12 text-emerald-50";
}

export default function WordConveyor({
  step,
}: {
  step: ReverseWordsTraceStep;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Extracted Words
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          The parser pulls clean words from left to right.
        </p>
        {step.state.extracted.length === 0 ? (
          <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
            Extraction has not produced any words yet.
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {step.state.extracted.map((word, index) => (
              <div
                key={`${word}-${index}`}
                className={`rounded-[1rem] border px-4 py-3 shadow-[0_0_24px_rgba(34,211,238,0.08)] ${rowTone(
                  step.pointers.sourceIndex === index,
                  "cyan"
                )}`}
              >
                <div className="text-xs uppercase tracking-[0.16em] opacity-70">
                  slot {index}
                </div>
                <div className="mt-1 font-mono text-lg font-semibold">{word}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Reversed Output
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          The answer is assembled from the last extracted word back to the first.
        </p>
        {step.state.reversedWords.length === 0 ? (
          <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
            Reverse assembly has not started yet.
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-3">
              {step.state.reversedWords.map((word, index) => (
                <div
                  key={`${word}-${index}`}
                  className={`rounded-[1rem] border px-4 py-3 shadow-[0_0_24px_rgba(52,211,153,0.12)] ${rowTone(
                    index === step.state.reversedWords.length - 1,
                    "green"
                  )}`}
                >
                  <div className="text-xs uppercase tracking-[0.16em] opacity-70">
                    out {index}
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold">{word}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[1rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-emerald-50">
              <p className="text-xs uppercase tracking-[0.18em] opacity-75">
                Sentence So Far
              </p>
              <p className="mt-2 break-all font-mono text-lg">{step.state.output}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
