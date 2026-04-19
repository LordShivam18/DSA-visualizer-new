import FlattenChainStrip from "./FlattenChainStrip";
import TreeNodeCard from "./TreeNodeCard";
import type { FlattenTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: FlattenTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const canvasWidth = Math.max(820, deepestSlots * 140);
  const canvasHeight = 220 + maxDepth * 160;
  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = ((node.order + 1) * canvasWidth) / (levelSlots + 1);
    const y = 108 + node.depth * 156;

    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function rightPath(source: Point, target: Point) {
  const midX = (source.x + target.x) / 2;
  const lift = 54 + Math.abs(target.x - source.x) * 0.12;
  const midY = Math.min(source.y, target.y) - lift;

  return `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
}

export default function FlattenWorkbench({ step }: { step: FlattenTraceStep }) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const nodesById = new Map(step.state.nodes.map((node) => [node.id, node]));
  const flattenedSet = new Set(step.state.flattenedIds);
  const scanTrailSet = new Set(step.pointers.scanTrailIds);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Rewire In Place
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Flatten the tree into one preorder right chain
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Dashed edges preserve the original tree shape for reference. Live
            left pointers glow cyan, live right pointers glow amber, and the
            green prefix marks nodes that are already fixed in their final
            preorder position.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Nodes:{" "}
            <span className="font-mono text-slate-50">
              {step.state.nodes.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Flattened:{" "}
            <span className="font-mono text-emerald-200">
              {step.state.flattenedIds.length}/{step.state.targetPreorderIds.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Live Right Spine:{" "}
            <span className="font-mono text-amber-200">
              {step.state.liveRightChainIds.length}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentId
              ? nodesById.get(step.pointers.currentId)?.value ?? "none"
              : "none"}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Left Head
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.leftHeadId
              ? nodesById.get(step.pointers.leftHeadId)?.value ?? "none"
              : "none"}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Predecessor
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.predecessorId
              ? nodesById.get(step.pointers.predecessorId)?.value ?? "none"
              : "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active left pointer / current node
        </span>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]">
          Amber: live right chain / predecessor
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: flattened prefix
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: left subtree head
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: predecessor scan trail
        </span>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="relative mx-auto rounded-[1.6rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          >
            <defs>
              <marker
                id="flatten-left-arrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10Z" fill="#22d3ee" />
              </marker>
              <marker
                id="flatten-right-arrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10Z" fill="#fbbf24" />
              </marker>
            </defs>

            {step.state.nodes.map((node) => {
              const source = positions.get(node.id);
              const originalLeft = node.originalLeftId
                ? positions.get(node.originalLeftId)
                : null;
              const originalRight = node.originalRightId
                ? positions.get(node.originalRightId)
                : null;

              if (!source) {
                return null;
              }

              return (
                <g key={`ghost-${node.id}`}>
                  {originalLeft ? (
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={originalLeft.x}
                      y2={originalLeft.y}
                      stroke="#334155"
                      strokeWidth="1.6"
                      strokeDasharray="6 7"
                      opacity="0.5"
                    />
                  ) : null}
                  {originalRight ? (
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={originalRight.x}
                      y2={originalRight.y}
                      stroke="#334155"
                      strokeWidth="1.6"
                      strokeDasharray="6 7"
                      opacity="0.5"
                    />
                  ) : null}
                </g>
              );
            })}

            {step.state.nodes.map((node) => {
              if (!node.leftId) {
                return null;
              }

              const source = positions.get(node.id);
              const target = positions.get(node.leftId);

              if (!source || !target) {
                return null;
              }

              return (
                <line
                  key={`left-${node.id}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#22d3ee"
                  strokeWidth="2.7"
                  markerEnd="url(#flatten-left-arrow)"
                  opacity="0.94"
                  className="drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]"
                />
              );
            })}

            {step.state.nodes.map((node) => {
              if (!node.rightId) {
                return null;
              }

              const source = positions.get(node.id);
              const target = positions.get(node.rightId);

              if (!source || !target) {
                return null;
              }

              return (
                <path
                  key={`right-${node.id}`}
                  d={rightPath(source, target)}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  markerEnd="url(#flatten-right-arrow)"
                  opacity="0.96"
                  className="drop-shadow-[0_0_12px_rgba(251,191,36,0.42)]"
                />
              );
            })}
          </svg>

          {step.state.nodes.map((node) => {
            const position = positions.get(node.id);

            if (!position) {
              return null;
            }

            const badges: Array<{ label: string; className: string }> = [];

            if (step.pointers.currentId === node.id) {
              badges.push({
                label: "CURR",
                className:
                  "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
              });
            }

            if (step.pointers.leftHeadId === node.id) {
              badges.push({
                label: "LEFT",
                className:
                  "border-violet-400/70 bg-violet-500/12 text-violet-100",
              });
            }

            if (step.pointers.predecessorId === node.id) {
              badges.push({
                label: "PRED",
                className:
                  "border-amber-400/70 bg-amber-500/12 text-amber-100",
              });
            }

            if (
              flattenedSet.has(node.id) &&
              step.pointers.currentId !== node.id
            ) {
              badges.push({
                label: "FLAT",
                className:
                  "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
              });
            }

            const toneClass =
              step.pointers.currentId === node.id
                ? "border-cyan-400/80 bg-cyan-500/14 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.26)]"
                : step.pointers.predecessorId === node.id
                ? "border-amber-400/80 bg-amber-500/14 text-amber-50 shadow-[0_0_30px_rgba(251,191,36,0.24)]"
                : step.pointers.leftHeadId === node.id
                ? "border-violet-400/80 bg-violet-500/14 text-violet-50 shadow-[0_0_30px_rgba(167,139,250,0.22)]"
                : flattenedSet.has(node.id)
                ? "border-emerald-400/70 bg-emerald-500/12 text-emerald-50 shadow-[0_0_28px_rgba(52,211,153,0.18)]"
                : scanTrailSet.has(node.id)
                ? "border-amber-400/55 bg-amber-500/10 text-amber-50 shadow-[0_0_22px_rgba(251,191,36,0.12)]"
                : "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.5)]";

            const leftValue = node.leftId
              ? String(nodesById.get(node.leftId)?.value ?? "?")
              : "-";
            const rightValue = node.rightId
              ? String(nodesById.get(node.rightId)?.value ?? "?")
              : "-";

            return (
              <TreeNodeCard
                key={node.id}
                x={position.x}
                y={position.y}
                value={node.value}
                leftValue={leftValue}
                rightValue={rightValue}
                toneClass={toneClass}
                badges={badges}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <FlattenChainStrip
          title="Target Preorder"
          ids={step.state.targetPreorderIds}
          nodes={step.state.nodes}
          accent="violet"
          emptyLabel="The input tree is empty."
          helperText="This is the exact node order the final linked list must follow."
        />
        <FlattenChainStrip
          title="Live Right Spine"
          ids={step.state.liveRightChainIds}
          nodes={step.state.nodes}
          accent="amber"
          emptyLabel="No right chain exists yet."
          helperText="Follow only right pointers from the root to see the current in-place list backbone."
        />
        <FlattenChainStrip
          title="Flattened Prefix"
          ids={step.state.flattenedIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No node has joined the final chain yet."
          helperText="Everything here is already fixed in final preorder order."
        />
        <FlattenChainStrip
          title="Remaining Nodes"
          ids={step.state.remainingIds}
          nodes={step.state.nodes}
          accent="cyan"
          emptyLabel="No nodes remain. The flatten is complete."
          helperText="These nodes still need to be visited by current."
        />
      </div>
    </section>
  );
}
