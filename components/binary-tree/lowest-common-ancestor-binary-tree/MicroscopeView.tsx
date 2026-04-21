import PathStrip from "./PathStrip";
import RecursionStack from "./RecursionStack";
import ReturnLedgerTable from "./ReturnLedgerTable";
import type { LcaTraceStep } from "./generateTrace";

type Props = {
  step: LcaTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: LcaTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function nextCallLabel(step: LcaTraceStep) {
  if (!step.pointers.nextDirection) {
    return "none";
  }

  return `${step.pointers.nextDirection} -> ${labelOf(step, step.pointers.nextChildId)}`;
}

function buildBeginnerFocus(step: LcaTraceStep) {
  switch (step.actionKind) {
    case "enter-node":
      return "We just arrived at a node and are checking whether it is one of the two targets before going deeper.";
    case "hit-null":
      return "This branch is empty, so it contributes no target and sends back null.";
    case "match-p":
    case "match-q":
      return "A target node returns itself immediately because a node is allowed to be a descendant of itself in the LCA definition.";
    case "explore-left":
      return "The algorithm explores the left subtree first and waits to see what that branch returns.";
    case "explore-right":
      return "Now the right subtree is explored so the current node can compare both return values.";
    case "found-lca":
      return "One useful answer came from each side, so the current node is the first point where the targets meet.";
    case "bubble-left":
    case "bubble-right":
      return "Only one side found something useful, so the current node simply passes that answer upward.";
    case "bubble-none":
      return "Neither side found p or q, so this whole subtree reports nothing.";
    case "done":
      return "The final answer is now the lowest node that connects both targets, or the target itself when one target is above the other.";
    default:
      return step.explanationBeginner;
  }
}

function buildExpertFocus(step: LcaTraceStep) {
  if (step.done) {
    return "The classic recursive solution visits each node once, so it runs in O(n) time and O(h) auxiliary stack space.";
  }

  switch (step.actionKind) {
    case "enter-node":
      return "The entire invariant lives inside the return pointer: `null`, `p`, `q`, or the completed LCA node.";
    case "hit-null":
      return "A null child returns `nullptr`, which acts as the neutral element in the final ternary return.";
    case "match-p":
    case "match-q":
      return "The base case short-circuits on `root == p` or `root == q`, encoding the descendant-of-self property directly into the recursion.";
    case "explore-left":
    case "explore-right":
      return "The algorithm computes left and right return pointers independently, then decides whether the current node is the split point.";
    case "found-lca":
      return "The condition `if (left && right)` is sufficient because non-null child returns certify that each target was encountered in a different branch.";
    case "bubble-left":
    case "bubble-right":
      return "When only one side returns non-null, the current frame preserves that pointer with `return left ? left : right`.";
    case "bubble-none":
      return "A null result means the subtree contained neither target nor a completed ancestor answer.";
    default:
      return step.explanationExpert;
  }
}

function buildRuleSummary(step: LcaTraceStep) {
  const left = labelOf(step, step.pointers.leftReturnId);
  const right = labelOf(step, step.pointers.rightReturnId);
  const latest = labelOf(step, step.pointers.latestReturnId);

  switch (step.actionKind) {
    case "match-p":
    case "match-q":
      return `Base case fires: return ${latest}.`;
    case "found-lca":
      return `Both sides are non-null (${left}, ${right}), so return the current node.`;
    case "bubble-left":
      return `Only the left side is non-null (${left}), so bubble it upward.`;
    case "bubble-right":
      return `Only the right side is non-null (${right}), so bubble it upward.`;
    case "bubble-none":
    case "hit-null":
      return "No candidate exists here, so return null.";
    default:
      return "Watch how each frame decides what pointer to return to its parent.";
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
            Zoom in on the recursive return rule that makes LCA work without
            storing parent pointers.
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
            {nextCallLabel(step)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Latest Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {labelOf(step, step.pointers.latestReturnId)}
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
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Match
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.matchedTarget ?? "none"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Left
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {labelOf(step, topFrame.leftReturnId)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Right
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {labelOf(step, topFrame.rightReturnId)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Return
                </p>
                <p className="mt-1 font-mono text-sm text-emerald-200">
                  {labelOf(step, topFrame.resultId)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No active recursive frame remains.
            </div>
          )}
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Return Rule Snapshot
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {buildRuleSummary(step)}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Seen
              </p>
              <p className="mt-1 font-mono text-sm text-slate-100">
                {step.state.matchedTargetIds.length}/2
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Nulls
              </p>
              <p className="mt-1 font-mono text-sm text-slate-100">
                {step.state.nullHits}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Returns
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {step.state.ledger.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <PathStrip
          title="Current Recursion Path"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="cyan"
          badgeLabel={`Depth ${step.pointers.callDepth}`}
          emptyLabel="No recursion path is active."
          helperText="This is the exact path the current call stack is sitting on."
        />
        <PathStrip
          title="Shared Ancestor Chain"
          ids={step.state.sharedPathIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="The two targets do not share a valid path chain here."
          helperText="The last node in this chain is the correct LCA for valid inputs."
        />
        <PathStrip
          title="Path to Target P"
          ids={step.state.pPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          badgeLabel={`p = ${step.state.targetPValue ?? "?"}`}
          emptyLabel="Target p is missing."
          helperText="Reference path to target p in the original tree."
        />
        <PathStrip
          title="Path to Target Q"
          ids={step.state.qPathIds}
          nodes={step.state.nodes}
          accent="violet"
          badgeLabel={`q = ${step.state.targetQValue ?? "?"}`}
          emptyLabel="Target q is missing."
          helperText="Reference path to target q in the original tree."
        />
      </div>

      <div className="mt-5">
        <RecursionStack stack={step.state.stack} nodes={step.state.nodes} />
      </div>

      <div className="mt-5">
        <ReturnLedgerTable
          title="Return Ledger"
          entries={step.state.ledger}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.currentId}
          emptyLabel="No subtree has returned yet."
          helperText="These completed calls show exactly how the answer bubbles upward."
        />
      </div>
    </div>
  );
}
