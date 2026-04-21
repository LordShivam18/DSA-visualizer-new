import BoundaryStrip from "./BoundaryStrip";
import CountLedgerTable from "./CountLedgerTable";
import RecursionStack from "./RecursionStack";
import type { CountTraceStep } from "./generateTrace";

type Props = {
  step: CountTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: CountTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function nextCallLabel(step: CountTraceStep) {
  if (!step.pointers.nextDirection || !step.pointers.nextChildId) {
    return "none";
  }

  return `${step.pointers.nextDirection} -> ${labelOf(step, step.pointers.nextChildId)}`;
}

function buildBeginnerFocus(step: CountTraceStep) {
  switch (step.actionKind) {
    case "enter-subtree":
      return "We are checking one subtree root to see whether it is already perfectly full or still needs more recursion.";
    case "scan-left":
      return "The algorithm is measuring how many levels appear on the far-left edge of the current subtree.";
    case "scan-right":
      return "Now it measures the far-right edge. Matching outer heights are the clue that the whole subtree is full.";
    case "perfect-subtree":
      return "Both outer heights match, so every level is filled. The subtree can be counted instantly with a formula.";
    case "recurse-left":
      return "The subtree is not perfect, so we split the work and count smaller subtrees instead.";
    case "recurse-right":
      return "The left side is already counted. The algorithm now counts the right side before adding everything together.";
    case "hit-null":
      return "A missing child means there is no subtree there, so it contributes zero nodes.";
    case "combine":
      return "The current root contributes one node, then the left and right subtree totals are added around it.";
    case "done":
      return "Every needed subtree has been resolved, so the final node count is ready.";
    default:
      return step.explanationBeginner;
  }
}

function buildExpertFocus(step: CountTraceStep) {
  if (step.done) {
    return "Equal extreme heights detect perfect subtrees in O(log n), and only one incomplete branch persists per level, giving O(log^2 n) total time and O(log n) stack depth.";
  }

  switch (step.actionKind) {
    case "enter-subtree":
      return "Each frame corresponds to one `countNodes(root)` invocation and caches the subtree's measured heights plus returned child counts.";
    case "scan-left":
    case "scan-right":
      return "The only per-call probing work is along the extreme left and right spines, which costs O(h) for subtree height h.";
    case "perfect-subtree":
      return "For complete trees, `leftDepth(root) == rightDepth(root)` is sufficient to prove perfect fullness, so the subtree size is `2^h - 1`.";
    case "recurse-left":
      return "Height mismatch implies the last level is only partially filled, so the code falls through to the recursive case.";
    case "recurse-right":
      return "The recursive return expression is still `1 + left + right`; the shortcut only decides whether child calls are needed.";
    case "hit-null":
      return "The null-child base case returns 0 and keeps the recurrence algebra clean.";
    case "combine":
      return "The combine step materializes the recurrence `count(root) = 1 + count(left) + count(right)` after child returns are known.";
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
            Zoom in on the subtree invariant, the height probes, and the exact
            moment a subtree becomes countable in one shot.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Parent Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.parentId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Probe
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.probeDirection
              ? `${step.pointers.probeDirection} @ ${labelOf(step, step.pointers.probeId)}`
              : "idle"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Call
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {nextCallLabel(step)}
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
                  Heights
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.leftHeight ?? "-"} / {topFrame.rightHeight ?? "-"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Children
                </p>
                <p className="mt-1 font-mono text-sm text-slate-100">
                  {topFrame.leftCount ?? "-"} / {topFrame.rightCount ?? "-"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Return
                </p>
                <p className="mt-1 font-mono text-sm text-emerald-200">
                  {topFrame.resultCount ?? "pending"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No recursive frame is active right now.
            </div>
          )}
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Strategy Snapshot
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Shortcuts
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {step.state.shortcutCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Resolved
              </p>
              <p className="mt-1 font-mono text-sm text-slate-100">
                {step.state.resolvedCount}/{step.state.nodes.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Calls
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.subtreeCalls}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <BoundaryStrip
          title="Left Boundary Focus"
          ids={step.state.leftBoundaryIds}
          nodes={step.state.nodes}
          accent="yellow"
          heightLabel={`Height ${step.pointers.leftHeight ?? "-"}`}
          emptyLabel="No left-boundary probe has run yet."
          helperText="These are the exact nodes touched by the current left-depth probe."
        />
        <BoundaryStrip
          title="Right Boundary Focus"
          ids={step.state.rightBoundaryIds}
          nodes={step.state.nodes}
          accent="violet"
          heightLabel={`Height ${step.pointers.rightHeight ?? "-"}`}
          emptyLabel="No right-boundary probe has run yet."
          helperText="These are the exact nodes touched by the current right-depth probe."
        />
      </div>

      <div className="mt-5">
        <RecursionStack stack={step.state.stack} />
      </div>

      <div className="mt-5">
        <CountLedgerTable
          title="Counting Ledger"
          entries={step.state.ledger}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.focusNodeId}
          emptyLabel="No subtree has been resolved yet."
          helperText="Each row records one subtree whose node count is now known."
        />
      </div>
    </div>
  );
}
