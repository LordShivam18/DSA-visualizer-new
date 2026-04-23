import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { CombinationSumTraceStep } from "./generateTrace";

type Props = {
  step: CombinationSumTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: CombinationSumTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The branch remembers how much target is still missing before it tries the next candidates.";
    case "choose-candidate":
      return "A candidate fit inside the remaining target, so it was added and the branch continues.";
    case "overshoot":
      return "This candidate would make the sum too large, so the branch is cut off immediately.";
    case "complete":
      return "The chosen numbers hit the target exactly, so this branch is saved as a solution.";
    case "backtrack":
      return "The last number was removed so a different candidate can be tested from the same branch point.";
    default:
      return "Backtracking keeps adjusting the remaining target as numbers are added and removed.";
  }
}

function buildExpertFocus(step: CombinationSumTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The recursion state is `(startIndex, remaining)`, where `startIndex` preserves non-decreasing order and `remaining` measures unfinished sum.";
    case "choose-candidate":
      return "Recursing with the same index `i` is what models unlimited reuse of the current candidate.";
    case "overshoot":
      return "Because all candidates are positive, a negative remainder is a monotonic dead end and can be pruned safely.";
    case "complete":
      return "The exact-hit base case occurs when `remaining == 0`, so the current multiset is copied into the answer.";
    case "backtrack":
      return "Undoing the push restores the caller's path while leaving later candidates available in the loop.";
    default:
      return "This DFS enumerates unique multisets, not permutations, by keeping candidate choices non-decreasing.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="Focus on the remaining-target invariant and why overshoots are safe to prune."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Start Index"
          value={step.pointers.startIndex ?? "done"}
          tone="cyan"
        />
        <StatCard
          label="Candidate"
          value={step.pointers.candidateValue ?? "none"}
          tone="yellow"
        />
        <StatCard
          label="Remaining"
          value={step.pointers.remaining ?? "none"}
          tone="amber"
        />
        <StatCard label="Depth" value={step.pointers.depth} tone="violet" />
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
            Reuse Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This problem allows the same number to appear multiple times. That is
            why the recursive call keeps the same
            <span className="font-mono text-cyan-200"> start index </span>
            after choosing a candidate.
          </p>
        </div>

        <RecursionStack
          title="Stack Snapshot"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title: `start ${frame.startIndex} | rem ${frame.remaining}`,
            subtitle: `path [${frame.path.join(", ")}]`,
            active: frame.status === "active",
            success: frame.status === "complete",
            danger: frame.status === "overshoot",
          }))}
        />
      </div>
    </PanelShell>
  );
}
