import type { IteratorTraceStep } from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

const stripAccent = {
  amber: {
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    text: "text-amber-100",
  },
  emerald: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-100",
  },
  cyan: {
    border: "border-cyan-400/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-100",
  },
} as const;

function buildPositionMap(step: IteratorTraceStep) {
  const nodes = step.state.nodes;
  const maxDepth = Math.max(...nodes.map((node) => node.depth), 0);
  const deepestSlots = 2 ** maxDepth;
  const canvasWidth = Math.max(780, deepestSlots * 132);
  const canvasHeight = 220 + maxDepth * 156;
  const positions = new Map<string, Point>();

  nodes.forEach((node) => {
    const levelSlots = 2 ** node.depth;
    const x = ((node.order + 1) * canvasWidth) / (levelSlots + 1);
    const y = 108 + node.depth * 150;

    positions.set(node.id, { x, y });
  });

  return { positions, canvasWidth, canvasHeight };
}

function renderStrip(
  step: IteratorTraceStep,
  title: string,
  helperText: string,
  ids: string[],
  emptyLabel: string,
  accent: keyof typeof stripAccent,
  reverse = false
) {
  const nodesById = new Map(step.state.nodes.map((node) => [node.id, node]));
  const palette = stripAccent[accent];
  const displayIds = reverse ? [...ids].reverse() : ids;

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{helperText}</p>

      {displayIds.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {displayIds.map((id, index) => (
            <span
              key={`${id}-${index}`}
              className={`rounded-full border px-3 py-1 text-xs font-mono ${palette.border} ${palette.bg} ${palette.text}`}
            >
              {reverse && index === 0 ? "top " : ""}
              {nodesById.get(id)?.value ?? "?"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IteratorWorkbench({ step }: { step: IteratorTraceStep }) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const nodesById = new Map(step.state.nodes.map((node) => [node.id, node]));
  const stackTopId =
    step.state.stackIds.length > 0
      ? step.state.stackIds[step.state.stackIds.length - 1]
      : null;
  const stackSet = new Set(step.state.stackIds);
  const visitedSet = new Set(step.state.visitedIds);
  const pushSet = new Set(step.pointers.pushPathIds);
  const doneCalls = step.state.calls.filter((call) => call.status === "done").length;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Lazy Inorder Traversal
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Stack state for the BST iterator
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The tree shape stays fixed. Only the stack frontier changes as the
            iterator reveals values in inorder sequence, one method call at a
            time.
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
            Stack:{" "}
            <span className="font-mono text-amber-200">
              {step.state.stackIds.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Returned:{" "}
            <span className="font-mono text-emerald-200">
              {step.state.visitedIds.length}/{step.state.inorderIds.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Calls Done:{" "}
            <span className="font-mono text-cyan-200">{doneCalls}</span>
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Next Candidate
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {stackTopId ? nodesById.get(stackTopId)?.value ?? "none" : "none"}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.focusNodeId
              ? nodesById.get(step.pointers.focusNodeId)?.value ?? "none"
              : "none"}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Returned
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.returnedNodeId
              ? nodesById.get(step.pointers.returnedNodeId)?.value ?? "none"
              : "none"}
          </p>
        </div>

        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Active Call
          </p>
          <p className="mt-2 text-lg font-semibold text-lime-200">
            {step.state.calls.find(
              (call) => call.id === step.pointers.currentCallId
            )?.label ??
              step.state.calls.find((call) => call.id === step.pointers.lastCallId)
                ?.label ??
              "setup"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]">
          Amber: stack frontier / top node
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: current focus or pushLeft traversal
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: values already returned
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: right subtree being expanded
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
              const left = node.leftId ? positions.get(node.leftId) : null;
              const right = node.rightId ? positions.get(node.rightId) : null;

              if (!source) {
                return null;
              }

              return (
                <g key={`edge-${node.id}`}>
                  {left ? (
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={left.x}
                      y2={left.y}
                      stroke="#334155"
                      strokeWidth="2.2"
                    />
                  ) : null}
                  {right ? (
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={right.x}
                      y2={right.y}
                      stroke="#334155"
                      strokeWidth="2.2"
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {step.state.nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-5 py-2 text-sm text-slate-500">
                Empty BST
              </div>
            </div>
          ) : null}

          {step.state.nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) {
              return null;
            }

            const badges: Array<{ label: string; className: string }> = [];

            if (node.id === stackTopId) {
              badges.push({
                label: "TOP",
                className:
                  "border-amber-400/70 bg-amber-500/12 text-amber-100",
              });
            }

            if (node.id === step.pointers.focusNodeId) {
              badges.push({
                label: "FOCUS",
                className: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
              });
            }

            if (node.id === step.pointers.returnedNodeId) {
              badges.push({
                label: "RET",
                className:
                  "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
              });
            }

            if (
              node.id === step.pointers.rightSubtreeRootId &&
              node.id !== step.pointers.focusNodeId
            ) {
              badges.push({
                label: "RIGHT",
                className:
                  "border-violet-400/70 bg-violet-500/12 text-violet-100",
              });
            }

            if (pushSet.has(node.id) && node.id !== step.pointers.focusNodeId) {
              badges.push({
                label: "PUSH",
                className: "border-cyan-400/55 bg-cyan-500/10 text-cyan-100",
              });
            }

            if (
              visitedSet.has(node.id) &&
              node.id !== step.pointers.returnedNodeId
            ) {
              badges.push({
                label: "DONE",
                className:
                  "border-emerald-400/55 bg-emerald-500/10 text-emerald-100",
              });
            }

            const toneClass =
              node.id === step.pointers.returnedNodeId
                ? "border-emerald-400/80 bg-emerald-500/14 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.24)]"
                : node.id === step.pointers.focusNodeId
                ? "border-cyan-400/80 bg-cyan-500/14 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.26)]"
                : node.id === stackTopId
                ? "border-amber-400/80 bg-amber-500/14 text-amber-50 shadow-[0_0_30px_rgba(251,191,36,0.24)]"
                : node.id === step.pointers.rightSubtreeRootId
                ? "border-violet-400/80 bg-violet-500/14 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.22)]"
                : pushSet.has(node.id)
                ? "border-cyan-400/55 bg-cyan-500/10 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.14)]"
                : visitedSet.has(node.id)
                ? "border-emerald-400/55 bg-emerald-500/10 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.12)]"
                : stackSet.has(node.id)
                ? "border-amber-400/55 bg-amber-500/10 text-amber-50 shadow-[0_0_22px_rgba(251,191,36,0.12)]"
                : "border-slate-700/80 bg-slate-950/85 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.5)]";

            const leftValue = node.leftId
              ? String(nodesById.get(node.leftId)?.value ?? "?")
              : "-";
            const rightValue = node.rightId
              ? String(nodesById.get(node.rightId)?.value ?? "?")
              : "-";

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: position.x, top: position.y }}
              >
                <div className="relative flex flex-col items-center gap-2">
                  <div className="absolute -top-9 flex flex-wrap items-center justify-center gap-1">
                    {badges.map((badge) => (
                      <span
                        key={`${node.id}-${badge.label}`}
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border text-lg font-semibold transition-all duration-500 ${toneClass}`}
                  >
                    {node.value}
                  </div>

                  <div className="rounded-full border border-slate-800/80 bg-slate-950/85 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">
                    L:{leftValue} | R:{rightValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {renderStrip(
          step,
          "Stack Frontier",
          "These are the nodes currently stored inside the iterator stack.",
          step.state.stackIds,
          "The stack is empty.",
          "amber",
          true
        )}
        {renderStrip(
          step,
          "Returned Values",
          "Each successful next() call extends this inorder prefix.",
          step.state.visitedIds,
          "No next() call has returned a value yet.",
          "emerald"
        )}
        {renderStrip(
          step,
          "Remaining Inorder",
          "These nodes have not been returned yet.",
          step.state.remainingIds,
          "All reachable nodes have already been returned.",
          "cyan"
        )}
      </div>
    </section>
  );
}
