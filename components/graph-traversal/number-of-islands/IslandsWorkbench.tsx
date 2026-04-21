import FrontierStack from "./FrontierStack";
import GridCell from "./GridCell";
import { formatCoord, type NumberOfIslandsTraceStep } from "./generateTrace";

function keyOf(row: number, col: number) {
  return `${row}-${col}`;
}

export default function IslandsWorkbench({
  step,
}: {
  step: NumberOfIslandsTraceStep;
}) {
  const frontierSet = new Set(
    step.state.frontier.map((coord) => keyOf(coord.row, coord.col))
  );
  const completedSet = new Set(step.state.completedIslands);
  const currentKey = step.pointers.current
    ? keyOf(step.pointers.current.row, step.pointers.current.col)
    : null;
  const neighborKey = step.pointers.neighbor
    ? keyOf(step.pointers.neighbor.row, step.pointers.neighbor.col)
    : null;
  const scanKey = step.pointers.scan
    ? keyOf(step.pointers.scan.row, step.pointers.scan.col)
    : null;
  const stackTopKey = step.pointers.stackTop
    ? keyOf(step.pointers.stackTop.row, step.pointers.stackTop.col)
    : null;
  const activeIslandSize =
    step.state.currentIslandId === null
      ? 0
      : step.state.islandSizes.find(
          (entry) => entry.islandId === step.state.currentIslandId
        )?.size ?? 0;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Grid DFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Count connected land components without double-counting cells
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the cell being expanded, purple shows the outer scan
            cursor, yellow marks the neighbor under inspection, and green cells
            belong to islands that are already fully counted.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Islands: {step.state.islandCount}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Frontier: {step.state.frontier.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Visited Land: {step.state.visitedLandCount}/{step.state.totalLandCount}
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
            DFS Cell
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
            Active Island Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {activeIslandSize}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: current DFS expansion
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: row-by-row scan cursor
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: neighbor check
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: completed island
        </span>
      </div>

      {step.state.rows === 0 || step.state.cols === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          Enter a grid with at least one row to see the traversal board.
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
              {step.state.grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const key = keyOf(rowIndex, colIndex);
                  const islandId = step.state.islandLabels[rowIndex][colIndex];
                  const isCurrent = currentKey === key;
                  const isNeighbor = neighborKey === key;
                  const isScan = scanKey === key;
                  const isInFrontier = frontierSet.has(key);
                  const isStackTop = stackTopKey === key;
                  const isCompletedIsland =
                    islandId !== null && completedSet.has(islandId);
                  const isActiveIsland =
                    islandId !== null &&
                    islandId === step.state.currentIslandId &&
                    !isCompletedIsland;

                  const tags: string[] = [];
                  if (isCurrent) {
                    tags.push("CUR");
                  } else if (isNeighbor) {
                    tags.push("CHK");
                  } else if (isScan) {
                    tags.push("SCAN");
                  }

                  if (isStackTop && !tags.includes("TOP")) {
                    tags.push("TOP");
                  } else if (isInFrontier && !tags.includes("ST")) {
                    tags.push("ST");
                  }

                  let toneClass =
                    "border-slate-800/80 bg-slate-950/90 text-slate-100 shadow-[0_0_20px_rgba(15,23,42,0.5)]";

                  if (cell === "0") {
                    toneClass =
                      "border-slate-800/80 bg-slate-950/85 text-slate-500";
                  }

                  if (cell === "1" && islandId === null) {
                    toneClass =
                      "border-slate-700/80 bg-slate-900/80 text-slate-100";
                  }

                  if (isCompletedIsland) {
                    toneClass =
                      "border-emerald-400/65 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.16)]";
                  } else if (isActiveIsland) {
                    toneClass =
                      "border-violet-400/65 bg-violet-500/14 text-violet-50 shadow-[0_0_26px_rgba(167,139,250,0.16)]";
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
                    <GridCell
                      key={key}
                      row={rowIndex}
                      col={colIndex}
                      value={cell}
                      toneClass={toneClass}
                      tags={tags}
                      islandId={islandId}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4">
            <FrontierStack
              title="DFS Stack"
              frontier={step.state.frontier}
              active={step.pointers.current}
              emptyLabel="The stack is empty right now."
            />

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Island Ledger
              </p>
              <div className="mt-4 space-y-2">
                {step.state.islandSizes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                    No island has been discovered yet.
                  </div>
                ) : (
                  step.state.islandSizes.map((entry) => {
                    const isCurrentIsland =
                      entry.islandId === step.state.currentIslandId;
                    const isDone = completedSet.has(entry.islandId);

                    return (
                      <div
                        key={entry.islandId}
                        className={`rounded-xl border px-3 py-2 ${
                          isCurrentIsland
                            ? "border-violet-400/45 bg-violet-500/10 text-violet-100"
                            : isDone
                            ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                            : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold">Island {entry.islandId}</span>
                          <span className="font-mono text-sm">{entry.size} cells</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
