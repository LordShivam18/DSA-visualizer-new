import PathExpressionStrip from "./PathExpressionStrip";
import RecursionStack from "./RecursionStack";
import type { PathSumTraceStep } from "./generateTrace";

type Props = {
  step: PathSumTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: PathSumTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function buildBeginnerFocus(step: PathSumTraceStep) {
  switch (step.actionKind) {
    case "enter-node":
      return "We just stepped onto a node and added its value to the path total.";
    case "check-leaf":
      return "At a leaf, there are no more choices. We only need to check whether the total matches the target.";
    case "leaf-success":
      return "This leaf completes a perfect root-to-leaf sum, so the search can stop early.";
    case "leaf-fail":
      return "This leaf does not work, so the algorithm has to back up and try another branch.";
    case "explore-left":
      return "DFS always tries the left child first in this visualizer.";
    case "explore-right":
      return "The left side failed, so the search now moves to the right child.";
    case "hit-null":
      return "A null child means there is no path to keep following on that side.";
    case "backtrack":
      return "Both child routes failed here, so this call returns false to its parent.";
    case "bubble-success":
      return "A deeper call already found the answer, so the success now bubbles back toward the root.";
    case "done":
      return step.state.result
        ? "The tree contains a root-to-leaf path whose values add up to the target."
        : "Every root-to-leaf path was checked, and none matched the target.";
    default:
      return step.explanationBeginner;
  }
}

function buildExpertFocus(step: PathSumTraceStep) {
  if (step.done) {
    return step.state.result
      ? "Search terminated on a witness path. Worst-case complexity is O(n) time and O(h) stack space."
      : "The DFS exhausted the full search space. Complexity remains O(n) time with O(h) recursive depth.";
  }

  switch (step.actionKind) {
    case "enter-node":
      return "Each frame stores the reduced target `remaining = target - prefixSum`, avoiding any need to recompute the path total from scratch.";
    case "check-leaf":
      return "The leaf predicate is the exact correctness check: a root-to-leaf path is valid iff the residual target becomes zero at a leaf.";
    case "leaf-success":
      return "A successful leaf causes short-circuit propagation through pending callers.";
    case "leaf-fail":
      return "This branch is pruned only after reaching a leaf and failing the residual-target test.";
    case "explore-left":
    case "explore-right":
      return "The order matters for the trace: left recursion is evaluated before right recursion because the solution uses short-circuit boolean logic.";
    case "backtrack":
      return "Returning false here means both descendants failed under the same reduced target for this frame.";
    case "bubble-success":
      return "This caller returns true without evaluating any later alternatives because a descendant already satisfied the predicate.";
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
            Zoom in on the recursive call stack, the live path arithmetic, and
            the success/failure invariant.
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
            Next Branch
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.nextDirection ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Leaf
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {labelOf(step, step.pointers.focusLeafId)}
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
                  Call Target
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.callTarget}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Running Sum
                </p>
                <p className="mt-1 font-mono text-sm text-cyan-200">
                  {topFrame.runningSum}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Remaining
                </p>
                <p className="mt-1 font-mono text-sm text-amber-200">
                  {topFrame.remainingTarget}
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
            Why This Step Matters
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {mode === "beginner"
              ? "The path total changes only when we step into a node. When a branch fails, recursion removes that node from the stack and tries the next possible choice."
              : "The call stack itself represents the current path. Its top frame contains the exact residual target needed for correctness at deeper levels."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <PathExpressionStrip
          title="Current Path Arithmetic"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="No active path remains on the stack."
          helperText="This is the exact sum the top recursive frame is representing."
        />
        <PathExpressionStrip
          title="Target Match"
          ids={step.state.successPathIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="A matching path has not been found yet."
          helperText="When a valid leaf is found, that full root-to-leaf arithmetic stays fixed here."
        />
      </div>

      <div className="mt-5">
        <RecursionStack stack={step.state.stack} />
      </div>
    </div>
  );
}
