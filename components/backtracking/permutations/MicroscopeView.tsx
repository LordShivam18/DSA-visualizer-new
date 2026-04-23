import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { PermutationsTraceStep } from "./generateTrace";

type Props = {
  step: PermutationsTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: PermutationsTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The search opened the next slot and is scanning for a number that has not been used yet.";
    case "choose-number":
      return "One free number was placed into the next slot and marked as used.";
    case "complete":
      return "Every slot now contains a number, so the ordering is finished.";
    case "backtrack":
      return "The last placement was undone so another free number can be tested in that slot.";
    default:
      return "Backtracking reuses the same slot array while trying different orderings.";
  }
}

function buildExpertFocus(step: PermutationsTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The path length equals the current depth, and the used-mask determines which indices are eligible to branch.";
    case "choose-number":
      return "Setting `used[i] = true` before recursion preserves the no-repeat invariant for the branch.";
    case "complete":
      return "The base case fires when `path.size() == nums.size()`, meaning one full bijection from slots to values has been chosen.";
    case "backtrack":
      return "The pop and mask reset restore the caller's exact search state before the loop advances.";
    default:
      return "The DFS explores n choices, then n-1, and so on, for O(n * n!) total work in the worst case.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="Track the used-mask that keeps one branch from reusing the same value twice."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Candidate Index"
          value={step.pointers.candidateIndex ?? "none"}
          tone="cyan"
        />
        <StatCard
          label="Candidate Value"
          value={step.pointers.candidateValue ?? "none"}
          tone="yellow"
        />
        <StatCard label="Depth" value={step.pointers.depth} tone="violet" />
        <StatCard
          label="Used Count"
          value={step.state.used.filter(Boolean).length}
          tone="emerald"
        />
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
            A permutation can use every input value exactly once. The
            <span className="font-mono text-cyan-200"> used[] </span>
            array is the contract that enforces that rule at every depth.
          </p>
        </div>

        <RecursionStack
          title="Stack Snapshot"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title: `depth ${frame.depth}`,
            subtitle: `path [${frame.path.join(", ")}]`,
            active: frame.status === "active",
            success: frame.status === "complete",
          }))}
        />
      </div>
    </PanelShell>
  );
}
