import QueueStrip from "./QueueStrip";
import RightViewStrip from "./RightViewStrip";
import TreeNodeCard from "./TreeNodeCard";
import type { RightViewTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: RightViewTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const treeWidth = Math.max(760, deepestSlots * 140);
  const canvasWidth = treeWidth + 180;
  const canvasHeight = Math.max(280, 220 + maxDepth * 160);
  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = 70 + ((node.order + 1) * treeWidth) / (levelSlots + 1);
    const y = 110 + node.depth * 152;
    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function labelOf(step: RightViewTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function BinaryTreeRightSideViewWorkbench({
  step,
}: {
  step: RightViewTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const queueSet = new Set(step.state.queueIds);
  const currentLevelSet = new Set(step.state.currentLevelIds);
  const processedSet = new Set(step.state.processedLevelIds);
  const remainingSet = new Set(step.state.remainingLevelIds);
  const nextLevelSet = new Set(step.state.nextLevelIds);
  const rightViewSet = new Set(step.state.rightViewIds);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Queue-Driven BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Watch each level reveal its rightmost node
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan tracks the node being popped, purple marks queued children,
            yellow previews the rightmost candidate of the active level, and
            green marks nodes that are already part of the answer.
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
            Level Width{" "}
            <span className="font-mono text-violet-200">
              {step.pointers.levelSize}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Visible {step.state.rightViewIds.length}
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
            Right Candidate
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {labelOf(step, step.pointers.candidateId)}
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

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: node being processed now
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: last node scheduled on this level
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: queued for a future visit
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: already visible from the right
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: this level already processed the node
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {step.state.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Empty tree. No nodes are visible from the right.
            </div>
          ) : (
            <>
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              >
                <defs>
                  <marker
                    id="right-view-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="5"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 7 3.5, 0 7" fill="#34d399" />
                  </marker>
                  <marker
                    id="candidate-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="5"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 7 3.5, 0 7" fill="#facc15" />
                  </marker>
                </defs>

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

                        const childIsQueued =
                          queueSet.has(childId) || nextLevelSet.has(childId);
                        const childIsVisible = rightViewSet.has(childId);
                        const stroke = childIsVisible
                          ? "#34d399"
                          : childIsQueued
                          ? "#a78bfa"
                          : "#334155";
                        const width = childIsVisible ? 3.2 : childIsQueued ? 2.6 : 2;
                        const opacity = childIsVisible ? 0.92 : childIsQueued ? 0.84 : 0.58;

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

                {step.state.levelSummaries.map((summary) => {
                  const point = positions.get(summary.visibleId);
                  if (!point) {
                    return null;
                  }

                  return (
                    <line
                      key={`view-${summary.visibleId}`}
                      x1={canvasWidth - 34}
                      y1={point.y}
                      x2={point.x + 36}
                      y2={point.y}
                      stroke="#34d399"
                      strokeWidth={summary.visibleId === step.pointers.candidateId ? 3.8 : 3}
                      opacity={0.92}
                      markerEnd="url(#right-view-arrow)"
                    />
                  );
                })}

                {step.pointers.candidateId &&
                !rightViewSet.has(step.pointers.candidateId) ? (
                  (() => {
                    const point = positions.get(step.pointers.candidateId);
                    if (!point) {
                      return null;
                    }

                    return (
                      <line
                        x1={canvasWidth - 34}
                        y1={point.y}
                        x2={point.x + 36}
                        y2={point.y}
                        stroke="#facc15"
                        strokeWidth={3}
                        strokeDasharray="10 8"
                        opacity={0.82}
                        markerEnd="url(#candidate-arrow)"
                      />
                    );
                  })()
                ) : null}
              </svg>

              {step.state.nodes.map((node) => {
                const position = positions.get(node.id);
                if (!position) {
                  return null;
                }

                const isCurrent = step.pointers.currentId === node.id;
                const isQueueFront = step.pointers.queueFrontId === node.id;
                const isCandidate =
                  step.pointers.candidateId === node.id && !rightViewSet.has(node.id);
                const isNewlyEnqueued = step.pointers.enqueuedChildId === node.id;
                const isVisible = rightViewSet.has(node.id);
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

                if (isQueueFront && !isCurrent) {
                  badges.push({
                    label: "FRONT",
                    className: "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                if (isCandidate) {
                  badges.push({
                    label: "VIEW",
                    className: "border-yellow-400/70 bg-yellow-500/12 text-yellow-100",
                  });
                }

                if (isNewlyEnqueued) {
                  badges.push({
                    label: "NEW",
                    className: "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                if (isVisible) {
                  badges.push({
                    label: "SEEN",
                    className: "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                }

                const toneClass =
                  isVisible && isCurrent
                    ? "border-emerald-400/85 bg-emerald-500/18 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.28)]"
                    : isCurrent
                    ? "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                    : isCandidate
                    ? "border-yellow-400/80 bg-yellow-500/16 text-yellow-50 shadow-[0_0_28px_rgba(250,204,21,0.22)]"
                    : isNewlyEnqueued
                    ? "border-violet-400/80 bg-violet-500/16 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.22)]"
                    : isVisible
                    ? "border-emerald-400/70 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.2)]"
                    : isProcessed
                    ? "border-rose-400/60 bg-rose-500/10 text-rose-50 shadow-[0_0_22px_rgba(251,113,133,0.14)]"
                    : isQueued
                    ? "border-violet-400/55 bg-violet-500/10 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.14)]"
                    : isRemaining || isCurrentLevel
                    ? "border-cyan-400/45 bg-cyan-500/8 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                    : "border-slate-800/80 bg-slate-950/80 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.35)]";

                return (
                  <TreeNodeCard
                    key={node.id}
                    x={position.x}
                    y={position.y}
                    value={node.value}
                    toneClass={toneClass}
                    badges={badges}
                    caption={isVisible ? "right view" : isQueued ? "queued" : null}
                    dimmed={!isCurrentLevel && !isQueued && !isVisible && step.state.nodes.length > 1}
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
          helperText="This is the exact order in which future nodes will be visited."
        />
        <QueueStrip
          title="Remaining Current Level"
          ids={step.state.remainingLevelIds}
          nodes={step.state.nodes}
          accent="cyan"
          frontId={step.state.remainingLevelIds[0] ?? null}
          highlightId={step.pointers.candidateId}
          emptyLabel="This level has been fully processed."
          helperText="Only these nodes still belong to the active level."
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="yellow"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No child has been scheduled for the next level yet."
          helperText="Children discovered on this level accumulate here before the next outer-loop pass begins."
        />
        <RightViewStrip
          title="Right Side View"
          summaries={step.state.levelSummaries}
          highlightId={step.pointers.currentId ?? step.pointers.candidateId}
          emptyLabel="No visible node has been captured yet."
          helperText="One green node is saved from each finished level."
        />
      </div>
    </section>
  );
}
