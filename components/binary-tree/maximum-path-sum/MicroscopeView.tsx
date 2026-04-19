import PathGainStrip from "./PathGainStrip";
import RecursionStack from "./RecursionStack";
import ReturnGainTable from "./ReturnGainTable";
import type { MaxPathTraceStep } from "./generateTrace";

type Props = {
  step: MaxPathTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: MaxPathTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function buildBeginnerFocus(step: MaxPathTraceStep) {
  switch (step.actionKind) {
    case "enter-node":
      return "This node must wait for both children before it can know whether the best path bends through it.";
    case "receive-left":
    case "receive-right":
      return "A child gain can be helpful, or it can be harmful if it is negative.";
    case "evaluate-through":
      return "The yellow path is the best full path that uses the current node as the middle connection point.";
    case "update-best":
      return "The current node produced a better full path than anything seen earlier, so the global answer changes.";
    case "keep-best":
      return "This node's full path is valid, but an older path is still stronger.";
    case "compute-return":
      return "A parent cannot keep both sides, so only one branch is returned upward.";
    case "hit-null":
      return "Missing children contribute 0 because they cannot extend a path.";
    case "done":
      return "The green path is the strongest path anywhere in the tree, even if it does not touch the root.";
    default:
      return step.explanationBeginner;
  }
}

function buildExpertFocus(step: MaxPathTraceStep) {
  if (step.done) {
    return "The global optimum comes from maximizing split-path candidates at every node, while upward propagation is restricted to single-branch gains. Complexity is O(n) time and O(h) stack space.";
  }

  switch (step.actionKind) {
    case "receive-left":
    case "receive-right":
      return "Raw child gains are collected first; negative gains will later be clamped to 0 before computing the split-path candidate.";
    case "evaluate-through":
      return "The split-path candidate is `node + max(leftGain,0) + max(rightGain,0)`, which is eligible for the global best but not legal to return upward intact.";
    case "update-best":
    case "keep-best":
      return "The global answer is updated by comparing the current split-path candidate against the best value seen so far.";
    case "compute-return":
      return "The returned value is `node + max(max(leftGain,0), max(rightGain,0))`, a single-branch gain suitable for a parent extension.";
    default:
      return step.explanationExpert;
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  const topFrame = step.state.stack[step.state.stack.length - 1];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the difference between a node&apos;s split-path candidate and
            the smaller gain it can safely return upward.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Parent
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.parentId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {labelOf(step, step.pointers.focusNodeId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Best So Far
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.globalBest ?? "searching"}
          </p>
        </div>
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

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Frame
          </p>

          {topFrame ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Left Gain
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.leftRawGain ?? "pending"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Right Gain
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.rightRawGain ?? "pending"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Through Sum
                </p>
                <p className="mt-1 font-mono text-sm text-yellow-200">
                  {topFrame.throughSum ?? "pending"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No active call frame right now.
            </div>
          )}
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Clamp vs Return
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Usable Left
              </p>
              <p className="mt-1 font-mono text-sm text-amber-200">
                {step.pointers.usableLeft}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Usable Right
              </p>
              <p className="mt-1 font-mono text-sm text-amber-200">
                {step.pointers.usableRight}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Through Path
              </p>
              <p className="mt-1 font-mono text-sm text-yellow-200">
                {step.pointers.throughSum ?? "pending"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Returned Gain
              </p>
              <p
                className={`mt-1 font-mono text-sm ${
                  (step.pointers.upwardGain ?? 0) >= 0
                    ? "text-emerald-200"
                    : "text-rose-200"
                }`}
              >
                {step.pointers.upwardGain ?? "pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <PathGainStrip
          title="Candidate Path"
          ids={step.state.candidatePathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="The active node has not formed a split-path candidate yet."
          helperText="This full path is eligible for the global maximum because it may use both sides of the current node."
        />
        <PathGainStrip
          title="Returned Path"
          ids={step.state.returnPathIds}
          nodes={step.state.nodes}
          accent="cyan"
          emptyLabel="No upward return path is ready yet."
          helperText="This single-branch path is the only thing the node may return to its parent."
        />
      </div>

      <div className="mt-5">
        <RecursionStack stack={step.state.stack} />
      </div>

      <div className="mt-5">
        <ReturnGainTable
          title="Gain Ledger"
          values={step.state.returnedGains}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.focusNodeId}
          emptyLabel="No node has returned a gain yet."
          helperText="Returned gains are single-branch values, which is why they can differ from the best full path through the same node."
        />
      </div>
    </div>
  );
}
