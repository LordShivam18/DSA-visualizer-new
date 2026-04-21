import BoardSquare from "./BoardSquare";
import FrontierQueue from "./FrontierQueue";
import PathStrip from "./PathStrip";
import type {
  BoardCellRecord,
  SnakesAndLaddersTraceStep,
} from "./generateTrace";

function buildRows(cells: BoardCellRecord[], size: number) {
  return Array.from({ length: size }, (_, row) =>
    cells
      .filter((cell) => cell.row === row)
      .sort((left, right) => left.col - right.col)
  );
}

export default function SnakesAndLaddersWorkbench({
  step,
}: {
  step: SnakesAndLaddersTraceStep;
}) {
  const rows = buildRows(step.state.cells, step.state.size);
  const visitedSet = new Set(step.state.visited);
  const processedSet = new Set(step.state.processed);
  const queueSet = new Set(step.state.queue.map((entry) => entry.square));
  const pathSet = new Set(step.state.bestPath);
  const portalSource = step.pointers.portalFocus?.from ?? null;
  const portalDestination = step.pointers.portalFocus?.to ?? null;
  const distances = step.state.distances;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Board BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Explore dice-roll edges level by level until the target square is first discovered
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the square currently being expanded, yellow marks the raw
            die-roll landing, purple marks the redirected portal destination or
            queued frontier, green marks confirmed shortest-path discoveries,
            and red signals snake danger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Squares: {step.state.target}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Queue: {step.state.queue.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Visited: {step.state.visited.length}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Square
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentSquare ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Die Roll
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.dieRoll ?? "--"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Destination
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.destinationSquare ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Best Answer
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.result ?? "--"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: current BFS square
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: raw die-roll landing
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: queued frontier or portal destination
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: confirmed shortest-path square
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: snake portal
        </span>
      </div>

      {step.state.size === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          Enter a square matrix to build the board.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${step.state.size}, minmax(0, 1fr))`,
              }}
            >
              {rows.flat().map((cell) => {
                const isCurrent = step.pointers.currentSquare === cell.label;
                const isCandidate = step.pointers.candidateSquare === cell.label;
                const isDestination = step.pointers.destinationSquare === cell.label;
                const isPortalSource = portalSource === cell.label;
                const isPortalDestination = portalDestination === cell.label;

                const tags: string[] = [];
                if (isCurrent) {
                  tags.push("CUR");
                } else if (isCandidate) {
                  tags.push("ROLL");
                } else if (isDestination) {
                  tags.push("DEST");
                }

                if (queueSet.has(cell.label) && !tags.includes("Q")) {
                  tags.push(
                    step.pointers.queueFront === cell.label ? "FRONT" : "Q"
                  );
                }

                if (pathSet.has(cell.label) && step.done && step.state.result !== -1) {
                  tags.push("PATH");
                }

                let toneClass =
                  "border-slate-700/80 bg-slate-900/80 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.35)]";

                if (cell.portalType === "ladder") {
                  toneClass =
                    "border-emerald-500/30 bg-emerald-500/8 text-slate-100";
                } else if (cell.portalType === "snake") {
                  toneClass =
                    "border-rose-500/30 bg-rose-500/8 text-slate-100";
                }

                if (visitedSet.has(cell.label)) {
                  toneClass =
                    "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.12)]";
                }

                if (queueSet.has(cell.label)) {
                  toneClass =
                    "border-violet-400/45 bg-violet-500/12 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.14)]";
                }

                if (processedSet.has(cell.label)) {
                  toneClass =
                    "border-emerald-400/55 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.18)]";
                }

                if (isPortalDestination) {
                  toneClass =
                    "border-violet-400/80 bg-violet-500/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.2)]";
                }

                if (isPortalSource) {
                  toneClass =
                    cell.portalType === "snake"
                      ? "border-rose-400/85 bg-rose-500/16 text-rose-50 shadow-[0_0_30px_rgba(251,113,133,0.2)]"
                      : "border-emerald-400/85 bg-emerald-500/16 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.2)]";
                }

                if (isCandidate) {
                  toneClass =
                    "border-yellow-400/85 bg-yellow-500/16 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.2)]";
                }

                if (isCurrent) {
                  toneClass =
                    "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_32px_rgba(34,211,238,0.22)]";
                }

                return (
                  <BoardSquare
                    key={cell.label}
                    cell={cell}
                    toneClass={toneClass}
                    tags={tags}
                    distance={distances[cell.label] === -1 ? null : distances[cell.label]}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <FrontierQueue
              queue={step.state.queue}
              activeSquare={step.pointers.currentSquare}
            />
            <PathStrip path={step.state.bestPath} result={step.state.result} />
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Portal Ledger
          </p>
          {step.state.cells.every((cell) => cell.portalTo === null) ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              This board has no snakes or ladders.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {step.state.cells
                .filter((cell) => cell.portalTo !== null)
                .map((cell) => (
                  <div
                    key={`portal-${cell.label}`}
                    className={`rounded-xl border px-3 py-3 ${
                      step.pointers.portalFocus?.from === cell.label
                        ? cell.portalType === "snake"
                          ? "border-rose-400/45 bg-rose-500/10 text-rose-100"
                          : "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                        : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">
                        {cell.portalType === "snake" ? "Snake" : "Ladder"} at{" "}
                        {cell.label}
                      </span>
                      <span className="font-mono text-sm">
                        -&gt; {cell.portalTo}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Discovery Ledger
          </p>
          {step.state.moveHistory.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              New shortest-path discoveries will be listed here.
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {step.state.moveHistory.slice(-8).map((move, index) => (
                <div
                  key={`${move.from}-${move.destination}-${index}`}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-3 text-sm text-slate-300"
                >
                  <span className="font-semibold text-slate-100">
                    {move.from}
                  </span>{" "}
                  + roll <span className="font-semibold text-yellow-200">{move.roll}</span>{" "}
                  = <span className="font-semibold text-slate-100">{move.raw}</span>
                  {move.usedPortal ? (
                    <>
                      {" "}
                      then portal to{" "}
                      <span className="font-semibold text-violet-200">
                        {move.destination}
                      </span>
                    </>
                  ) : (
                    <>
                      {" "}
                      reaches{" "}
                      <span className="font-semibold text-violet-200">
                        {move.destination}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
