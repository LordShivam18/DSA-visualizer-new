import CompletedPathsTable from "./CompletedPathsTable";
import PathNumberStrip from "./PathNumberStrip";
import RecursionStack from "./RecursionStack";
import type { SumRootTraceStep } from "./generateTrace";

type Props = {
  step: SumRootTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: SumRootTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function buildBeginnerFocus(step: SumRootTraceStep) {
  switch (step.actionKind) {
    case "enter-node":
      return "We just appended one more digit to the number being built on this path.";
    case "check-leaf":
      return "At a leaf, the path is complete, so the built number is ready to contribute to the answer.";
    case "leaf-complete":
      return "This finished number has been added into the running total.";
    case "explore-left":
      return "DFS always explores the left child first when it continues a path.";
    case "explore-right":
      return "The left side is finished, so now the right side is explored with the same prefix number.";
    case "hit-null":
      return "A missing child adds nothing, so that branch returns 0.";
    case "combine":
      return "This node adds together the totals returned by its left and right subtrees.";
    case "done":
      return "All root-to-leaf digit paths have been converted into numbers and summed together.";
    default:
      return step.explanationBeginner;
  }
}

function buildExpertFocus(step: SumRootTraceStep) {
  if (step.done) {
    return "Every node is visited once, so the algorithm runs in O(n) time with O(h) recursive stack space.";
  }

  switch (step.actionKind) {
    case "enter-node":
      return "The prefix-number invariant is `formed = incoming * 10 + digit`, which encodes decimal concatenation in O(1) time per edge.";
    case "check-leaf":
      return "A leaf contributes exactly one value: the fully constructed prefix number for that root-to-leaf path.";
    case "leaf-complete":
      return "Only leaves increment the global running total; internal nodes simply aggregate returned subtree sums.";
    case "explore-left":
    case "explore-right":
      return "Both recursive calls share the same formed prefix for the current node, because both descendants extend the same root-to-current number.";
    case "hit-null":
      return "The null-child base case returns 0, the additive identity, so it does not affect subtree totals.";
    case "combine":
      return "The recursive invariant is additive: each call returns the sum of all completed root-to-leaf numbers beneath that node.";
    default:
      return step.explanationExpert;
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  const topFrame = step.state.stack[step.state.stack.length - 1];
  const latestCompletedPath =
    step.state.completedPaths[step.state.completedPaths.length - 1]?.ids ?? [];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on how digits are concatenated, how recursive calls return
            subtree sums, and why only leaves produce finished numbers.
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
                  Incoming
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.incomingNumber}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Formed
                </p>
                <p className="mt-1 font-mono text-sm text-cyan-200">
                  {topFrame.formedNumber}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Return
                </p>
                <p className="mt-1 font-mono text-sm text-emerald-200">
                  {topFrame.totalReturn ?? "pending"}
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
            Returned Subtree Totals
          </p>

          {step.state.returnedSums.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No subtree has returned a number yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {step.state.returnedSums.map((entry) => (
                <div
                  key={entry.nodeId}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Node
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {labelOf(step, entry.nodeId)}
                  </p>
                  <p className="mt-1 font-mono text-sm text-emerald-200">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <PathNumberStrip
          title="Current Path Number"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="No active path remains on the stack."
          helperText="This is the exact decimal number the active call has built so far."
        />
        <PathNumberStrip
          title="Latest Completed Number"
          ids={latestCompletedPath}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No leaf has completed a number yet."
          helperText="Every time DFS hits a leaf, that finished number is recorded here."
        />
      </div>

      <div className="mt-5">
        <RecursionStack stack={step.state.stack} />
      </div>

      <div className="mt-5">
        <CompletedPathsTable
          title="Completed Path Ledger"
          paths={step.state.completedPaths}
          nodes={step.state.nodes}
          total={step.state.totalSumSoFar}
          highlightLeafId={step.pointers.focusLeafId}
          emptyLabel="No completed numbers have been added yet."
          helperText="This ledger shows the exact leaf paths that have already contributed to the total."
        />
      </div>
    </div>
  );
}
