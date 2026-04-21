import QueueStrip from "./QueueStrip";
import TreeNodeCard from "./TreeNodeCard";
import ZigzagSlots from "./ZigzagSlots";
import ZigzagStrip from "./ZigzagStrip";
import { formatDirection, type ZigzagTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: ZigzagTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const treeWidth = Math.max(760, deepestSlots * 140);
  const canvasWidth = treeWidth + 120;
  const canvasHeight = Math.max(280, 220 + maxDepth * 160);
  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = 60 + ((node.order + 1) * treeWidth) / (levelSlots + 1);
    const y = 110 + node.depth * 152;
    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function labelOf(step: ZigzagTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function ZigzagLevelOrderWorkbench({
  step,
}: {
  step: ZigzagTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const queueSet = new Set(step.state.queueIds);
  const currentLevelSet = new Set(step.state.currentLevelIds);
  const processedSet = new Set(step.state.processedLevelIds);
  const remainingSet = new Set(step.state.remainingLevelIds);
  const nextLevelSet = new Set(step.state.nextLevelIds);
  const completedSet = new Set(step.state.completedLevelIds);
  const latestLevel =
    step.state.levelSummaries[step.state.levelSummaries.length - 1]?.level ?? null;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Zigzag BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Keep BFS order, mirror the write index
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan tracks the node being popped, yellow shows the active zigzag
            write direction, purple marks the next frontier, rose marks nodes
            already written into the current row, and green marks committed rows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Queue{" "}
            <span className="font-mono text-cyan-200">
              {step.state.queueIds.length}
            </span>
          </span>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100">
            Direction {formatDirection(step.pointers.direction)}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Committed {step.state.levelSummaries.length}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.queueFrontId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Write Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.writeIndex ?? "idle"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Next Child
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.enqueuedSide
              ? `${step.pointers.enqueuedSide} @ ${labelOf(step, step.pointers.enqueuedChildId)}`
              : "idle"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-slate-800/80 bg-gradient-to-br from-[#07111f] via-slate-950/80 to-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Write Formula
        </p>
        <p className="mt-3 font-mono text-base text-slate-100">
          {step.pointers.indexInLevel < 0
            ? "waiting for this level's first pop"
            : step.pointers.direction === "left-to-right"
            ? `writeIndex = ${step.pointers.indexInLevel}`
            : `writeIndex = ${step.pointers.levelSize} - 1 - ${step.pointers.indexInLevel} = ${step.pointers.writeIndex ?? "?"}`}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: node being processed now
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: active write slot
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: queued for the next level
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Rose: written this row
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: committed output
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {step.state.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Empty tree. No zigzag levels exist.
            </div>
          ) : (
            <>
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              >
                {step.state.nodes.map((node) => {
                  const source = positions.get(node.id);
                  if (!source) {
                    return null;
                  }

                  return (
                    <g key={`edges-${node.id}`}>
                      {[node.leftId, node.rightId].map((childId) => {
                        if (!childId) {
                          return null;
                        }

                        const target = positions.get(childId);
                        if (!target) {
                          return null;
                        }

                        const childIsCompleted = completedSet.has(childId);
                        const childIsQueued =
                          queueSet.has(childId) || nextLevelSet.has(childId);
                        const childIsCurrentLevel = currentLevelSet.has(childId);
                        const childIsProcessed = processedSet.has(childId);

                        const stroke = childIsCompleted
                          ? "#34d399"
                          : childIsQueued
                          ? "#a78bfa"
                          : childIsProcessed
                          ? "#fb7185"
                          : childIsCurrentLevel
                          ? "#facc15"
                          : "#334155";

                        const width =
                          childIsCompleted ||
                          childIsQueued ||
                          childIsProcessed ||
                          childIsCurrentLevel
                            ? 2.8
                            : 2;

                        const opacity =
                          childIsCompleted ||
                          childIsQueued ||
                          childIsProcessed ||
                          childIsCurrentLevel
                            ? 0.86
                            : 0.58;

                        return (
                          <line
                            key={`${node.id}-${childId}`}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={stroke}
                            strokeWidth={width}
                            opacity={opacity}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {step.state.nodes.map((node) => {
                const position = positions.get(node.id);
                if (!position) {
                  return null;
                }

                const isCurrent = step.pointers.currentId === node.id;
                const isNewlyEnqueued = step.pointers.enqueuedChildId === node.id;
                const isCompleted = completedSet.has(node.id);
                const isProcessed = processedSet.has(node.id);
                const isRemaining = remainingSet.has(node.id);
                const isQueued = queueSet.has(node.id) || nextLevelSet.has(node.id);
                const isCurrentLevel = currentLevelSet.has(node.id);

                const badges: Array<{ label: string; className: string }> = [];

                if (isCurrent) {
                  badges.push({
                    label: "CURR",
                    className: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
                  });
                }

                if (isNewlyEnqueued) {
                  badges.push({
                    label: "NEW",
                    className: "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                if (isCompleted) {
                  badges.push({
                    label: "OUT",
                    className: "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                } else if (isProcessed && !isCurrent) {
                  badges.push({
                    label: "WRITE",
                    className: "border-rose-400/70 bg-rose-500/12 text-rose-100",
                  });
                }

                const toneClass =
                  isCompleted && isCurrent
                    ? "border-emerald-400/85 bg-emerald-500/18 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.28)]"
                    : isCurrent
                    ? "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                    : isNewlyEnqueued
                    ? "border-violet-400/80 bg-violet-500/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.22)]"
                    : isCompleted
                    ? "border-emerald-400/70 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.2)]"
                    : isProcessed
                    ? "border-rose-400/60 bg-rose-500/10 text-rose-50 shadow-[0_0_22px_rgba(251,113,133,0.14)]"
                    : isRemaining || isCurrentLevel
                    ? "border-yellow-400/55 bg-yellow-500/10 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.14)]"
                    : isQueued
                    ? "border-violet-400/55 bg-violet-500/10 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.14)]"
                    : "border-slate-800/80 bg-slate-950/80 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.35)]";

                return (
                  <TreeNodeCard
                    key={node.id}
                    x={position.x}
                    y={position.y}
                    value={node.value}
                    toneClass={toneClass}
                    badges={badges}
                    caption={
                      isCompleted
                        ? "output"
                        : isQueued
                        ? "queued"
                        : isCurrentLevel
                        ? "this level"
                        : null
                    }
                    dimmed={
                      !isCurrentLevel &&
                      !isQueued &&
                      !isCompleted &&
                      step.state.nodes.length > 1
                    }
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <QueueStrip
          title="BFS Queue"
          ids={step.state.queueIds}
          nodes={step.state.nodes}
          accent="violet"
          frontId={step.pointers.queueFrontId}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="The queue is empty."
          helperText="Traversal order stays normal BFS even when output writes in reverse."
        />
        <ZigzagSlots
          slots={step.state.activeLevelSlots}
          writeIndex={step.pointers.writeIndex}
          direction={step.pointers.direction}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <QueueStrip
          title="Remaining Current Level"
          ids={step.state.remainingLevelIds}
          nodes={step.state.nodes}
          accent="yellow"
          frontId={step.state.remainingLevelIds[0] ?? null}
          highlightId={step.pointers.currentId}
          emptyLabel="The active level has already been fully consumed."
          helperText="These nodes still need a mirrored write slot on the active row."
        />
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="cyan"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No child has been queued for the next level yet."
          helperText="Children discovered on this row wait here for the next direction."
        />
      </div>

      <div className="mt-3">
        <ZigzagStrip
          title="Zigzag Output"
          summaries={step.state.levelSummaries}
          nodes={step.state.nodes}
          highlightLevel={latestLevel}
          emptyLabel="No output row has been committed yet."
          helperText="Each green entry is one completed row after applying its direction."
        />
      </div>
    </section>
  );
}
