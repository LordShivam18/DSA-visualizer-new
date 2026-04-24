import type { SubstringWithConcatenationOfAllWordsTraceStep } from "./generateTrace";

function statValue(step: SubstringWithConcatenationOfAllWordsTraceStep, label: string) {
  return step.state.stats.find((stat) => stat.label === label)?.value ?? "0";
}

export default function OffsetWave({
  step,
}: {
  step: SubstringWithConcatenationOfAllWordsTraceStep;
}) {
  const offset = Number(statValue(step, "Offset"));
  const wordLength = Number(statValue(step, "Word Length"));

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Offset Wave
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Multiple aligned lanes scan the same source string differently
          </h3>
        </div>
        <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
          active offset {offset}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: Math.max(wordLength, 1) }, (_, lane) => (
          <span
            key={lane}
            className={`rounded-full border px-3 py-1 text-xs transition-all ${
              lane === offset
                ? "border-cyan-400/45 bg-cyan-500/14 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                : "border-slate-700/80 bg-slate-950/70 text-slate-400"
            }`}
          >
            lane {lane}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">
        This visualizer makes the hidden optimization visible: the algorithm
        does not slide one character at a time here. It runs one chunk-aligned
        window per offset.
      </p>
    </div>
  );
}
