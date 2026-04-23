import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { CombinationsTraceStep } from "./generateTrace";

type Props = {
  step: CombinationsTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: CombinationsTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The search opened a new slot in the subset and knows which numbers are still legal to choose next.";
    case "choose-number":
      return "One number was added to the subset, so the recursion dives deeper.";
    case "complete":
      return "The subset already contains k numbers, so it is saved as one answer.";
    case "backtrack":
      return "The last number was removed so the search can test a different next pick.";
    default:
      return "Backtracking keeps growing and shrinking the same subset buffer.";
  }
}

function buildExpertFocus(step: CombinationsTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The `start` pointer is the invariant that removes duplicates by enforcing strictly increasing paths.";
    case "choose-number":
      return "Choosing `value` and recursing with `value + 1` transforms combination generation into subset growth over a suffix.";
    case "complete":
      return "When `path.size() == k`, the current prefix is a complete k-combination and can be copied immediately.";
    case "backtrack":
      return "The pop operation restores the caller's prefix before the loop advances to the next candidate.";
    default:
      return "This DFS enumerates each k-subset once, without ever generating different orders of the same set.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="Focus on the start pointer that prevents duplicate orderings."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Start" value={step.pointers.start ?? "done"} tone="cyan" />
        <StatCard
          label="Candidate"
          value={step.pointers.candidate ?? "none"}
          tone="yellow"
        />
        <StatCard label="Depth" value={step.pointers.depth} tone="violet" />
        <StatCard
          label="Choices Tried"
          value={step.state.exploredChoices}
          tone="amber"
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
            Increasing Order Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Once a number is chosen, all later recursive calls can only pick
            larger numbers. That single rule is why
            <span className="font-mono text-cyan-200"> [1, 2] </span>
            appears, but
            <span className="font-mono text-rose-200"> [2, 1] </span>
            never does.
          </p>
        </div>

        <RecursionStack
          title="Stack Snapshot"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title: `start ${frame.start}`,
            subtitle: `path [${frame.path.join(", ")}]`,
            active: frame.status === "active",
            success: frame.status === "complete",
          }))}
        />
      </div>
    </PanelShell>
  );
}
