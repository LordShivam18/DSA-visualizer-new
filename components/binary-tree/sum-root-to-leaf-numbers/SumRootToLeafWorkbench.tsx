import CompletedPathsTable from "./CompletedPathsTable";
import PathNumberStrip from "./PathNumberStrip";
import TreeNodeCard from "./TreeNodeCard";
import type { SumRootTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: SumRootTraceStep) {
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

export default function SumRootToLeafWorkbench({
  step,
}: {
  step: SumRootTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const currentPathSet = new Set(step.state.currentPathIds);
  const exploredSet = new Set(step.state.exploredIds);
  const checkedLeafSet = new Set(step.state.checkedLeafIds);
  const completedPathSet = new Set<string>();
  const completedEdgeSet = new Set<string>();
  const currentEdgeSet = new Set<string>();

  step.state.completedPaths.forEach((path) => {
    path.ids.forEach((id) => completedPathSet.add(id));
    for (let index = 1; index < path.ids.length; index += 1) {
      completedEdgeSet.add(edgeKey(path.ids[index - 1], path.ids[index]));
    }
  });

  for (let index = 1; index < step.state.currentPathIds.length; index += 1) {
    currentEdgeSet.add(
      edgeKey(step.state.currentPathIds[index - 1], step.state.currentPathIds[index])
    );
  }

  const latestCompletedPath =
    step.state.completedPaths[step.state.completedPaths.length - 1]?.ids ?? [];

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Decimal DFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Build each root-to-leaf number and add them together
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the active call, yellow marks the live digit path, and
            green shows paths that have already contributed completed numbers to
            the total sum.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Visited:{" "}
            <span className="font-mono text-cyan-200">
              {step.state.visitedCount}/{step.state.nodes.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Completed Paths:{" "}
            <span className="font-mono text-emerald-200">
              {step.state.completedPaths.length}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Total So Far: {step.state.totalSumSoFar}
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
            Current Number
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.currentNumber}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Latest Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
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
          Cyan: active recursive call
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: current digit path
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: completed contributing path
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
                    const isCurrentEdge = currentEdgeSet.has(key);
                    const isCompletedEdge = completedEdgeSet.has(key);
                    const stroke = isCurrentEdge
                      ? "#facc15"
                      : isCompletedEdge
                      ? "#34d399"
                      : "#334155";
                    const width = isCurrentEdge ? 3.4 : isCompletedEdge ? 3 : 2;
                    const opacity = isCurrentEdge ? 0.96 : isCompletedEdge ? 0.9 : 0.55;
                    const shadow = isCurrentEdge
                      ? "drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]"
                      : isCompletedEdge
                      ? "drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]"
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

            if (node.isLeaf && checkedLeafSet.has(node.id)) {
              badges.push({
                label: "LEAF",
                className:
                  "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
              });
            } else if (completedPathSet.has(node.id)) {
              badges.push({
                label: "SUM",
                className:
                  "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
              });
            }

            const toneClass =
              step.pointers.currentId === node.id
                ? "border-cyan-400/80 bg-cyan-500/14 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                : checkedLeafSet.has(node.id)
                ? "border-emerald-400/80 bg-emerald-500/14 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.24)]"
                : currentPathSet.has(node.id)
                ? "border-yellow-400/80 bg-yellow-500/14 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.22)]"
                : completedPathSet.has(node.id)
                ? "border-emerald-400/55 bg-emerald-500/10 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.12)]"
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
        <PathNumberStrip
          title="Current Path"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="No active DFS path is on the stack."
          helperText="This is the live root-to-current digit path for the active recursive call."
        />
        <PathNumberStrip
          title="Latest Completed Path"
          ids={latestCompletedPath}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No completed root-to-leaf number has been produced yet."
          helperText="Whenever DFS reaches a leaf, that full digit path turns into one finished number."
        />
      </div>

      <div className="mt-3">
        <CompletedPathsTable
          title="Completed Numbers"
          paths={step.state.completedPaths}
          nodes={step.state.nodes}
          total={step.state.totalSumSoFar}
          highlightLeafId={step.pointers.focusLeafId}
          emptyLabel="No root-to-leaf numbers have been added yet."
          helperText="Each row is one finished root-to-leaf number that has already contributed to the running total."
        />
      </div>
    </section>
  );
}
