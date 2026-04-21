import CloneQueue from "./CloneQueue";
import GraphEdge from "./GraphEdge";
import GraphNodeCard from "./GraphNodeCard";
import type {
  CloneGraphTraceStep,
  EdgeFocus,
  GraphNodeRecord,
} from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(count: number, width: number, height: number) {
  const map = new Map<number, Point>();

  if (count === 0) {
    return map;
  }

  if (count === 1) {
    map.set(1, { x: width / 2, y: height / 2 });
    return map;
  }

  const radius = Math.min(width, height) / 2 - 60;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let index = 0; index < count; index += 1) {
    const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / count;
    map.set(index + 1, {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  return map;
}

function buildEdgeList(nodes: GraphNodeRecord[]) {
  const seen = new Set<string>();
  const edges: EdgeFocus[] = [];

  nodes.forEach((node) => {
    node.neighbors.forEach((neighbor) => {
      const a = Math.min(node.value, neighbor);
      const b = Math.max(node.value, neighbor);
      const key = `${a}-${b}`;

      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ from: a, to: b });
      }
    });
  });

  return edges;
}

function edgeMatches(edge: EdgeFocus, focus: EdgeFocus | null) {
  if (!focus) {
    return false;
  }

  return (
    (edge.from === focus.from && edge.to === focus.to) ||
    (edge.from === focus.to && edge.to === focus.from)
  );
}

