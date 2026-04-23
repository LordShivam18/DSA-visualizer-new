import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import { formatCoord, type WordSearchTraceStep } from "./generateTrace";

type Props = {
  step: WordSearchTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: WordSearchTraceStep) {
  switch (step.actionKind) {
    case "scan-start":
      return "The outer loop is checking whether this cell could be the first letter of the word.";
    case "enter-cell":
      return "This cell matched the needed character, so it joined the active path.";
    case "explore-neighbor":
      return "The search is probing one neighboring cell to see if it can supply the next character.";
    case "mismatch":
      return "That direction failed because it was outside the board, reused a cell, or had the wrong character.";
    case "success":
      return "The final character matched, so the whole word has been found.";
    case "backtrack":
      return "This cell led to a dead end, so it is removed from the path and the search returns upward.";
    default:
      return "Backtracking grows one path of matching characters and then undoes it when the path cannot continue.";
  }
}

function buildExpertFocus(step: WordSearchTraceStep) {
  switch (step.actionKind) {
    case "scan-start":
      return "Every cell is a potential DFS root for index 0.";
    case "enter-cell":
      return "Accepting a cell immediately marks it visited so the active path remains simple.";
    case "explore-neighbor":
      return "The recursive state is `(row, col, index)`, and each frame branches over the four orthogonal moves.";
    case "mismatch":
      return "The branch is pruned before recursion when any feasibility condition fails: bounds, reuse, or character match.";
    case "success":
      return "The base case is `index == word.size() - 1`, which short-circuits the entire search on the first witness path.";
    case "backtrack":
      return "Unmarking the cell restores it for alternative branches that may reach it from a different prefix.";
    default:
      return "Worst-case runtime is exponential in the word length because each character can branch to several neighbors.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="The key invariant is simple: the current path cannot reuse a cell."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Current Cell"
          value={formatCoord(step.pointers.current)}
          tone="cyan"
        />
        <StatCard
          label="Neighbor"
          value={formatCoord(step.pointers.neighbor)}
          tone="yellow"
        />
        <StatCard
          label="Expected"
          value={step.pointers.expectedChar ?? "none"}
          tone="amber"
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
            No-Reuse Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Even if a nearby cell contains the correct letter, the branch must
            reject it if that cell is already on the current path. That single
            rule is what makes the search a true backtracking problem.
          </p>
        </div>

        <RecursionStack
          title="DFS Stack"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title: `${frame.char} @ (${frame.cell.row}, ${frame.cell.col})`,
            subtitle: `index ${frame.index}`,
            active: frame.status === "active",
            success: frame.status === "success",
          }))}
        />
      </div>
    </PanelShell>
  );
}
