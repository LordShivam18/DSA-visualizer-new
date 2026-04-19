import PathGainStrip from "./PathGainStrip";
import ReturnGainTable from "./ReturnGainTable";
import TreeNodeCard from "./TreeNodeCard";
import type { MaxPathTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: MaxPathTraceStep) {
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

export default function MaximumPathSumWorkbench({
  step,
}: {
  step: MaxPathTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const currentPathSet = new Set(step.state.currentPathIds);
  const candidatePathSet = new Set(step.state.candidatePathIds);
  const bestPathSet = new Set(step.state.bestPathIds);
  const evaluatedSet = new Set(step.state.evaluatedIds);
  const negativeSet = new Set(step.state.negativeGainIds);

  const currentEdgeSet = new Set<string>();
  const candidateEdgeSet = new Set<string>();
  const bestEdgeSet = new Set<string>();

  for (let index = 1; index < step.state.currentPathIds.length; index += 1) {
    currentEdgeSet.add(
      edgeKey(step.state.currentPathIds[index - 1], step.state.currentPathIds[index])
    );
  }

  for (let index = 1; index < step.state.candidatePathIds.length; index += 1) {
    candidateEdgeSet.add(
      edgeKey(
        step.state.candidatePathIds[index - 1],
        step.state.candidatePathIds[index]
      )
    );
  }

  for (let index = 1; index < step.state.bestPathIds.length; index += 1) {
    bestEdgeSet.add(
      edgeKey(step.state.bestPathIds[index - 1], step.state.bestPathIds[index])
    );
  }

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Global Best vs Upward Gain
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Compute the strongest path anywhere in the tree
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Yellow shows the split-path candidate through the active node,
            green shows the best path found so far, and red highlights nodes
            whose upward gain is negative and gets pruned by a parent.
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
            Null Hits:{" "}
            <span className="font-mono text-violet-200">
              {step.state.nullHits}
            </span>
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Best So Far: {step.state.globalBest ?? "searching"}
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
            Through Sum
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.throughSum ?? "pending"}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Upward Gain
          </p>
          <p
            className={`mt-2 text-2xl font-semibold ${
              (step.pointers.upwardGain ?? 0) >= 0
                ? "text-emerald-200"
                : "text-rose-200"
            }`}
          >
            {step.pointers.upwardGain ?? "pending"}
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
          Cyan: active node
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: current recursion path
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: candidate path through active node
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: best path found so far
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: negative return gain
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
                    const isBest = bestEdgeSet.has(key);
                    const isCandidate = candidateEdgeSet.has(key);
                    const isCurrent = currentEdgeSet.has(key);
                    const stroke = isBest
                      ? "#34d399"
                      : isCandidate
                      ? "#facc15"
                      : isCurrent
                      ? "#a78bfa"
                      : "#334155";
                    const width = isBest ? 4 : isCandidate ? 3.4 : isCurrent ? 2.8 : 2;
                    const opacity = isBest ? 0.95 : isCandidate ? 0.95 : isCurrent ? 0.85 : 0.55;
                    const shadow = isBest
                      ? "drop-shadow-[0_0_10px_rgba(52,211,153,0.42)]"
                      : isCandidate
                      ? "drop-shadow-[0_0_10px_rgba(250,204,21,0.42)]"
                      : isCurrent
                      ? "drop-shadow-[0_0_8px_rgba(167,139,250,0.35)]"
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

            if (bestPathSet.has(node.id)) {
              badges.push({
                label: "BEST",
                className:
                  "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
              });
            }

            if (candidatePathSet.has(node.id) && !bestPathSet.has(node.id)) {
              badges.push({
                label: "CAND",
                className:
                  "border-yellow-400/70 bg-yellow-500/12 text-yellow-100",
              });
            }

            if (currentPathSet.has(node.id) && step.pointers.currentId !== node.id) {
              badges.push({
                label: "STACK",
                className:
                  "border-violet-400/70 bg-violet-500/12 text-violet-100",
              });
            }

            if (negativeSet.has(node.id)) {
              badges.push({
                label: "NEG",
                className:
                  "border-rose-400/70 bg-rose-500/12 text-rose-100",
              });
            }

            const toneClass =
              step.pointers.currentId === node.id
                ? "border-cyan-400/80 bg-cyan-500/14 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                : bestPathSet.has(node.id)
                ? "border-emerald-400/80 bg-emerald-500/14 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.24)]"
                : candidatePathSet.has(node.id)
                ? "border-yellow-400/80 bg-yellow-500/14 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.22)]"
                : negativeSet.has(node.id)
                ? "border-rose-400/80 bg-rose-500/14 text-rose-50 shadow-[0_0_30px_rgba(251,113,133,0.22)]"
                : currentPathSet.has(node.id)
                ? "border-violet-400/70 bg-violet-500/12 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.18)]"
                : evaluatedSet.has(node.id)
                ? "border-slate-600/80 bg-slate-900/80 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.5)]"
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
        <PathGainStrip
          title="Current Recursion Path"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="violet"
          emptyLabel="No active recursion path remains."
          helperText="This is the root-to-current stack path of the active DFS call."
        />
        <PathGainStrip
          title="Candidate Through Path"
          ids={step.state.candidatePathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="The current node has not formed a split-path candidate yet."
          helperText="This is the best complete path that uses the active node as its turning point."
        />
        <PathGainStrip
          title="Return Path"
          ids={step.state.returnPathIds}
          nodes={step.state.nodes}
          accent="cyan"
          emptyLabel="The active node has not produced an upward gain yet."
          helperText="Only one branch can be returned upward to the parent."
        />
        <PathGainStrip
          title="Global Best Path"
          ids={step.state.bestPathIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No best path has been recorded yet."
          helperText="This is the strongest path found anywhere in the tree so far."
        />
      </div>

      <div className="mt-3">
        <ReturnGainTable
          title="Returned Gains"
          values={step.state.returnedGains}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.focusNodeId}
          emptyLabel="No node has returned a gain yet."
          helperText="Each node returns only its best single-branch gain upward, not its full split-path sum."
        />
      </div>
    </section>
  );
}
