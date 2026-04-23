import ChessboardCell from "./ChessboardCell";
import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { NQueensTraceStep } from "./generateTrace";

function isAttacked(
  row: number,
  col: number,
  queenCols: (number | null)[]
) {
  for (let queenRow = 0; queenRow < queenCols.length; queenRow += 1) {
    const queenCol = queenCols[queenRow];
    if (queenCol === null) {
      continue;
    }

    if (queenCol === col) {
      return true;
    }

    if (Math.abs(queenRow - row) === Math.abs(queenCol - col)) {
      return true;
    }
  }

  return false;
}

export default function NQueensWorkbench({
  step,
}: {
  step: NQueensTraceStep;
}) {
  const currentRow = step.pointers.row;

  return (
    <PanelShell
      title="Queen Constraint Board"
      subtitle="Rows are filled from top to bottom, and every candidate square is filtered through column and diagonal guards before recursion continues."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Board Size" value={step.state.n} tone="violet" />
        <StatCard label="Active Row" value={currentRow ?? "done"} tone="cyan" />
        <StatCard
          label="Choices Tried"
          value={step.state.exploredChoices}
          tone="amber"
        />
        <StatCard
          label="Solutions"
          value={step.state.solutions}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Green: placed queen" tone="emerald" />
        <LegendPill label="Yellow: candidate square" tone="yellow" />
        <LegendPill label="Red: attacked or rejected" tone="rose" />
        <LegendPill label="Purple: active row" tone="violet" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="rounded-[1.25rem] border border-slate-800/80 bg-[#050916] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Chessboard
            </p>
            <div
              className="mt-4 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.max(step.state.n, 1)}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: step.state.n }, (_, row) =>
                Array.from({ length: step.state.n }, (_, col) => {
                  const hasQueen = step.state.queenCols[row] === col;
                  const isCandidate =
                    step.pointers.row === row && step.pointers.candidateCol === col;
                  const attacked = !hasQueen && isAttacked(row, col, step.state.queenCols);
                  const isRejected = isCandidate && step.actionKind === "reject-col";
                  const isActiveRow = currentRow === row;
                  const baseTone =
                    (row + col) % 2 === 0
                      ? "border-slate-800/80 bg-slate-950/75 text-slate-400"
                      : "border-slate-800/80 bg-slate-900/75 text-slate-400";

                  let toneClass = baseTone;
                  let label = "";

                  if (attacked) {
                    toneClass =
                      "border-rose-500/35 bg-rose-500/10 text-rose-100 shadow-[0_0_20px_rgba(251,113,133,0.12)]";
                    label = "x";
                  }

                  if (isActiveRow && !attacked && !hasQueen) {
                    toneClass =
                      "border-violet-400/35 bg-violet-500/10 text-violet-100 shadow-[0_0_20px_rgba(167,139,250,0.1)]";
                  }

                  if (isCandidate) {
                    toneClass = isRejected
                      ? "border-rose-400/75 bg-rose-500/14 text-rose-50 shadow-[0_0_24px_rgba(251,113,133,0.16)]"
                      : step.actionKind === "place-queen"
                      ? "border-cyan-400/75 bg-cyan-500/14 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)]"
                      : "border-yellow-400/75 bg-yellow-500/14 text-yellow-50 shadow-[0_0_24px_rgba(250,204,21,0.16)]";
                    label = isRejected ? "!" : "?";
                  }

                  if (hasQueen) {
                    toneClass =
                      "border-emerald-400/75 bg-emerald-500/16 text-emerald-50 shadow-[0_0_28px_rgba(52,211,153,0.18)]";
                    label = "Q";
                  }

                  return (
                    <ChessboardCell
                      key={`${row}-${col}`}
                      row={row}
                      col={col}
                      toneClass={toneClass}
                      label={label}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Used Columns
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.state.usedCols.length === 0 ? (
                  <span className="text-sm text-slate-500">none</span>
                ) : (
                  step.state.usedCols.map((value) => (
                    <span
                      key={`col-${value}`}
                      className="rounded-full border border-cyan-400/35 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-100"
                    >
                      {value}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                row - col
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.state.usedDiagDown.length === 0 ? (
                  <span className="text-sm text-slate-500">none</span>
                ) : (
                  step.state.usedDiagDown.map((value) => (
                    <span
                      key={`diag-down-${value}`}
                      className="rounded-full border border-violet-400/35 bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-100"
                    >
                      {value}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                row + col
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.state.usedDiagUp.length === 0 ? (
                  <span className="text-sm text-slate-500">none</span>
                ) : (
                  step.state.usedDiagUp.map((value) => (
                    <span
                      key={`diag-up-${value}`}
                      className="rounded-full border border-amber-400/35 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-100"
                    >
                      {value}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="Row Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title: `row ${frame.row}`,
              subtitle: `placements [${frame.placements.map((value) => value ?? "-").join(", ")}]`,
              active: frame.status === "active",
              success: frame.status === "complete",
            }))}
          />

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Solution Previews
            </p>
            {step.state.solutionBoards.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                Completed boards will appear here when the search reaches row n.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {step.state.solutionBoards.slice(0, 4).map((board, index) => (
                  <div key={`solution-${index}`}>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      Solution {index + 1}
                    </p>
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: board.length }, (_, row) =>
                        Array.from({ length: board.length }, (_, col) => (
                          <div
                            key={`preview-${index}-${row}-${col}`}
                            className={`flex aspect-square items-center justify-center rounded-md border text-xs ${
                              board[row] === col
                                ? "border-emerald-400/65 bg-emerald-500/16 text-emerald-50"
                                : (row + col) % 2 === 0
                                ? "border-slate-800/80 bg-slate-950/75 text-slate-600"
                                : "border-slate-800/80 bg-slate-900/75 text-slate-600"
                            }`}
                          >
                            {board[row] === col ? "Q" : ""}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
