import LevelChainStrip from "./LevelChainStrip";
import TreeNodeCard from "./TreeNodeCard";
import type { ConnectTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

type Props = {
  step: ConnectTraceStep;
};

function buildPositionMap(step: ConnectTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const canvasWidth = Math.max(760, deepestSlots * 120);
  const canvasHeight = 180 + maxDepth * 150;

  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = ((node.order + 1) * canvasWidth) / (levelSlots + 1);
    const y = 96 + node.depth * 148;

    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function lastId(ids: string[]) {
  return ids.length === 0 ? null : ids[ids.length - 1];
}

export default function NextPointerTree({ step }: Props) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const nodesById = new Map(step.state.nodes.map((node) => [node.id, node]));
  const currentLevelTail = lastId(step.state.currentLevelIds);
  const nextLevelTail = lastId(step.state.nextLevelIds);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Tree + Next Pointers
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Build each level&apos;s horizontal chain in place
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Gray edges show the tree itself. Neon rose arrows show the next
            pointers that have already been connected.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Level:{" "}
            <span className="font-mono text-slate-50">
              {step.pointers.level + 1}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Nodes:{" "}
            <span className="font-mono text-cyan-200">
              {step.state.nodes.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Connected output:{" "}
            <span className="font-mono text-rose-200">
              {step.state.serializedOutput.length === 0
                ? "[]"
                : `[${step.state.serializedOutput.join(",")}]`}
            </span>
          </span>
        </div>
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
                id="next-arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10Z" fill="#fb7185" />
              </marker>
              <marker
                id="tree-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M0 0L8 4L0 8Z" fill="#64748b" />
              </marker>
            </defs>

            {step.state.nodes.map((node) => {
              const source = positions.get(node.id);
              const left = node.leftId ? positions.get(node.leftId) : null;
              const right = node.rightId ? positions.get(node.rightId) : null;

              if (!source) {
                return null;
              }

              return (
                <g key={`edges-${node.id}`}>
                  {left ? (
                    <line
                      x1={source.x}
                      y1={source.y + 18}
                      x2={left.x}
                      y2={left.y - 18}
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                  ) : null}
                  {right ? (
                    <line
                      x1={source.x}
                      y1={source.y + 18}
                      x2={right.x}
                      y2={right.y - 18}
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                  ) : null}
                </g>
              );
            })}

            {step.state.nodes.map((node) => {
              if (!node.nextId) {
                return null;
              }

              const source = positions.get(node.id);
              const target = positions.get(node.nextId);

              if (!source || !target) {
                return null;
              }

              const lift = 32 + node.depth * 4;
              const path = `M ${source.x + 34} ${source.y - lift} C ${
                source.x + 70
              } ${source.y - lift - 18}, ${target.x - 70} ${
                target.y - lift - 18
              }, ${target.x - 34} ${target.y - lift}`;

              return (
                <path
                  key={`next-${node.id}`}
                  d={path}
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="3"
                  markerEnd="url(#next-arrow)"
                  opacity="0.9"
                />
              );
            })}

            {[currentLevelTail, nextLevelTail]
              .filter((value, index, array): value is string => {
                return value !== null && array.indexOf(value) === index;
              })
              .map((id) => {
                const source = positions.get(id);
                const node = nodesById.get(id);

                if (!source || !node) {
                  return null;
                }

                const lift = 32 + node.depth * 4;
                return (
                  <g key={`null-${id}`}>
                    <line
                      x1={source.x + 34}
                      y1={source.y - lift}
                      x2={source.x + 86}
                      y2={source.y - lift}
                      stroke="#fb7185"
                      strokeWidth="3"
                      markerEnd="url(#next-arrow)"
                      opacity="0.85"
                    />
                    <text
                      x={source.x + 98}
                      y={source.y - lift + 4}
                      fill="#cbd5e1"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      NULL
                    </text>
                  </g>
                );
              })}
          </svg>

          {step.state.nodes.map((node) => {
            const position = positions.get(node.id);

            if (!position) {
              return null;
            }

            const badges = [];

            if (step.pointers.levelStartId === node.id) {
              badges.push({ label: "START", tone: "purple" as const });
            }
            if (step.pointers.currentId === node.id) {
              badges.push({ label: "CURR", tone: "cyan" as const });
            }
            if (step.pointers.tailId === node.id) {
              badges.push({ label: "TAIL", tone: "yellow" as const });
            }
            if (step.pointers.nextLevelHeadId === node.id) {
              badges.push({ label: "HEAD", tone: "green" as const });
            }
            if (step.pointers.inspectingChildId === node.id) {
              badges.push({
                label:
                  step.pointers.inspectingSide === "left" ? "LEFT" : "RIGHT",
                tone: "yellow" as const,
              });
            }

            const showNullTerminal =
              currentLevelTail === node.id || nextLevelTail === node.id;
            const nextLabel = node.nextId
              ? `next:${nodesById.get(node.nextId)?.value}`
              : showNullTerminal
              ? "next:NULL"
              : "next:-";

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: position.x, top: position.y }}
              >
                <TreeNodeCard
                  node={node}
                  badges={badges}
                  connected={node.nextId !== null || showNullTerminal}
                  nextLabel={nextLabel}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <LevelChainStrip
          title="Current Level"
          ids={step.state.currentLevelIds}
          nodes={step.state.nodes}
          accent="purple"
          emptyLabel="No current level is active."
        />
        <LevelChainStrip
          title="Remaining Scan"
          ids={step.state.remainingCurrentIds}
          nodes={step.state.nodes}
          accent="cyan"
          emptyLabel="No nodes remain on this level."
        />
        <LevelChainStrip
          title="Next Level Builder"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="green"
          emptyLabel="No child has been linked yet."
        />
      </div>
    </section>
  );
}
