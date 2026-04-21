import BoundaryStrip from "./BoundaryStrip";
import CountLedgerTable from "./CountLedgerTable";
import TreeNodeCard from "./TreeNodeCard";
import type { CountTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: CountTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const canvasWidth = Math.max(820, deepestSlots * 140);
  const canvasHeight = Math.max(260, 220 + maxDepth * 156);
  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = ((node.order + 1) * canvasWidth) / (levelSlots + 1);
    const y = 108 + node.depth * 152;
    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function edgeKey(parentId: string, childId: string) {
  return `${parentId}-${childId}`;
}

function edgeSetFromPath(ids: string[]) {
  const edges = new Set<string>();

  for (let index = 1; index < ids.length; index += 1) {
    edges.add(edgeKey(ids[index - 1], ids[index]));
  }

  return edges;
}

function labelOf(step: CountTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function CountCompleteTreeNodesWorkbench({
  step,
}: {
  step: CountTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const activeSubtreeSet = new Set(step.state.activeSubtreeIds);
  const leftBoundarySet = new Set(step.state.leftBoundaryIds);
  const rightBoundarySet = new Set(step.state.rightBoundaryIds);
  const resolvedSet = new Set(step.state.resolvedNodeIds);
  const perfectSet = new Set(step.state.perfectNodeIds);
  const splitSet = new Set(step.state.splitNodeIds);
  const stackSet = new Set(step.state.currentPathIds);
  const leftEdgeSet = edgeSetFromPath(step.state.leftBoundaryIds);
  const rightEdgeSet = edgeSetFromPath(step.state.rightBoundaryIds);
  const stackEdgeSet = edgeSetFromPath(step.state.currentPathIds);

  const ledgerMap = new Map(step.state.ledger.map((entry) => [entry.nodeId, entry]));

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Perfect Subtree Detector
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Compare the outer heights before recursing deeper
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Yellow traces the far-left boundary, purple traces the far-right
            boundary, cyan marks the active subtree root, and green shows
            subtrees whose node counts are already resolved.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Calls{" "}
            <span className="font-mono text-cyan-200">
              {step.state.subtreeCalls}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Height Visits{" "}
            <span className="font-mono text-violet-200">
              {step.state.heightVisits}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Resolved {step.state.resolvedCount}/{step.state.nodes.length}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Left Height
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.leftHeight ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Right Height
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.rightHeight ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Latest Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.latestReturn ?? "pending"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Call Depth
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.callDepth}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active subtree root
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: left boundary probe
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: right boundary probe
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: subtree count already resolved
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: subtree had to split and recurse
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {step.state.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Empty tree. The answer is 0.
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

                        const key = edgeKey(node.id, childId);
                        const isLeftEdge = leftEdgeSet.has(key);
                        const isRightEdge = rightEdgeSet.has(key);
                        const isStackEdge = stackEdgeSet.has(key);
                        const isResolvedEdge =
                          resolvedSet.has(node.id) && resolvedSet.has(childId);

                        const stroke = isLeftEdge
                          ? "#facc15"
                          : isRightEdge
                          ? "#a78bfa"
                          : isStackEdge
                          ? "#22d3ee"
                          : isResolvedEdge
                          ? "#34d399"
                          : "#334155";

                        const width = isLeftEdge || isRightEdge ? 3.4 : isStackEdge ? 3 : isResolvedEdge ? 3 : 2;
                        const opacity = isLeftEdge || isRightEdge || isStackEdge ? 0.94 : isResolvedEdge ? 0.88 : 0.55;

                        return (
                          <line
                            key={key}
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

                const entry = ledgerMap.get(node.id);
                const isCurrent = step.pointers.currentId === node.id;
                const isProbe = step.pointers.probeId === node.id;
                const isFocus =
                  step.pointers.focusNodeId === node.id &&
                  (step.actionKind === "perfect-subtree" ||
                    step.actionKind === "combine" ||
                    step.done);
                const isLeft = leftBoundarySet.has(node.id);
                const isRight = rightBoundarySet.has(node.id);
                const isResolved = resolvedSet.has(node.id);
                const isPerfect = perfectSet.has(node.id);
                const isSplit = splitSet.has(node.id);
                const isStack = stackSet.has(node.id) && !isCurrent;
                const isActiveSubtree =
                  activeSubtreeSet.size === 0 || activeSubtreeSet.has(node.id);

                const badges: Array<{ label: string; className: string }> = [];

                if (isCurrent) {
                  badges.push({
                    label: "CURR",
                    className: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
                  });
                }

                if (isProbe && step.pointers.probeDirection === "left") {
                  badges.push({
                    label: "L",
                    className: "border-yellow-400/70 bg-yellow-500/12 text-yellow-100",
                  });
                }

                if (isProbe && step.pointers.probeDirection === "right") {
                  badges.push({
                    label: "R",
                    className: "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                if (entry?.strategy === "perfect") {
                  badges.push({
                    label: "FAST",
                    className: "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                } else if (entry?.strategy === "combined") {
                  badges.push({
                    label: "COUNT",
                    className: "border-emerald-400/55 bg-emerald-500/10 text-emerald-100",
                  });
                }

                if (isSplit && !entry) {
                  badges.push({
                    label: "SPLIT",
                    className: "border-rose-400/70 bg-rose-500/12 text-rose-100",
                  });
                }

                if (isStack) {
                  badges.push({
                    label: "STACK",
                    className: "border-cyan-400/40 bg-cyan-500/8 text-cyan-100",
                  });
                }

                const toneClass = isFocus
                  ? "border-emerald-400/80 bg-emerald-500/16 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.28)]"
                  : isProbe && step.pointers.probeDirection === "left"
                  ? "border-yellow-400/80 bg-yellow-500/16 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.24)]"
                  : isProbe && step.pointers.probeDirection === "right"
                  ? "border-violet-400/80 bg-violet-500/16 text-violet-50 shadow-[0_0_30px_rgba(167,139,250,0.24)]"
                  : isCurrent
                  ? "border-cyan-400/80 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                  : isPerfect
                  ? "border-emerald-400/70 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.22)]"
                  : isResolved
                  ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.14)]"
                  : isSplit
                  ? "border-rose-400/60 bg-rose-500/10 text-rose-50 shadow-[0_0_22px_rgba(251,113,133,0.14)]"
                  : isLeft
                  ? "border-yellow-400/60 bg-yellow-500/10 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.14)]"
                  : isRight
                  ? "border-violet-400/60 bg-violet-500/10 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.14)]"
                  : isStack
                  ? "border-cyan-400/45 bg-cyan-500/8 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                  : isActiveSubtree
                  ? "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.5)]"
                  : "border-slate-800/80 bg-slate-950/55 text-slate-500 shadow-[0_0_18px_rgba(15,23,42,0.25)]";

                return (
                  <TreeNodeCard
                    key={node.id}
                    x={position.x}
                    y={position.y}
                    value={node.value}
                    toneClass={toneClass}
                    badges={badges}
                    countLabel={entry?.count ?? null}
                    dimmed={!isActiveSubtree && !isResolved}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <BoundaryStrip
          title="Left Boundary"
          ids={step.state.leftBoundaryIds}
          nodes={step.state.nodes}
          accent="yellow"
          heightLabel={`Height ${step.pointers.leftHeight ?? "-"}`}
          emptyLabel="The left boundary has not been measured yet."
          helperText="This is the path followed by the left-depth probe for the active subtree."
        />
        <BoundaryStrip
          title="Right Boundary"
          ids={step.state.rightBoundaryIds}
          nodes={step.state.nodes}
          accent="violet"
          heightLabel={`Height ${step.pointers.rightHeight ?? "-"}`}
          emptyLabel="The right boundary has not been measured yet."
          helperText="This is the path followed by the right-depth probe for the active subtree."
        />
      </div>

      <div className="mt-3">
        <CountLedgerTable
          title="Resolved Subtrees"
          entries={step.state.ledger}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.focusNodeId}
          emptyLabel="No subtree has been fully counted yet."
          helperText="Green rows are subtrees whose node counts are already known, either by the perfect-tree shortcut or by combining child counts."
        />
      </div>
    </section>
  );
}
