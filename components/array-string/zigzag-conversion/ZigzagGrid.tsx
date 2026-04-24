import type { ZigzagConversionTraceStep } from "./generateTrace";

export default function ZigzagGrid({
  step,
}: {
  step: ZigzagConversionTraceStep;
}) {
  const width =
    step.state.placements.reduce((best, placement) => Math.max(best, placement.col), 0) + 1;

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Zigzag Grid
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Cyan marks the latest placement, purple marks the active read row, and
          green cells are already routed into the grid.
        </p>
      </div>

      {step.state.source.length === 0 ? (
        <div className="rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-8 text-center text-sm text-slate-500">
          Enter a string such as <span className="font-mono">PAYPALISHIRING</span>.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `120px repeat(${Math.max(width, 1)}, minmax(52px, 1fr))`,
            }}
          >
            {Array.from({ length: step.state.numRows }).flatMap((_, row) => {
              const header = (
                <div
                  key={`row-label-${row}`}
                  className={`flex items-center rounded-[0.9rem] border px-3 py-3 text-sm font-semibold ${
                    step.state.readingRow === row
                      ? "border-violet-400/45 bg-violet-500/10 text-violet-50"
                      : "border-slate-700/80 bg-slate-950/75 text-slate-300"
                  }`}
                >
                  row {row}
                </div>
              );

              const cells = Array.from({ length: Math.max(width, 1) }).map((_, col) => {
                const placement = step.state.placements.find(
                  (item) => item.row === row && item.col === col
                );
                let tone =
                  "border-slate-700/80 bg-slate-950/70 text-slate-500 shadow-[0_0_18px_rgba(15,23,42,0.4)]";

                if (placement) {
                  tone =
                    "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]";
                }

                if (
                  placement &&
                  step.state.index !== null &&
                  placement.index === step.state.index
                ) {
                  tone =
                    "border-cyan-400/60 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.2)]";
                }

                if (step.state.readingRow === row) {
                  tone =
                    "border-violet-400/45 bg-violet-500/10 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.16)]";
                }

                if (
                  placement &&
                  step.state.index !== null &&
                  placement.index === step.state.index
                ) {
                  tone =
                    "border-cyan-400/60 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.2)]";
                }

                return (
                  <div
                    key={`cell-${row}-${col}`}
                    className={`rounded-[0.9rem] border px-3 py-3 text-center transition-all ${tone}`}
                  >
                    <div className="font-mono text-lg font-semibold">
                      {placement?.char ?? "·"}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] opacity-70">
                      c{col}
                    </div>
                  </div>
                );
              });

              return [header, ...cells];
            })}
          </div>
        </div>
      )}
    </div>
  );
}
