import PathExpressionStrip from "./PathExpressionStrip";
import TreeNodeCard from "./TreeNodeCard";
import type { PathSumTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: PathSumTraceStep) {
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

function edgeKey(parentId: string, childId: string) {
  return `${parentId}-${childId}`;
}

export default function PathSumWorkbench({ step }: { step: PathSumTraceStep }) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const currentPathSet = new Set(step.state.currentPathIds);
  const successPathSet = new Set(step.state.successPathIds);
  const exploredSet = new Set(step.state.exploredIds);
  const failedLeafSet = new Set(step.state.deadEndLeafIds);
  const checkedLeafSet = new Set(step.state.checkedLeafIds);
  const currentPathEdges = new Set<string>();
  const successPathEdges = new Set<string>();

  for (let index = 1; index < step.state.currentPathIds.length; index += 1) {
    currentPathEdges.add(
      edgeKey(step.state.currentPathIds[index - 1], step.state.currentPathIds[index])
    );
  }

  for (let index = 1; index < step.state.successPathIds.length; index += 1) {
    successPathEdges.add(
      edgeKey(step.state.successPathIds[index - 1], step.state.successPathIds[index])
    );
  }

  const resultTone =
    step.state.result === null
      ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
      : step.state.result
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      : "border-rose-400/30 bg-rose-500/10 text-rose-100";

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Recursive DFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Search root-to-leaf paths for the target sum
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan tracks the current call, yellow marks the active path, green
            locks in a successful path, and red marks dead-end leaves that miss
            the target.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Target:{" "}
            <span className="font-mono text-amber-200">
              {step.state.targetSum}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Visited:{" "}
            <span className="font-mono text-cyan-200">
              {step.state.visitedCount}/{step.state.nodes.length}
            </span>
          </span>
          <span className={`rounded-full border px-3 py-1 ${resultTone}`}>
            Result: {step.state.result === null ? "searching" : step.state.result ? "true" : "false"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentId
              ? step.state.nodes.find((node) => node.id === step.pointers.currentId)?.value ?? "none"
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Running Sum
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.currentSum}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Remaining
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.remainingTarget ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Call Depth
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.callDepth}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active recursive call
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: current root-to-current path
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: successful target path
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: failed leaf
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: explored node
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
                    const isSuccessEdge = successPathEdges.has(key);
                    const isCurrentEdge = currentPathEdges.has(key);
                    const stroke = isSuccessEdge
                      ? "#34d399"
                      : isCurrentEdge
                      ? "#facc15"
                      : "#334155";
                    const width = isSuccessEdge ? 4 : isCurrentEdge ? 3.2 : 2;
                    const opacity = isSuccessEdge ? 0.96 : isCurrentEdge ? 0.95 : 0.55;
                    const shadow = isSuccessEdge
                      ? "drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                      : isCurrentEdge
                      ? "drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]"
                      : "";

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
                        className={shadow}
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

            const badges: Array<{ label: string; className: string }> = [];

            if (step.pointers.currentId === node.id) {
              badges.push({
                label: "CURR",
                className:
                  "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
              });
            }

            if (currentPathSet.has(node.id) && step.pointers.currentId !== node.id) {
              badges.push({
                label: "PATH",
                className:
                  "border-yellow-400/70 bg-yellow-500/12 text-yellow-100",
              });
            }

            if (successPathSet.has(node.id)) {
              badges.push({
                label: "GOOD",
                className:
                  "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
              });
            }

            if (failedLeafSet.has(node.id)) {
              badges.push({
                label: "FAIL",
                className:
                  "border-rose-400/70 bg-rose-500/12 text-rose-100",
              });
            }

            if (node.isLeaf && checkedLeafSet.has(node.id) && !failedLeafSet.has(node.id) && !successPathSet.has(node.id)) {
              badges.push({
                label: "LEAF",
                className:
                  "border-violet-400/70 bg-violet-500/12 text-violet-100",
              });
            }

            const toneClass =
              step.pointers.currentId === node.id
                ? "border-cyan-400/80 bg-cyan-500/14 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                : successPathSet.has(node.id)
                ? "border-emerald-400/80 bg-emerald-500/14 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.24)]"
                : failedLeafSet.has(node.id)
                ? "border-rose-400/80 bg-rose-500/14 text-rose-50 shadow-[0_0_30px_rgba(251,113,133,0.22)]"
                : currentPathSet.has(node.id)
                ? "border-yellow-400/80 bg-yellow-500/14 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.22)]"
                : exploredSet.has(node.id)
                ? "border-violet-400/55 bg-violet-500/10 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.12)]"
                : "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.5)]";

            return (
              <TreeNodeCard
                key={node.id}
                x={position.x}
                y={position.y}
                value={node.value}
                toneClass={toneClass}
                badges={badges}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <PathExpressionStrip
          title="Current Path"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="No active DFS path is on the stack."
          helperText="This is the live root-to-current path for the active recursive call."
        />
        <PathExpressionStrip
          title="Successful Path"
          ids={step.state.successPathIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No successful root-to-leaf path has been found yet."
          helperText="If a valid path exists, it will lock in here and remain green."
        />
        <PathExpressionStrip
          title="Visited Order"
          ids={step.state.visitOrderIds}
          nodes={step.state.nodes}
          accent="violet"
          emptyLabel="No node has been visited yet."
          helperText="DFS visitation order shows how the recursion walked through the tree."
          showSum={false}
        />
        <PathExpressionStrip
          title="Failed Leaves"
          ids={step.state.deadEndLeafIds}
          nodes={step.state.nodes}
          accent="red"
          emptyLabel="No failed leaf checks yet."
          helperText="These leaves were reached, but their full path sums did not hit the target."
          showSum={false}
        />
      </div>
    </section>
  );
}
