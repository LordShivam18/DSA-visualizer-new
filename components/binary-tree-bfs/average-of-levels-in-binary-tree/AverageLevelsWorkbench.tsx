import AverageStrip from "./AverageStrip";
import QueueStrip from "./QueueStrip";
import TreeNodeCard from "./TreeNodeCard";
import { formatAverage, type AverageTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: AverageTraceStep) {
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

function labelOf(step: AverageTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function AverageLevelsWorkbench({
  step,
}: {
  step: AverageTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const queueSet = new Set(step.state.queueIds);
  const currentLevelSet = new Set(step.state.currentLevelIds);
  const processedSet = new Set(step.state.processedLevelIds);
  const remainingSet = new Set(step.state.remainingLevelIds);
  const nextLevelSet = new Set(step.state.nextLevelIds);
  const averagedSet = new Set(step.state.averagedIds);
  const latestLevel =
    step.state.levelSummaries[step.state.levelSummaries.length - 1]?.level ?? null;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Level Averaging BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Accumulate each row, then divide once
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Yellow marks the active level, cyan marks the node currently being
            added, purple shows queued children, rose marks nodes already folded
            into the running sum, and green marks levels whose averages are locked in.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Queue{" "}
            <span className="font-mono text-cyan-200">
              {step.state.queueIds.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Running Sum{" "}
            <span className="font-mono text-violet-200">
              {step.pointers.runningSum}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Resolved {step.state.levelSummaries.length}
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
            Running Sum
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.runningSum}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Running Count
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.runningCount}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Live Average
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatAverage(step.pointers.runningAverage)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-slate-800/80 bg-gradient-to-br from-[#07111f] via-slate-950/80 to-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Current Formula
        </p>
        <p className="mt-3 font-mono text-base text-slate-100">
          {step.pointers.runningCount === 0
            ? "waiting for the first node on this level"
            : `${step.pointers.runningSum} / ${step.pointers.runningCount} = ${formatAverage(step.pointers.runningAverage)}`}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: node being added right now
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: active level
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: queued for the next level
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Rose: already added into this level sum
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: level average already finalized
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {step.state.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Empty tree. No level averages exist.
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

                        const childIsAveraged = averagedSet.has(childId);
                        const childIsQueued =
                          queueSet.has(childId) || nextLevelSet.has(childId);
                        const childIsCurrentLevel = currentLevelSet.has(childId);
                        const childIsProcessed = processedSet.has(childId);

                        const stroke = childIsAveraged
                          ? "#34d399"
                          : childIsQueued
                          ? "#a78bfa"
                          : childIsProcessed
                          ? "#fb7185"
                          : childIsCurrentLevel
                          ? "#facc15"
                          : "#334155";

                        const width = childIsAveraged
                          ? 3.2
                          : childIsQueued || childIsProcessed || childIsCurrentLevel
                          ? 2.7
                          : 2;

                        const opacity = childIsAveraged
                          ? 0.92
                          : childIsQueued || childIsProcessed || childIsCurrentLevel
                          ? 0.84
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
                const isAveraged = averagedSet.has(node.id);
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

                if (isAveraged) {
                  badges.push({
                    label: "AVG",
                    className: "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                } else if (isProcessed && !isCurrent) {
                  badges.push({
                    label: "SUM",
                    className: "border-rose-400/70 bg-rose-500/12 text-rose-100",
                  });
                }

                const toneClass =
                  isAveraged && isCurrent
                    ? "border-emerald-400/85 bg-emerald-500/18 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.28)]"
                    : isCurrent
                    ? "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                    : isNewlyEnqueued
                    ? "border-violet-400/80 bg-violet-500/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.22)]"
                    : isAveraged
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
                      isAveraged
                        ? "avg locked"
                        : isQueued
                        ? "queued"
                        : isCurrentLevel
                        ? "this level"
                        : null
                    }
                    dimmed={!isCurrentLevel && !isQueued && !isAveraged && step.state.nodes.length > 1}
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
          helperText="These nodes will be visited in this exact future order."
        />
        <QueueStrip
          title="Remaining Current Level"
          ids={step.state.remainingLevelIds}
          nodes={step.state.nodes}
          accent="yellow"
          frontId={step.state.remainingLevelIds[0] ?? null}
          highlightId={step.pointers.currentId}
          emptyLabel="The active level has already been fully consumed."
          helperText="Only these nodes still belong to the row whose average is being built."
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="cyan"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No child has been queued for the next level yet."
          helperText="Children discovered on this level accumulate here until the next outer-loop pass begins."
        />
        <AverageStrip
          title="Level Average Ledger"
          summaries={step.state.levelSummaries}
          nodes={step.state.nodes}
          highlightLevel={latestLevel}
          emptyLabel="No level average has been finalized yet."
          helperText="Each completed row records the exact values, sum, count, and final average."
        />
      </div>
    </section>
  );
}
