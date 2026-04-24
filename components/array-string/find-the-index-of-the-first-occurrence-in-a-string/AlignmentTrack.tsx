import type { FirstOccurrenceTraceStep } from "./generateTrace";

export default function AlignmentTrack({
  step,
}: {
  step: FirstOccurrenceTraceStep;
}) {
  const activeStart = step.state.start ?? -1;
  const compareIndex = step.state.compareIndex ?? -1;

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Alignment Track
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          The needle slides under the haystack. Green marks a matched prefix,
          yellow marks the active character comparison, and purple marks the
          current window start.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1rem] border border-slate-700/80 bg-slate-950/80 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Haystack</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...step.state.haystack].map((char, index) => {
              const inWindow =
                step.state.start !== null &&
                index >= activeStart &&
                index < activeStart + step.state.needle.length;
              const alignedOffset = index - activeStart;
              const matched = inWindow && alignedOffset >= 0 && alignedOffset < step.state.matched;
              const active = inWindow && alignedOffset === compareIndex;

              let tone =
                "border-slate-700/80 bg-slate-950/75 text-slate-200 shadow-[0_0_18px_rgba(15,23,42,0.4)]";
              if (inWindow) {
                tone =
                  "border-violet-400/35 bg-violet-500/10 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.14)]";
              }
              if (matched) {
                tone =
                  "border-emerald-400/45 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
              }
              if (active) {
                tone =
                  "border-amber-400/55 bg-amber-500/12 text-amber-50 shadow-[0_0_28px_rgba(245,158,11,0.2)]";
              }

              return (
                <div
                  key={`hay-${index}`}
                  className={`min-w-[64px] rounded-[0.9rem] border px-3 py-3 text-center transition-all ${tone}`}
                >
                  <div className="text-[10px] uppercase tracking-[0.16em] opacity-70">
                    {index}
                  </div>
                  <div className="mt-1 font-mono text-2xl font-semibold">{char}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1rem] border border-slate-700/80 bg-slate-950/80 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Needle</p>
          {step.state.needle.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">The needle is empty.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2" style={{ marginLeft: `${Math.max(activeStart, 0) * 72}px` }}>
              {[...step.state.needle].map((char, index) => {
                const matched = index < step.state.matched;
                const active = step.state.compareIndex === index;

                let tone =
                  "border-slate-700/80 bg-slate-950/75 text-slate-200 shadow-[0_0_18px_rgba(15,23,42,0.4)]";
                if (matched) {
                  tone =
                    "border-emerald-400/45 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
                }
                if (active) {
                  tone =
                    "border-cyan-400/60 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.2)]";
                }

                return (
                  <div
                    key={`needle-${index}`}
                    className={`min-w-[64px] rounded-[0.9rem] border px-3 py-3 text-center transition-all ${tone}`}
                  >
                    <div className="text-[10px] uppercase tracking-[0.16em] opacity-70">
                      {index}
                    </div>
                    <div className="mt-1 font-mono text-2xl font-semibold">{char}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
