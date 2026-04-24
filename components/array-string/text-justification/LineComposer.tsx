import type { TextJustificationTraceStep } from "./generateTrace";

function meterClass(filled: number, total: number) {
  if (filled === total) {
    return "bg-emerald-400";
  }
  return "bg-cyan-400";
}

export default function LineComposer({
  step,
}: {
  step: TextJustificationTraceStep;
}) {
  const usedWidth =
    step.state.currentWords.reduce((sum, word) => sum + word.length, 0) +
    step.state.gapSizes.reduce((sum, gap) => sum + gap, 0) +
    step.state.tailPadding;
  const progress =
    step.state.maxWidth === 0 ? 0 : Math.min((usedWidth / step.state.maxWidth) * 100, 100);

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Active Line Composer
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Words are packed greedily first. Then each gap receives its exact
          space budget before the line is committed.
        </p>
      </div>

      <div className="rounded-[1rem] border border-slate-700/80 bg-slate-950/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          <span>Width Meter</span>
          <span className="font-mono text-slate-300">
            {usedWidth}/{step.state.maxWidth}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-slate-800 bg-slate-950">
          <div
            className={`h-full rounded-full transition-all ${meterClass(
              usedWidth,
              step.state.maxWidth
            )}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step.state.currentWords.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
          The current line is empty.
        </div>
      ) : (
        <div className="mt-4 rounded-[1rem] border border-slate-700/80 bg-slate-950/80 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {step.state.currentWords.map((word, index) => (
              <div key={`${word}-${index}`} className="flex items-center gap-2">
                <div className="rounded-[0.9rem] border border-cyan-400/35 bg-cyan-500/10 px-3 py-2 text-cyan-50">
                  <span className="font-mono text-sm font-semibold">{word}</span>
                </div>
                {index < step.state.currentWords.length - 1 ? (
                  <div className="rounded-[0.9rem] border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-amber-50">
                    <span className="text-xs uppercase tracking-[0.16em]">
                      gap {step.state.gapSizes[index] ?? 1}
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
            {step.state.tailPadding > 0 ? (
              <div className="rounded-[0.9rem] border border-violet-400/35 bg-violet-500/10 px-3 py-2 text-violet-50">
                <span className="text-xs uppercase tracking-[0.16em]">
                  tail {step.state.tailPadding}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-[1rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-emerald-50">
        <p className="text-xs uppercase tracking-[0.18em] opacity-75">
          Visible Preview
        </p>
        <p className="mt-2 break-all font-mono text-lg">
          {step.state.currentLine ? step.state.currentLine.replace(/ /g, "·") : "pending"}
        </p>
      </div>
    </div>
  );
}
