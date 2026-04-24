import type { ZigzagConversionTraceStep } from "./generateTrace";

export default function RowAssembler({
  step,
}: {
  step: ZigzagConversionTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Row Buffers
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          After routing, the answer is produced by concatenating these rows from
          top to bottom.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {step.state.rows.map((row, index) => (
          <div
            key={`row-buffer-${index}`}
            className={`rounded-[1rem] border px-4 py-3 ${
              step.state.readingRow === index
                ? "border-violet-400/45 bg-violet-500/10 text-violet-50"
                : "border-slate-700/80 bg-slate-950/80 text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.18em] opacity-75">
                row {index}
              </span>
              <span className="font-mono text-xs opacity-70">{row.length} chars</span>
            </div>
            <div className="mt-2 break-all font-mono text-lg">{row || "·"}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[1rem] border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-cyan-50">
        <p className="text-xs uppercase tracking-[0.18em] opacity-75">
          Readout So Far
        </p>
        <p className="mt-2 break-all font-mono text-lg">{step.state.result || "·"}</p>
      </div>
    </div>
  );
}
