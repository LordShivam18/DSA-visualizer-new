import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import WordSearchCell from "./WordSearchCell";
import {
  formatPath,
  type Coord,
  type WordSearchTraceStep,
} from "./generateTrace";

function keyOf(coord: Coord) {
  return `${coord.row}-${coord.col}`;
}

export default function WordSearchWorkbench({
  step,
}: {
  step: WordSearchTraceStep;
}) {
  const pathSet = new Set(step.state.path.map((coord) => keyOf(coord)));
  const successSet = new Set(step.state.successfulPath.map((coord) => keyOf(coord)));
  const deadEndSet = new Set(step.state.deadEndCells.map((coord) => keyOf(coord)));
  const startSet = new Set(step.state.testedStarts.map((coord) => keyOf(coord)));
  const currentKey = step.pointers.current ? keyOf(step.pointers.current) : null;
  const neighborKey = step.pointers.neighbor ? keyOf(step.pointers.neighbor) : null;
  const isMismatch = step.actionKind === "mismatch" || step.actionKind === "reject-start";

  return (
    <PanelShell
      title="Grid Path Search"
      subtitle="The path walks one character at a time, and a cell can belong to the active path only once per branch."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Rows" value={step.state.rows} tone="violet" />
        <StatCard label="Cols" value={step.state.cols} tone="cyan" />
        <StatCard
          label="Word Index"
          value={step.pointers.wordIndex ?? "done"}
          tone="amber"
        />
        <StatCard
          label="Moves Checked"
          value={step.state.exploredMoves}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Cyan: current cell" tone="cyan" />
        <LegendPill label="Yellow: neighbor under test" tone="yellow" />
        <LegendPill label="Green: active or successful path" tone="emerald" />
        <LegendPill label="Red: dead end or mismatch" tone="rose" />
        <LegendPill label="Purple: tested start cells" tone="violet" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="rounded-[1.25rem] border border-slate-800/80 bg-[#050916] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Search Board
            </p>
            <div
              className="mt-4 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.max(step.state.cols, 1)}, minmax(0, 1fr))`,
              }}
            >
              {step.state.board.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  const isCurrent = currentKey === key;
                  const isNeighbor = neighborKey === key;
                  const onPath = pathSet.has(key);
                  const onSuccessPath = successSet.has(key);
                  const isDeadEnd = deadEndSet.has(key);
                  const isStart = startSet.has(key);

                  let toneClass =
                    "border-slate-800/80 bg-slate-950/75 text-slate-100";
                  let label = "";

                  if (!value) {
                    toneClass = "border-slate-900 bg-slate-950 text-slate-700";
                  } else if (isDeadEnd) {
                    toneClass =
                      "border-rose-500/35 bg-rose-500/10 text-rose-100 shadow-[0_0_20px_rgba(251,113,133,0.12)]";
                    label = "dead";
                  } else if (isStart) {
                    toneClass =
                      "border-violet-400/35 bg-violet-500/10 text-violet-100 shadow-[0_0_20px_rgba(167,139,250,0.12)]";
                    label = "start";
                  }

                  if (onPath || onSuccessPath) {
                    toneClass =
                      "border-emerald-400/55 bg-emerald-500/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]";
                    label = onSuccessPath && step.done ? "path" : "live";
                  }

                  if (isNeighbor) {
                    toneClass = isMismatch
                      ? "border-rose-400/75 bg-rose-500/14 text-rose-50 shadow-[0_0_24px_rgba(251,113,133,0.16)]"
                      : "border-yellow-400/75 bg-yellow-500/14 text-yellow-50 shadow-[0_0_24px_rgba(250,204,21,0.16)]";
                    label = isMismatch ? "no" : "next";
                  }

                  if (isCurrent) {
                    toneClass =
                      "border-cyan-400/75 bg-cyan-500/14 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)]";
                    label = "curr";
                  }

                  return (
                    <WordSearchCell
                      key={key}
                      value={value}
                      toneClass={toneClass}
                      label={label}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Word Progress
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {step.state.word.split("").map((char, index) => {
                  const isMatched = index < step.state.path.length || index < step.state.successfulPath.length;
                  const isCurrent = step.pointers.wordIndex === index;

                  return (
                    <div
                      key={`${char}-${index}`}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold ${
                        isCurrent
                          ? "border-cyan-400/75 bg-cyan-500/14 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)]"
                          : isMatched
                          ? "border-emerald-400/55 bg-emerald-500/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]"
                          : "border-slate-800/80 bg-[#050916] text-slate-500"
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Path Coordinates
              </p>
              <div className="mt-4 rounded-xl border border-slate-800/80 bg-[#050916] px-4 py-3 font-mono text-sm text-slate-200">
                {formatPath(step.state.successfulPath.length > 0 ? step.state.successfulPath : step.state.path)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="DFS Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title: `${frame.char} @ (${frame.cell.row}, ${frame.cell.col})`,
              subtitle: `index ${frame.index} | path ${formatPath(frame.path)}`,
              active: frame.status === "active",
              success: frame.status === "success",
            }))}
          />

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Start Cells Tried
            </p>
            {step.state.testedStarts.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                The outer scan has not tested any start cell yet.
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {step.state.testedStarts.map((coord) => (
                  <span
                    key={`start-${coord.row}-${coord.col}`}
                    className="rounded-full border border-violet-400/35 bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-100"
                  >
                    ({coord.row},{coord.col})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
