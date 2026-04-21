import ArrayWindowStrip from "./ArrayWindowStrip";
import BSTNodeCard from "./BSTNodeCard";
import {
  formatRange,
  type BSTBuildNode,
  type SortedArrayToBSTTraceStep,
} from "./generateTrace";

function orderFromPath(path: string) {
  let order = 0;

  for (const char of path) {
    order = order * 2 + (char === "R" ? 1 : 0);
  }

  return order;
}

function buildPositionMap(nodes: BSTBuildNode[]) {
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const canvasWidth = Math.max(820, deepestSlots * 180);
  const canvasHeight = Math.max(260, 220 + maxDepth * 150);
  const positions = new Map<string, { x: number; y: number }>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const order = orderFromPath(node.path);
    const x = ((order + 1) * canvasWidth) / (levelSlots + 1);
    const y = 96 + node.depth * 148;
    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

export default function SortedArrayToBSTWorkbench({
  step,
}: {
  step: SortedArrayToBSTTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step.state.nodes);
  const builtIndices = step.state.nodes.map((node) => node.index);
  const frameNodeIds = new Set(
    step.state.frames.map((frame) => frame.nodeId).filter(Boolean) as string[]
  );

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Balanced Recursive Construction
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Split around the midpoint and grow the BST outward
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the midpoint chosen for the current subtree, yellow shows
            the active array range, purple follows the active recursion path, and
            green nodes are fully finished subtrees.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Built Nodes: {step.state.builtCount}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
            Active Frames: {step.state.frames.length}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Height: {step.state.height}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Range
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatRange(step.pointers.activeRange)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Mid Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.midIndex ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.nodes.find((node) => node.id === step.pointers.focusNodeId)?.value ??
              "-"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Root Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.nodes.find((node) => node.id === step.state.rootId)?.value ?? "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: midpoint chosen now
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: current array slice
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: active recursion path
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: subtree finished
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <ArrayWindowStrip
          nums={step.state.nums}
          activeRange={step.pointers.activeRange}
          midIndex={step.pointers.midIndex}
          builtIndices={builtIndices}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_300px]">
          <div className="overflow-x-auto pb-2">
            <div
              className="relative rounded-[1.45rem] border border-slate-800/80 bg-[#050916] shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]"
              style={{ width: canvasWidth, height: canvasHeight }}
            >
              {step.state.nodes.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  The tree canvas is waiting for the first midpoint.
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
                          {[node.leftId, node.rightId].map((childId) => {
                            if (!childId) {
                              return null;
                            }

                            const target = positions.get(childId);
                            if (!target) {
                              return null;
                            }

                            const child = step.state.nodes.find(
                              (candidate) => candidate.id === childId
                            );
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
                                stroke={
                                  child?.completed
                                    ? "#34d399"
                                    : isActiveEdge
                                    ? "#22d3ee"
                                    : "#475569"
                                }
                                strokeWidth={isActiveEdge ? 3 : 2}
                                opacity={child?.completed ? 0.9 : 0.72}
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
                    const isParent = step.pointers.parentId === node.id && !isFocus;

                    const badges = [];
                    if (node.side !== "root") {
                      badges.push({
                        label: node.side.toUpperCase(),
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
                    } else if (isParent) {
                      badges.push({
                        label: "PARENT",
                        className:
                          "border-yellow-400/70 bg-yellow-500/12 text-yellow-100",
                      });
                    }
                    if (node.completed) {
                      badges.push({
                        label: "DONE",
                        className:
                          "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                      });
                    }

                    const toneClass = isFocus
                      ? "border-cyan-400/80 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.26)]"
                      : isOnPath
                      ? "border-violet-400/70 bg-violet-500/14 text-violet-50 shadow-[0_0_26px_rgba(167,139,250,0.22)]"
                      : node.completed
                      ? "border-emerald-400/70 bg-emerald-500/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.2)]"
                      : "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_20px_rgba(15,23,42,0.5)]";

                    return (
                      <BSTNodeCard
                        key={node.id}
                        x={position.x}
                        y={position.y}
                        value={node.value}
                        rangeLabel={`${node.rangeLeft}..${node.rangeRight}`}
                        badges={badges}
                        toneClass={toneClass}
                      />
                    );
                  })}
                </>
              )}
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
                    No active recursive calls right now.
                  </div>
                ) : (
                  step.state.frames
                    .slice()
                    .reverse()
                    .map((frame) => {
                      const node = step.state.nodes.find(
                        (candidate) => candidate.id === frame.nodeId
                      );
                      const isActive = frame.id === step.pointers.activeFrameId;

                      return (
                        <div
                          key={frame.id}
                          className={`rounded-xl border px-3 py-3 ${
                            isActive
                              ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                              : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">
                              {frame.side === "root"
                                ? "root call"
                                : `${frame.side} child`}
                            </span>
                            <span className="font-mono text-sm">
                              [{frame.left}, {frame.right}]
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-slate-400">
                            depth {frame.depth}
                            {node ? ` • node ${node.value}` : " • midpoint pending"}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Teaching Lens
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
                  1. Take the middle of the current range.
                </div>
                <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
                  2. Send the smaller half to the left subtree.
                </div>
                <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
                  3. Send the larger half to the right subtree.
                </div>
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
                  4. Return the finished subtree root.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
