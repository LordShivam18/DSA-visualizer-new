import FrontierQueue from "./FrontierQueue";
import {
  formatCoord,
  type SurroundedRegionsTraceStep,
} from "./generateTrace";

type Props = {
  step: SurroundedRegionsTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: SurroundedRegionsTraceStep) {
  switch (step.actionKind) {
    case "scan-border":
      return "The algorithm checks border cells first because any O that touches the edge can never be captured.";
    case "seed-safe":
      return "This border O starts a safe region, so BFS will protect every connected O around it.";
    case "skip-border":
      return "This border cell does not add a new safe region because it is a wall or already marked safe.";
    case "pop-safe":
      return "BFS is expanding one safe cell to see which neighboring O cells should also stay safe.";
    case "inspect-neighbor":
      return "Each neighbor is tested to decide whether safety spreads into that cell.";
    case "mark-safe":
      return "This O is connected to the border, so it is safe and goes into the queue.";
    case "ignore-neighbor":
      return "This neighbor cannot help the safe region grow because it is invalid, blocked, or already safe.";
    case "scan-flip":
      return "The final pass now knows exactly which O cells are safe and which ones are trapped.";
    case "capture-cell":
      return "This O is fully enclosed, so it flips into X.";
    case "preserve-cell":
      return "This cell stays as it is because it is either already X or proved safe.";
    default:
      return "Only the O cells that cannot reach the border get captured.";
  }
}

function buildExpertFocus(step: SurroundedRegionsTraceStep) {
  switch (step.actionKind) {
    case "scan-border":
      return "The traversal seeds the search from every boundary O because border reachability is the exact preservation criterion.";
    case "seed-safe":
      return "Marking a border O safe is analogous to changing it to a temporary sentinel value in the in-place solution.";
    case "skip-border":
      return "Duplicate seeds are rejected so each reachable O enters the queue at most once.";
    case "pop-safe":
      return "Queue expansion performs a BFS over the border-reachable subgraph induced by O cells.";
    case "inspect-neighbor":
      return "The adjacency relation is four-directional, so diagonal contact does not preserve a region.";
    case "mark-safe":
      return "Every marked-safe cell is proven to have a path of O cells to the border.";
    case "ignore-neighbor":
      return "Guards prevent the search from crossing walls, leaving the board, or revisiting reachable vertices.";
    case "scan-flip":
      return "The second pass is a classification pass that uses the reachability labels computed earlier.";
    case "capture-cell":
      return "Any O omitted from the border-reachable set is enclosed and therefore flippable.";
    case "preserve-cell":
      return "Safe O cells are restored, while X cells pass through untouched.";
    default:
      return "The algorithm runs in O(rows * cols) time because every cell is processed a constant number of times.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the border-reachability rule that decides which O cells survive.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Phase
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.phase}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Scan Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {formatCoord(step.pointers.scan)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            BFS Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {formatCoord(step.pointers.current)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {formatCoord(step.pointers.neighbor)}
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
            Reachability Ledger
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Border Seeds
              </p>
              <p className="mt-1 font-mono text-sm text-violet-200">
                {step.state.borderSeedCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Safe Cells
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {step.state.safeCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Captured
              </p>
              <p className="mt-1 font-mono text-sm text-rose-200">
                {step.state.capturedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Key Idea
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The visualizer never asks whether an O is &quot;surrounded&quot; directly.
            Instead, it asks the easier opposite question:
            <span className="text-cyan-200"> can this O reach the border?</span>
            If the answer is yes, the cell survives. If the answer is no, the
            cell gets captured.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <FrontierQueue
          title="Live BFS Queue"
          frontier={step.state.frontier}
          active={step.pointers.current}
          emptyLabel="No safe cells are waiting in the queue."
        />

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Phase Summary
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
              1. Scan the border and queue every O that is immediately safe.
            </div>
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
              2. Traverse outward through connected O cells to mark the full safe region.
            </div>
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2">
              3. Flip only the O cells that were never marked safe.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