export default function CloneGraphWorkbench({
  step,
}: {
  step: CloneGraphTraceStep;
}) {
  const totalNodes = step.state.originalNodes.length;
  const positions = buildPositionMap(totalNodes, 360, 290);
  const originalEdges = buildEdgeList(step.state.originalNodes);
  const cloneEdges = buildEdgeList(step.state.cloneNodes);
  const cloneNodeSet = new Set(step.state.cloneNodes.map((node) => node.value));
  const discoveredSet = new Set(step.state.discoveredOriginalIds);
  const processedSet = new Set(step.state.processedOriginalIds);

  const cloneNeighborSet = new Set<number>();
  if (step.pointers.neighborOriginal !== null && cloneNodeSet.has(step.pointers.neighborOriginal)) {
    cloneNeighborSet.add(step.pointers.neighborOriginal);
  }

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Graph BFS + Hash Map
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Mirror every original node and edge without reusing original references
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The left graph is the original input. The right graph grows clone
            nodes and edges as BFS walks the original and the map prevents duplicate allocations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Cloned Nodes: {step.state.clonedCount}/{step.state.originalNodes.length}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Queue: {step.state.queue.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Processed: {step.state.processedOriginalIds.length}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4 md:col-span-1">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Original
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentOriginal ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4 md:col-span-1">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Clone
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentClone !== null
              ? `${step.pointers.currentClone}'`
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4 md:col-span-1">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.neighborOriginal ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4 md:col-span-1">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.queueFront ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4 md:col-span-1">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Latest Clone
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.latestCloned !== null
              ? `${step.pointers.latestCloned}'`
              : "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active expansion
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: neighbor under inspection
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: freshly created clone
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: discovered but not active
        </span>
      </div>

      {totalNodes === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          Enter an adjacency list to see the original and cloned graphs.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {[
            {
              title: "Original Graph",
              subtitle:
                "These nodes never change. BFS only reads their neighbor lists.",
              nodes: step.state.originalNodes,
              edges: originalEdges,
              renderNode: (value: number) => {
                const badges: string[] = [];
                let toneClass =
                  "border-slate-700/80 bg-slate-900/80 text-slate-100";

                if (processedSet.has(value)) {
                  toneClass =
                    "border-emerald-400/65 bg-emerald-500/14 text-emerald-50 shadow-[0_0_26px_rgba(52,211,153,0.16)]";
                  badges.push("DONE");
                } else if (discoveredSet.has(value)) {
                  toneClass =
                    "border-violet-400/65 bg-violet-500/14 text-violet-50 shadow-[0_0_26px_rgba(167,139,250,0.16)]";
                  badges.push("SEEN");
                }

                if (step.pointers.neighborOriginal === value) {
                  toneClass =
                    "border-yellow-400/85 bg-yellow-500/16 text-yellow-50 shadow-[0_0_28px_rgba(250,204,21,0.2)]";
                  badges.unshift("CHK");
                }

                if (step.pointers.currentOriginal === value) {
                  toneClass =
                    "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.2)]";
                  badges.unshift("CUR");
                }

                return {
                  label: String(value),
                  caption: "original",
                  toneClass,
                  badges,
                };
              },
              edgeColor: (edge: EdgeFocus) =>
                edgeMatches(edge, step.pointers.edgeFocus)
                  ? { stroke: "#facc15", width: 3.4, opacity: 0.95 }
                  : { stroke: "#334155", width: 2.2, opacity: 0.7 },
            },
            {
              title: "Clone Graph",
              subtitle:
                "Brand-new clone nodes grow here as the map and queue expand.",
              nodes: step.state.originalNodes,
              edges: cloneEdges,
              renderNode: (value: number) => {
                const exists = cloneNodeSet.has(value);
                const badges: string[] = [];
                let toneClass = exists
                  ? "border-violet-400/55 bg-violet-500/12 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.12)]"
                  : "border-dashed border-slate-700/80 bg-slate-950/75 text-slate-500";

                if (exists) {
                  badges.push("CLONE");
                } else {
                  badges.push("WAIT");
                }

                if (cloneNeighborSet.has(value)) {
                  toneClass =
                    "border-yellow-400/85 bg-yellow-500/16 text-yellow-50 shadow-[0_0_28px_rgba(250,204,21,0.2)]";
                  badges.unshift("CHK");
                }

                if (step.pointers.latestCloned === value) {
                  toneClass =
                    "border-emerald-400/85 bg-emerald-500/16 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.22)]";
                  badges.unshift("NEW");
                }

                if (step.pointers.currentClone === value) {
                  toneClass =
                    "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.2)]";
                  badges.unshift("CUR");
                }

                return {
                  label: exists ? `${value}` : `${value}`,
                  caption: exists ? "clone" : "pending",
                  toneClass,
                  badges,
                };
              },
              edgeColor: (edge: EdgeFocus) =>
                edgeMatches(edge, step.pointers.edgeFocus)
                  ? { stroke: "#22d3ee", width: 3.4, opacity: 0.95 }
                  : { stroke: "#475569", width: 2.2, opacity: 0.72 },
            },
          ].map((panel) => (
            <div
              key={panel.title}
              className="rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-50">
                  {panel.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{panel.subtitle}</p>
              </div>

              <div className="relative mx-auto h-[290px] w-full max-w-[360px] overflow-hidden rounded-[1.2rem] border border-slate-800/80 bg-slate-950/50">
                <svg className="absolute inset-0 h-full w-full">
                  {panel.edges.map((edge) => {
                    const source = positions.get(edge.from);
                    const target = positions.get(edge.to);
                    if (!source || !target) {
                      return null;
                    }

                    const color = panel.edgeColor(edge);

                    return (
                      <GraphEdge
                        key={`${panel.title}-${edge.from}-${edge.to}`}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={color.stroke}
                        width={color.width}
                        opacity={color.opacity}
                      />
                    );
                  })}
                </svg>

                {panel.nodes.map((node) => {
                  const position = positions.get(node.value);
                  if (!position) {
                    return null;
                  }

                  const render = panel.renderNode(node.value);

                  return (
                    <GraphNodeCard
                      key={`${panel.title}-${node.value}`}
                      x={position.x}
                      y={position.y}
                      label={render.label}
                      caption={render.caption}
                      toneClass={render.toneClass}
                      badges={render.badges}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <CloneQueue
          title="BFS Queue"
          queue={step.state.queue}
          active={step.pointers.currentOriginal}
          emptyLabel="The queue is empty right now."
        />

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Original -&gt; Clone Map
          </p>
          {step.state.mapping.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No clone node exists yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {step.state.mapping.map((entry) => (
                <div
                  key={entry.original}
                  className={`rounded-xl border px-3 py-2 ${
                    entry.original === step.pointers.currentOriginal
                      ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                      : entry.clone === step.pointers.latestCloned
                      ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm">{entry.original}</span>
                    <span className="text-slate-500">-&gt;</span>
                    <span className="font-mono text-sm">
                      {entry.clone}
                      {"'"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
