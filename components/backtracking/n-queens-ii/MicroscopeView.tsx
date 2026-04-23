import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { NQueensTraceStep } from "./generateTrace";

type Props = {
  step: NQueensTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: NQueensTraceStep) {
  switch (step.actionKind) {
    case "enter-row":
      return "The search moved to a new row and will try columns one by one until it finds a safe square.";
    case "test-col":
      return "This square is being checked against queens that were already placed in earlier rows.";
    case "reject-col":
      return "The candidate is illegal because an earlier queen attacks it through a column or diagonal.";
    case "place-queen":
      return "The square is safe, so the queen is placed and the search continues to the next row.";
    case "complete":
      return "Every row now contains one safe queen, so a full board solution is counted.";
    case "remove-queen":
      return "The queen is removed because the branch beneath that placement is fully explored.";
    default:
      return "Backtracking keeps tightening and relaxing the same column and diagonal constraints.";
  }
}

function buildExpertFocus(step: NQueensTraceStep) {
  switch (step.actionKind) {
    case "enter-row":
      return "Placing exactly one queen per row reduces the remaining constraints to column and diagonal membership tests.";
    case "test-col":
      return "Safety can be checked in O(1) time using `col`, `row - col`, and `row + col` sets.";
    case "reject-col":
      return "The branch is pruned before recursion because one violated constraint is enough to prove unsafety.";
    case "place-queen":
      return "The solver commits the placement by updating all three constraint sets before recurring to `row + 1`.";
    case "complete":
      return "The base case `row == n` counts one valid arrangement and returns immediately.";
    case "remove-queen":
      return "Erasing the column and diagonal markers restores the caller's exact search state.";
    default:
      return "N-Queens remains exponential, but aggressive pruning eliminates most branches long before a full board is built.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="Columns and diagonals are the whole game: if those sets stay clean, the row is safe."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Row" value={step.pointers.row ?? "done"} tone="cyan" />
        <StatCard
          label="Candidate Col"
          value={step.pointers.candidateCol ?? "none"}
          tone="yellow"
        />
        <StatCard
          label="Conflict"
          value={step.pointers.conflictType ?? "none"}
          tone="rose"
        />
        <StatCard label="Depth" value={step.pointers.depth} tone="emerald" />
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? buildBeginnerFocus(step)
            : buildExpertFocus(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Constraint Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Once a queen is fixed in an earlier row, its column,
            <span className="font-mono text-violet-200"> row - col </span>
            diagonal, and
            <span className="font-mono text-amber-200"> row + col </span>
            diagonal are all blocked for later rows.
          </p>
        </div>

        <RecursionStack
          title="Row Stack"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title: `row ${frame.row}`,
            subtitle: `[${frame.placements.map((value) => value ?? "-").join(", ")}]`,
            active: frame.status === "active",
            success: frame.status === "complete",
          }))}
        />
      </div>
    </PanelShell>
  );
}
