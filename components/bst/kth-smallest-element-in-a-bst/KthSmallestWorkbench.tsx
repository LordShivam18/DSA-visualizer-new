import RankStrip from "./RankStrip";
import StackStrip from "./StackStrip";
import TreeNodeCard from "./TreeNodeCard";
import { formatResult, type KthTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: KthTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const treeWidth = Math.max(760, deepestSlots * 138);
  const canvasWidth = treeWidth + 120;
  const canvasHeight = Math.max(280, 220 + maxDepth * 158);
  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = 60 + ((node.order + 1) * treeWidth) / (levelSlots + 1);
    const y = 110 + node.depth * 154;
    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function labelOf(step: KthTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function KthSmallestWorkbench({ step }: { step: KthTraceStep }) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const stackSet = new Set(step.state.stackIds);
  const visitedSet = new Set(step.state.visitedIds);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            BST Sorted Rank
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Stop when inorder rank reaches k
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the active node, amber marks the stack frontier, violet
            marks the traversal cursor, yellow marks the current rank target,
            and green marks the kth value once found.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            k <span className="font-mono text-cyan-200">{step.state.k}</span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Count{" "}
            <span className="font-mono text-yellow-200">
              {step.state.count}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Result {formatResult(step.state.resultValue)}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.focusId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Cursor
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.cursorId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Stack Top
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {labelOf(step, step.pointers.stackTopId)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            kth Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatResult(step.state.resultValue)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {step.state.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Empty BST. No kth value exists.
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

                        const activeEdge =
                          childId === step.pointers.cursorId ||
                          childId === step.pointers.rightTargetId;

                        return (
                          <line
                            key={`${node.id}-${childId}`}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={activeEdge ? "#22d3ee" : "#334155"}
                            strokeWidth={activeEdge ? 3 : 2}
                            opacity={activeEdge ? 0.9 : 0.58}
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

                const isFocus = step.pointers.focusId === node.id;
                const isCursor = step.pointers.cursorId === node.id;
                const isFound = step.pointers.foundId === node.id;
                const isVisited = visitedSet.has(node.id);
                const isStacked = stackSet.has(node.id);

                const badges: Array<{ label: string; className: string }> = [];

                if (isFound) {
                  badges.push({
                    label: "KTH",
                    className:
                      "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                }
                if (isFocus && !isFound) {
                  badges.push({
                    label: "FOCUS",
                    className: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
                  });
                }
                if (isCursor && !isFocus) {
                  badges.push({
                    label: "CURSOR",
                    className:
                      "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                const toneClass = isFound
                  ? "border-emerald-400/85 bg-emerald-500/18 text-emerald-50 shadow-[0_0_32px_rgba(52,211,153,0.28)]"
                  : isFocus
                  ? "border-cyan-400/80 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.26)]"
                  : isCursor
                  ? "border-violet-400/70 bg-violet-500/12 text-violet-50 shadow-[0_0_26px_rgba(167,139,250,0.18)]"
                  : isStacked
                  ? "border-amber-400/55 bg-amber-500/10 text-amber-50 shadow-[0_0_22px_rgba(251,191,36,0.12)]"
                  : isVisited
                  ? "border-cyan-400/45 bg-cyan-500/8 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
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
                      isFound
                        ? "answer"
                        : isStacked
                        ? "stack"
                        : isVisited
                        ? "counted"
                        : isCursor
                        ? "cursor"
                        : null
                    }
                    dimmed={!isFocus && !isStacked && !isVisited && !isFound}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <StackStrip
          title="Traversal Stack"
          ids={step.state.stackIds}
          nodes={step.state.nodes}
          highlightId={step.pointers.stackTopId}
          reverse
          emptyLabel="The stack is empty."
          helperText="Saved ancestors waiting for their sorted rank."
        />
        <RankStrip
          ids={step.state.visitedIds}
          nodes={step.state.nodes}
          k={step.state.k}
          foundId={step.pointers.foundId}
        />
      </div>
    </section>
  );
}
