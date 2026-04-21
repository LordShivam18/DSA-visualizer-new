import type {
  SnakesAndLaddersActionKind,
  SnakesAndLaddersTraceStep,
} from "./generateTrace";

type Props = {
  step: SnakesAndLaddersTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(kind: SnakesAndLaddersActionKind) {
  switch (kind) {
    case "parsed":
      return "We are turning the board into numbered squares so BFS can reason about moves cleanly.";
    case "seed":
      return "The journey starts on square 1 before any die roll happens.";
    case "dequeue":
      return "This square is the next one BFS should expand because it was reached using the fewest rolls so far.";
    case "roll":
      return "A die roll tests one possible next square from the current position.";
    case "portal":
      return "Snakes and ladders are forced jumps, so the move finishes where the portal sends us.";
    case "enqueue":
      return "This is the first time we have reached that square, so BFS records the best distance and saves it for later.";
    case "skip":
      return "We skip squares that were already discovered because BFS already knows an equal or shorter route.";
    default:
      return "Once BFS reaches the target square for the first time, that roll count is guaranteed to be optimal.";
  }
}

function expertFocus(kind: SnakesAndLaddersActionKind) {
  switch (kind) {
    case "parsed":
      return "The board is an implicit unweighted graph over labels 1..n^2 with boustrophedon coordinate mapping.";
    case "seed":
      return "The source vertex is square 1 with distance 0.";
    case "dequeue":
      return "Vertices are expanded in nondecreasing distance order because the queue stores BFS layers.";
    case "roll":
      return "The dice loop enumerates up to six outgoing edges for the current vertex.";
    case "portal":
      return "A snake or ladder rewrites the edge endpoint once, matching the problem's single-portal-per-roll rule.";
    case "enqueue":
      return "The first discovery of a vertex finalizes its shortest-path distance in an unweighted graph.";
    case "skip":
      return "The distance/visited guard removes redundant work and bounds the traversal to O(n^2).";
    default:
      return "BFS optimality ensures the first discovered path to the target is globally minimal.";
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
            Focus on why BFS guarantees the fewest dice rolls.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentSquare ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Raw Landing
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.candidateSquare ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Final Destination
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.destinationSquare ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.queue.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? beginnerFocus(step.actionKind)
            : expertFocus(step.actionKind)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Portal Focus
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {step.pointers.portalFocus ? (
              <>
                Square{" "}
                <span className="font-mono text-slate-100">
                  {step.pointers.portalFocus.from}
                </span>{" "}
                jumps to{" "}
                <span className="font-mono text-slate-100">
                  {step.pointers.portalFocus.to}
                </span>{" "}
                via a{" "}
                <span
                  className={
                    step.pointers.portalFocus.type === "snake"
                      ? "text-rose-200"
                      : "text-emerald-200"
                  }
                >
                  {step.pointers.portalFocus.type}
                </span>
                .
              </>
            ) : (
              "No snake or ladder is active in this snapshot."
            )}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Best Known Target Distance
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {step.state.result === null
              ? "BFS is still building layers, so the target has not been finalized yet."
              : step.state.result === -1
              ? "The frontier is exhausted and the target was never discovered."
              : `The target is locked in at ${step.state.result} roll${
                  step.state.result === 1 ? "" : "s"
                } because BFS found it first at that layer.`}
          </p>
        </div>
      </div>
    </div>
  );
}
