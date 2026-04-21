import PathStrip from "./PathStrip";
import ReturnLedgerTable from "./ReturnLedgerTable";
import TreeNodeCard from "./TreeNodeCard";
import type { LcaTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: LcaTraceStep) {
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

function labelOf(step: LcaTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function LowestCommonAncestorWorkbench({
  step,
}: {
  step: LcaTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const activeSubtreeSet = new Set(step.state.activeSubtreeIds);
  const pPathSet = new Set(step.state.pPathIds);
  const qPathSet = new Set(step.state.qPathIds);
  const sharedPathSet = new Set(step.state.sharedPathIds);
  const visitedSet = new Set(step.state.visitedIds);
  const resolvedSet = new Set(step.state.resolvedIds);
  const matchedTargetSet = new Set(step.state.matchedTargetIds);
  const currentEdgeSet = edgeSetFromPath(step.state.currentPathIds);
  const pEdgeSet = edgeSetFromPath(step.state.pPathIds);
  const qEdgeSet = edgeSetFromPath(step.state.qPathIds);
  const sharedEdgeSet = edgeSetFromPath(step.state.sharedPathIds);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Recursive Return Merge
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Bubble target hits upward until they meet
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Yellow shows the reference path to target p, purple shows the path
            to target q, cyan shows the live recursion path, and green marks the
            ancestor candidate that is currently being returned.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Visited{" "}
            <span className="font-mono text-cyan-200">
              {step.state.visitedCount}/{step.state.nodes.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Null Hits{" "}
            <span className="font-mono text-violet-200">
              {step.state.nullHits}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Matched Targets {step.state.matchedTargetIds.length}/2
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
            Left Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {labelOf(step, step.pointers.leftReturnId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Right Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.rightReturnId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Latest Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {labelOf(step, step.pointers.latestReturnId)}
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
          Cyan: active recursion path
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: target p path
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: target q path
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: shared ancestor chain and current answer
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {step.state.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Empty tree. No LCA exists.
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
                        const isCurrentEdge = currentEdgeSet.has(key);
                        const isSharedEdge = sharedEdgeSet.has(key);
                        const isPEdge = pEdgeSet.has(key);
                        const isQEdge = qEdgeSet.has(key);
                        const isResolvedEdge =
                          resolvedSet.has(node.id) && resolvedSet.has(childId);

                        const stroke = isCurrentEdge
                          ? "#22d3ee"
                          : isSharedEdge
                          ? "#34d399"
                          : isPEdge
                          ? "#facc15"
                          : isQEdge
                          ? "#a78bfa"
                          : isResolvedEdge
                          ? "#475569"
                          : "#334155";

                        const width = isCurrentEdge
                          ? 3.4
                          : isSharedEdge
                          ? 3.3
                          : isPEdge || isQEdge
                          ? 3
                          : isResolvedEdge
                          ? 2.4
                          : 2;

                        const opacity = isCurrentEdge || isSharedEdge || isPEdge || isQEdge
                          ? 0.95
                          : isResolvedEdge
                          ? 0.8
                          : 0.55;

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

                const isCurrent = step.pointers.currentId === node.id;
                const isP = step.state.pId === node.id;
                const isQ = step.state.qId === node.id;
                const isShared = sharedPathSet.has(node.id);
                const isVisited = visitedSet.has(node.id);
                const isResolved = resolvedSet.has(node.id);
                const isMatched = matchedTargetSet.has(node.id);
                const isResult = step.state.resultId === node.id;
                const isFocus = step.pointers.focusNodeId === node.id;
                const isActiveSubtree =
                  activeSubtreeSet.size === 0 || activeSubtreeSet.has(node.id);
                const isReferenceNode = pPathSet.has(node.id) || qPathSet.has(node.id);
                const badges: Array<{ label: string; className: string }> = [];

                if (isP) {
                  badges.push({
                    label: "P",
                    className: "border-yellow-400/70 bg-yellow-500/12 text-yellow-100",
                  });
                }

                if (isQ) {
                  badges.push({
                    label: "Q",
                    className: "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                if (isCurrent) {
                  badges.push({
                    label: "CURR",
                    className: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
                  });
                }

                if (isMatched && !isCurrent) {
                  badges.push({
                    label: "SEEN",
                    className: "border-cyan-400/40 bg-cyan-500/8 text-cyan-100",
                  });
                }

                if (isResult || (isFocus && step.actionKind === "found-lca")) {
                  badges.push({
                    label: "LCA",
                    className: "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                } else if (
                  isFocus &&
                  ["match-p", "match-q", "bubble-left", "bubble-right"].includes(
                    step.actionKind
                  )
                ) {
                  badges.push({
                    label: "RET",
                    className: "border-emerald-400/55 bg-emerald-500/10 text-emerald-100",
                  });
                }

                const toneClass = isResult || (isFocus && step.actionKind === "found-lca")
                  ? "border-emerald-400/80 bg-emerald-500/16 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.28)]"
                  : isFocus &&
                    ["match-p", "match-q", "bubble-left", "bubble-right"].includes(
                      step.actionKind
                    )
                  ? "border-emerald-400/70 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.22)]"
                  : isCurrent
                  ? "border-cyan-400/80 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                  : isP
                  ? "border-yellow-400/80 bg-yellow-500/14 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.24)]"
                  : isQ
                  ? "border-violet-400/80 bg-violet-500/14 text-violet-50 shadow-[0_0_30px_rgba(167,139,250,0.24)]"
                  : isShared
                  ? "border-emerald-400/55 bg-emerald-500/10 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.14)]"
                  : isResolved
                  ? "border-slate-600/80 bg-slate-900/80 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.45)]"
                  : isVisited
                  ? "border-cyan-400/35 bg-cyan-500/8 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.1)]"
                  : isActiveSubtree
                  ? "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.5)]"
                  : "border-slate-800/80 bg-slate-950/55 text-slate-500 shadow-[0_0_18px_rgba(15,23,42,0.25)]";

                const footerLabel = isResult
                  ? "LCA"
                  : isFocus &&
                    ["match-p", "match-q", "bubble-left", "bubble-right"].includes(
                      step.actionKind
                    )
                  ? "Return"
                  : null;

                const footerClassName = isResult
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.18)]"
                  : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]";

                return (
                  <TreeNodeCard
                    key={node.id}
                    x={position.x}
                    y={position.y}
                    value={node.value}
                    toneClass={toneClass}
                    badges={badges}
                    footerLabel={footerLabel}
                    footerClassName={footerClassName}
                    dimmed={!isActiveSubtree && !isReferenceNode && !isVisited && !isResult}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <PathStrip
          title="Current Recursion Path"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="cyan"
          badgeLabel={`Depth ${step.pointers.callDepth}`}
          emptyLabel="No recursive path is active."
          helperText="This is the live call stack path from the root down to the current node."
        />
        <PathStrip
          title="Path to Target P"
          ids={step.state.pPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          badgeLabel={`p = ${step.state.targetPValue ?? "?"}`}
          emptyLabel="Target p is not present in this tree."
          helperText="This reference path shows where target p lives in the input tree."
        />
        <PathStrip
          title="Path to Target Q"
          ids={step.state.qPathIds}
          nodes={step.state.nodes}
          accent="violet"
          badgeLabel={`q = ${step.state.targetQValue ?? "?"}`}
          emptyLabel="Target q is not present in this tree."
          helperText="This reference path shows where target q lives in the input tree."
        />
        <PathStrip
          title="Shared Ancestor Chain"
          ids={step.state.sharedPathIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="The targets do not share a valid chain in this input."
          helperText="The final LCA is the last node in the common prefix of the two target paths."
        />
      </div>

      <div className="mt-3">
        <ReturnLedgerTable
          title="Return Ledger"
          entries={step.state.ledger}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.currentId}
          emptyLabel="No subtree has returned a result yet."
          helperText="Each row records what one completed recursive call sent back to its parent."
        />
      </div>
    </section>
  );
}
