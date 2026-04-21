import MatrixCell from "./MatrixCell";
import { type MatrixSearchTraceStep } from "./generateTrace";

type Props = {
  step: MatrixSearchTraceStep;
};

export default function MatrixSearchVisualizer({ step }: Props) {
  const totalCells = step.state.rows * step.state.cols;

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
            <h2 className="text-lg font-semibold text-slate-50">
              Matrix Search Field
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            The grid stays in matrix form while the trace searches it like one
            long sorted array.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
            Window {step.state.left} to {step.state.right}
          </span>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-200">
            Mid {step.state.mid ?? "none"}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-200">
            Cells {totalCells}
          </span>
        </div>
      </div>

      {step.state.valid ? (
        <>
          <div
            className="mt-5 grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.max(step.state.cols, 1)}, minmax(0, 1fr))`,
            }}
          >
            {step.state.matrix.flatMap((row, rowIndex) =>
              row.map((value, colIndex) => {
                const flatIndex = rowIndex * step.state.cols + colIndex;

                return (
                  <MatrixCell
                    key={`${rowIndex}-${colIndex}`}
                    value={value}
                    row={rowIndex}
                    col={colIndex}
                    flatIndex={flatIndex}
                    searchLeft={step.state.left}
                    searchRight={step.state.right}
                    midIndex={step.state.mid}
                    resultCoord={
                      step.state.result && step.state.midCoord
                        ? step.state.midCoord
                        : null
                    }
                  />
                );
              })
            )}
          </div>

          <div className="mt-6 rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Flat Index Tape
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Each chip shows the row-major index that binary search really
                  operates on.
                </p>
              </div>
              <div className="text-sm text-slate-300">
                Target{" "}
                <span className="font-mono text-cyan-200">
                  {step.state.target ?? "invalid"}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {step.state.matrix.flatMap((row, rowIndex) =>
                row.map((value, colIndex) => {
                  const flatIndex = rowIndex * step.state.cols + colIndex;
                  const isMid = step.state.mid === flatIndex;
                  const inRange =
                    flatIndex >= step.state.left && flatIndex <= step.state.right;
                  const isFound =
                    step.state.result === true && step.state.resultIndex === flatIndex;

                  return (
                    <div
                      key={`tape-${flatIndex}`}
                      className={`rounded-xl border px-3 py-2 text-center font-mono text-sm transition-all duration-300 ${
                        isFound
                          ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-100"
                          : isMid
                          ? "border-yellow-400/55 bg-yellow-500/12 text-yellow-100"
                          : inRange
                          ? "border-cyan-400/35 bg-cyan-500/8 text-cyan-100"
                          : "border-slate-800/80 bg-slate-950/70 text-slate-500"
                      }`}
                    >
                      <div className="text-[11px] text-slate-500">#{flatIndex}</div>
                      <div className="mt-1">{value}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[1.2rem] border border-rose-400/30 bg-rose-500/8 p-5 text-sm leading-7 text-rose-100">
          {step.state.message ?? "Provide a rectangular matrix and numeric target."}
        </div>
      )}
    </div>
  );
}
