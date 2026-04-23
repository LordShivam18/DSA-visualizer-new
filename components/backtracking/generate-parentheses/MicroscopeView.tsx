import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { GenerateParenthesesTraceStep } from "./generateTrace";

type Props = {
  step: GenerateParenthesesTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: GenerateParenthesesTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The current prefix is still valid, so the search checks which bracket can legally come next.";
    case "add-open":
      return "An opening bracket is added because there are still unused opening brackets left.";
    case "add-close":
      return "A closing bracket is added only because an earlier opening bracket is waiting to be matched.";
    case "complete":
      return "The string is full length and stayed balanced the whole time, so it is saved.";
    case "backtrack":
      return "The last bracket is removed so the search can return to an earlier prefix.";
    default:
      return "The search only explores prefixes that can still grow into valid parentheses strings.";
  }
}

function buildExpertFocus(step: GenerateParenthesesTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The prefix invariant is `0 <= closeUsed <= openUsed <= n`, which is enough to guarantee eventual validity.";
    case "add-open":
      return "The open branch exists only when `openUsed < n`.";
    case "add-close":
      return "The close branch exists only when `closeUsed < openUsed`, preventing negative balance.";
    case "complete":
      return "By the time length reaches `2 * n`, every explored prefix is already guaranteed to be well formed.";
    case "backtrack":
      return "The mutable buffer is popped after each branch so both choices share the same caller prefix.";
    default:
      return "This search prunes invalid strings before they are ever fully built, which is why it follows Catalan growth rather than 2^(2n).";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="The balance rule is the key idea: never let closes outnumber opens in any prefix."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Next Char" value={step.pointers.nextChar ?? "done"} tone="cyan" />
        <StatCard
          label="Remaining Opens"
          value={step.pointers.remainingOpen}
          tone="amber"
        />
        <StatCard
          label="Remaining Closes"
          value={step.pointers.remainingClose}
          tone="violet"
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
            Prefix Validity Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The algorithm never builds a prefix like
            <span className="font-mono text-rose-200"> &quot;)(&quot;</span>
            because once closes exceed opens, no future characters can fix that prefix.
          </p>
        </div>

        <RecursionStack
          title="Stack Snapshot"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title: `depth ${frame.depth} | bal ${frame.openUsed - frame.closeUsed}`,
            subtitle: `"${frame.current}"`,
            active: frame.status === "active",
            success: frame.status === "complete",
          }))}
        />
      </div>
    </PanelShell>
  );
}
