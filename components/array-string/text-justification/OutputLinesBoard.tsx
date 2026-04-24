import type { TextJustificationTraceStep } from "./generateTrace";

export default function OutputLinesBoard({
  step,
}: {
  step: TextJustificationTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Built Lines
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Committed lines are shown with visible middots so space distribution is easy to inspect.
        </p>
      </div>

      {step.state.builtLines.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
          No lines have been committed yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {step.state.builtLines.map((line, index) => (
            <div
              key={`line-${index}`}
              className="rounded-[1rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-emerald-50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.18em] opacity-75">
                  line {index}
                </span>
                <span className="font-mono text-xs opacity-75">{line.length} chars</span>
              </div>
              <p className="mt-2 break-all font-mono text-lg">{line.replace(/ /g, "·")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
