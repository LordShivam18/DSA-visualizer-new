import BoardCell from "./BoardCell";
import FrontierQueue from "./FrontierQueue";
import {
  formatCoord,
  type SurroundedRegionsTraceStep,
} from "./generateTrace";

function keyOf(row: number, col: number) {
  return `${row}-${col}`;
}

function labelForPhase(phase: string) {
  switch (phase) {
    case "border-scan":
      return "Border Scan";
    case "mark-safe":
      return "Mark Safe";
    case "capture-pass":
      return "Capture Pass";
    default:
      return "Done";
  }
}

export default function SurroundedRegionsWorkbench({
  step,
}: {
  step: SurroundedRegionsTraceStep;
}) {
  const safeSet = new Set<string>();
  const capturedSet = new Set<string>();
  const queueSet = new Set(step.state.frontier.map((coord) => keyOf(coord.row, coord.col)));

  step.state.safe.forEach((row, rowIndex) =>
    row.forEach((value, colIndex) => {
      if (value) {
        safeSet.add(keyOf(rowIndex, colIndex));
      }
    })
  );

  step.state.captured.forEach((row, rowIndex) =>
    row.forEach((value, colIndex) => {
      if (value) {
        capturedSet.add(keyOf(rowIndex, colIndex));
      }
    })
  );

  const scanKey = step.pointers.scan
    ? keyOf(step.pointers.scan.row, step.pointers.scan.col)
    : null;
  const currentKey = step.pointers.current
    ? keyOf(step.pointers.current.row, step.pointers.current.col)
    : null;
  const neighborKey = step.pointers.neighbor
    ? keyOf(step.pointers.neighbor.row, step.pointers.neighbor.col)
    : null;
  const queueFrontKey = step.pointers.queueFront
    ? keyOf(step.pointers.queueFront.row, step.pointers.queueFront.col)
    : null;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Border BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Protect border-connected O cells, then capture what stays enclosed
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the cell being expanded, purple shows the scan cursor,
            yellow shows the neighbor check, green marks safe O cells, and red
            marks cells that have been captured.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Phase: {labelForPhase(step.state.phase)}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Safe: {step.state.safeCount}
          </span>
          <span className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-rose-100">
            Captured: {step.state.capturedCount}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Scan Cursor
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {formatCoord(step.pointers.scan)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            BFS Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {formatCoord(step.pointers.current)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {formatCoord(step.pointers.neighbor)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.frontier.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active BFS expansion
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: scan cursor
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: neighbor under test
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: safe O
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: captured O
        </span>
      </div>

      {step.state.rows === 0 || step.state.cols === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          Enter a board with X and O cells to see the capture process.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${step.state.cols}, minmax(0, 1fr))`,
              }}
            >
              {step.state.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const key = keyOf(rowIndex, colIndex);
                  const isSafe = safeSet.has(key);
                  const isCaptured = capturedSet.has(key);
                  const isCurrent = currentKey === key;
                  const isNeighbor = neighborKey === key;
                  const isScan = scanKey === key;
                  const isQueueFront = queueFrontKey === key;
                  const isQueued = queueSet.has(key);

                  const tags: string[] = [];
                  if (isCurrent) {
                    tags.push("CUR");
                  } else if (isNeighbor) {
                    tags.push("CHK");
                  } else if (isScan) {
                    tags.push("SCAN");
                  }

                  if (isQueueFront && !tags.includes("FRONT")) {
                    tags.push("FRONT");
                  } else if (isQueued && !tags.includes("Q")) {
                    tags.push("Q");
                  }

                  let toneClass =
                    "border-slate-700/80 bg-slate-900/80 text-slate-100";

                  if (cell === "X") {
                    toneClass =
                      "border-slate-800/80 bg-slate-950/85 text-slate-400";
                  }

                  if (isSafe) {
                    toneClass =
                      "border-emerald-400/65 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.16)]";
                  }

                  if (isCaptured) {
                    toneClass =
                      "border-rose-400/70 bg-rose-500/16 text-rose-50 shadow-[0_0_28px_rgba(251,113,133,0.18)]";
                  }

                  if (isScan) {
                    toneClass =
                      "border-violet-400/85 bg-violet-500/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.2)]";
                  }

                  if (isNeighbor) {
                    toneClass =
                      "border-yellow-400/85 bg-yellow-500/16 text-yellow-50 shadow-[0_0_28px_rgba(250,204,21,0.2)]";
                  }

                  if (isCurrent) {
                    toneClass =
                      "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.2)]";
                  }

                  return (
                    <BoardCell
                      key={key}
                      row={rowIndex}
                      col={colIndex}
                      value={isCaptured ? "X" : cell}
                      toneClass={toneClass}
                      tags={tags}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4">
            <FrontierQueue
              title="BFS Queue"
              frontier={step.state.frontier}
              active={step.pointers.current}
              emptyLabel="The queue is empty right now."
            />

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Phase Ledger
              </p>
              <div className="mt-4 space-y-2">
                <div className="rounded-xl border border-violet-400/35 bg-violet-500/10 px-3 py-2 text-violet-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Border Seeds</span>
                    <span className="font-mono text-sm">{step.state.borderSeedCount}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Safe Cells</span>
                    <span className="font-mono text-sm">{step.state.safeCount}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-rose-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Captured Cells</span>
                    <span className="font-mono text-sm">{step.state.capturedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
