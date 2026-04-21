import QuadGrid from "./QuadGrid";
import QuadTreeNodeCard from "./QuadTreeNodeCard";
import { formatRegion, type QuadTreeNodeRecord, type QuadTreeTraceStep } from "./generateTrace";

function buildPositionMap(nodes: QuadTreeNodeRecord[]) {
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const canvasWidth = 1140;
  const canvasHeight = Math.max(280, 220 + maxDepth * 168);
  const positions = new Map<string, { x: number; y: number }>();

  nodes.forEach((node) => {
    let xRatio = 0.5;
    let spread = 0.22;
    for (const char of node.path) {
      const offset =
        char === "0" ? -1.5 : char === "1" ? -0.5 : char === "2" ? 0.5 : 1.5;
      xRatio += offset * spread;
      spread *= 0.48;
    }

    positions.set(node.id, {
      x: canvasWidth * xRatio,
      y: 92 + node.depth * 164,
    });
  });

  return { positions, canvasWidth, canvasHeight };
}

export default function ConstructQuadTreeWorkbench({
  step,
}: {
  step: QuadTreeTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step.state.nodes);
  const frameNodeIds = new Set(
    step.state.frames.map((frame) => frame.nodeId).filter(Boolean) as string[]
  );

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Quad-Tree Compression
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Uniform regions collapse into leaves, mixed regions split into four
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the current region, yellow previews the child quadrant
            about to recurse, purple follows the active path in the tree, and
            green leaf nodes show fully compressed uniform areas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Frames: {step.state.frames.length}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Leaves: {step.state.leafCount}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
            Internal: {step.state.internalCount}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Region
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-200">
            {formatRegion(step.pointers.activeRegion)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Child Preview
          </p>
          <p className="mt-2 text-lg font-semibold text-yellow-200">
            {step.pointers.childQuadrant ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Uniform Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.uniformValue ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Root Node
          </p>
          <p className="mt-2 text-lg font-semibold text-violet-200">
            {step.state.rootId ? "[0, 1]" : "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active region
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: next quadrant
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Violet: active recursion path
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: uniform leaf
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_300px]">
        <div className="space-y-4">
          <QuadGrid
            grid={step.state.grid}
            activeRegion={step.pointers.activeRegion}
            childRegion={step.pointers.childRegion}
          />

          <div className="overflow-x-auto pb-2">
            <div
              className="relative rounded-[1.45rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]"
              style={{ width: canvasWidth, height: canvasHeight }}
            >
              {step.state.nodes.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  The quad-tree canvas is waiting for the first valid region.
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
                        <g key={`edge-${node.id}`}>
                          {[
                            node.topLeftId,
                            node.topRightId,
                            node.bottomLeftId,
                            node.bottomRightId,
                          ].map((childId) => {
                            if (!childId) {
                              return null;
                            }

                            const target = positions.get(childId);
                            if (!target) {
                              return null;
                            }

                            const isActiveEdge =
                              step.pointers.focusNodeId === node.id ||
                              step.pointers.focusNodeId === childId;

                            return (
                              <line
                                key={`${node.id}-${childId}`}
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                stroke={isActiveEdge ? "#22d3ee" : "#475569"}
                                strokeWidth={isActiveEdge ? 3 : 2}
                                opacity={0.8}
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

                    const isFocus = step.pointers.focusNodeId === node.id;
                    const isOnPath = frameNodeIds.has(node.id) && !isFocus;
                    const isLeaf = node.isLeaf;
                    const badges = [];

                    if (node.quadrant !== "root") {
                      badges.push({
                        label: node.quadrant,
                        className:
                          "border-slate-700/70 bg-slate-950/70 text-slate-200",
                      });
                    }
                    if (isFocus) {
                      badges.push({
                        label: "CUR",
                        className:
                          "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
                      });
                    } else if (isOnPath) {
                      badges.push({
                        label: "PATH",
                        className:
                          "border-violet-400/70 bg-violet-500/12 text-violet-100",
                      });
                    }
                    if (isLeaf) {
                      badges.push({
                        label: "LEAF",
                        className:
                          "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                      });
                    }

                    const toneClass = isFocus
                      ? "border-cyan-400/80 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.26)]"
                      : isOnPath
                      ? "border-violet-400/70 bg-violet-500/14 text-violet-50 shadow-[0_0_26px_rgba(167,139,250,0.22)]"
                      : isLeaf
                      ? "border-emerald-400/70 bg-emerald-500/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.2)]"
                      : "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_20px_rgba(15,23,42,0.5)]";

                    return (
                      <QuadTreeNodeCard
                        key={node.id}
                        x={position.x}
                        y={position.y}
                        title={`${node.row},${node.col} • ${node.size}`}
                        valueLabel={`[${node.isLeaf ? 1 : 0}, ${node.val ? 1 : 0}]`}
                        toneClass={toneClass}
                        badges={badges}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Recursion Stack
            </p>
            <div className="mt-4 space-y-2">
              {step.state.frames.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                  No active regions right now.
                </div>
              ) : (
                step.state.frames
                  .slice()
                  .reverse()
                  .map((frame) => (
                    <div
                      key={frame.id}
                      className={`rounded-xl border px-3 py-3 ${
                        frame.id === step.pointers.activeFrameId
                          ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                          : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{frame.quadrant}</span>
                        <span className="font-mono text-sm">
                          ({frame.row}, {frame.col}) / {frame.size}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        depth {frame.depth}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Quad Rule
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
                Uniform region → one leaf node.
              </div>
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
                Mixed region → one internal node.
              </div>
              <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
                Split into four equal quadrants.
              </div>
              <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
                Recurse in TL, TR, BL, BR order.
              </div>
            </div>
          </div>

          {step.state.note ? (
            <div className="rounded-[1.2rem] border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              {step.state.note}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
