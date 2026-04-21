import FrontierStack from "./FrontierStack";
import {
  formatCoord,
  type NumberOfIslandsTraceStep,
} from "./generateTrace";

type Props = {
  step: NumberOfIslandsTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: NumberOfIslandsTraceStep) {
  switch (step.actionKind) {
    case "scan-cell":
      return "The outer scan is looking for land that has never been claimed by an earlier island.";
    case "skip-cell":
      return "This cell does not start a new island, so the scan safely moves on.";
    case "start-island":
      return "The island counter increases exactly once here because this land cell starts a brand-new connected region.";
    case "pop-cell":
      return "DFS pulled one land cell from the stack so it can look in all four directions from it.";
    case "inspect-neighbor":
      return "Each neighbor check asks one question: can this adjacent cell join the current island?";
    case "push-neighbor":
      return "This neighboring land cell belongs to the same island, so it is marked and added to the stack.";
    case "ignore-neighbor":
      return "The checked neighbor cannot extend the island because it is outside the grid, water, or already claimed.";
    case "finish-island":
      return "The stack is empty, which means every connected land cell for this island has been explored.";
    default:
      return "Once the whole grid is scanned, the island count is final.";
  }
}

function buildExpertFocus(step: NumberOfIslandsTraceStep) {
  switch (step.actionKind) {
    case "scan-cell":
      return "The scan phase searches for an unseen component root. Only untouched land may trigger a new DFS and increment the answer.";
    case "skip-cell":
      return "Water and already-claimed land are both excluded by the same invariant: they cannot begin a fresh connected component.";
    case "start-island":
      return "The component count increments before expansion because the traversal has identified a new connected component representative.";
    case "pop-cell":
      return "The explicit stack simulates recursive DFS, expanding one frontier vertex at a time in the implicit grid graph.";
    case "inspect-neighbor":
      return "Traversal uses 4-direction adjacency only. Diagonal cells are intentionally ignored to match the problem definition.";
    case "push-neighbor":
      return "Mark-on-discovery guarantees linear work because each land vertex enters the frontier at most once.";
    case "ignore-neighbor":
      return "Every rejected neighbor preserves the one-visit-per-land-cell invariant and prevents redundant traversal.";
    case "finish-island":
      return "Exhausting the stack proves the full connected component has been traversed, so no additional cell can belong to that island.";
    default:
      return "The algorithm visits each cell at most once, giving O(rows * cols) time and O(rows * cols) worst-case auxiliary space.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  const currentIslandSize =
    step.state.currentIslandId === null
      ? 0
      : step.state.islandSizes.find(
          (entry) => entry.islandId === step.state.currentIslandId
        )?.size ?? 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Focus on why a cell does or does not belong to the current island.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
            Expanding
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
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Island
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.currentIslandId ?? "none"}
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
            Claiming Progress
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Land Visited
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.visitedLandCount}/{step.state.totalLandCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Frontier
              </p>
              <p className="mt-1 font-mono text-sm text-violet-200">
                {step.state.frontier.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Island Size
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {currentIslandSize}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Counting Rule
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The answer increases only when the outer scan lands on an unseen
            <span className="text-cyan-200"> &apos;1&apos;</span>. All other land reached
            afterward is absorbed into that same island and never counted again.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <FrontierStack
          title="Live DFS Stack"
          frontier={step.state.frontier}
          active={step.pointers.current}
          emptyLabel="No pending land cells remain on the stack."
        />

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Island Sizes
          </p>
          {step.state.islandSizes.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No island has been discovered yet.
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {step.state.islandSizes.map((entry) => (
                <div
                  key={entry.islandId}
                  className={`rounded-xl border px-3 py-2 ${
                    entry.islandId === step.state.currentIslandId
                      ? "border-violet-400/45 bg-violet-500/10 text-violet-100"
                      : step.state.completedIslands.includes(entry.islandId)
                      ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Island {entry.islandId}</span>
                    <span className="font-mono text-sm">{entry.size} cells</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
