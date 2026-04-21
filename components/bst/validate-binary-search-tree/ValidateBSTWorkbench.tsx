import FrameStack from "./FrameStack";
import TreeNodeCard from "./TreeNodeCard";
import ValidationLedger from "./ValidationLedger";
import {
  formatBound,
  formatRange,
  formatResult,
  type ValidateTraceStep,
} from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(step: ValidateTraceStep) {
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

function labelOf(step: ValidateTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function ValidateBSTWorkbench({
  step,
}: {
  step: ValidateTraceStep;
}) {
  const { positions, canvasWidth, canvasHeight } = buildPositionMap(step);
  const frameSet = new Set(step.state.frames.map((frame) => frame.id));
  const validatedSet = new Set(step.state.validatedIds);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Strict BST Bounds
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Every node must fit all ancestor limits
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the node being checked, violet marks scheduled frames,
            green marks nodes that passed, red marks the first violation, and
            yellow shows the active exclusive range.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Frames{" "}
            <span className="font-mono text-violet-200">
              {step.state.frames.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Validated{" "}
            <span className="font-mono text-emerald-200">
              {step.state.validatedIds.length}
            </span>
          </span>
          <span
            className={`rounded-full border px-3 py-1 ${
              step.state.result === false
                ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                : step.state.result === true
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
            }`}
          >
            Result {formatResult(step.state.result)}
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
            Lower Bound
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatBound(step.pointers.lowerBound)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Upper Bound
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatBound(step.pointers.upperBound)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Active Range
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-emerald-200">
            {formatRange(step.pointers.lowerBound, step.pointers.upperBound)}
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
              Empty tree. It is valid by definition.
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

                        const scheduled = step.pointers.scheduledChildId === childId;
                        const invalid = step.state.invalidId === childId;

                        return (
                          <line
                            key={`${node.id}-${childId}`}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={invalid ? "#fb7185" : scheduled ? "#a78bfa" : "#334155"}
                            strokeWidth={invalid || scheduled ? 3 : 2}
                            opacity={invalid || scheduled ? 0.9 : 0.58}
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
                const isScheduled = frameSet.has(node.id);
                const isValidated = validatedSet.has(node.id);
                const isInvalid = step.state.invalidId === node.id;
                const isScheduledChild = step.pointers.scheduledChildId === node.id;

                const badges: Array<{ label: string; className: string }> = [];

                if (isInvalid) {
                  badges.push({
                    label: "FAIL",
                    className: "border-rose-400/70 bg-rose-500/12 text-rose-100",
                  });
                } else if (isFocus) {
                  badges.push({
                    label: "CHECK",
                    className: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
                  });
                }
                if (isValidated) {
                  badges.push({
                    label: "PASS",
                    className:
                      "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
                  });
                }
                if (isScheduledChild) {
                  badges.push({
                    label: step.pointers.scheduledSide ?? "NEXT",
                    className:
                      "border-violet-400/70 bg-violet-500/12 text-violet-100",
                  });
                }

                const toneClass = isInvalid
                  ? "border-rose-400/85 bg-rose-500/18 text-rose-50 shadow-[0_0_32px_rgba(251,113,133,0.28)]"
                  : isFocus
                  ? "border-cyan-400/80 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.26)]"
                  : isScheduledChild || isScheduled
                  ? "border-violet-400/60 bg-violet-500/12 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.16)]"
                  : isValidated
                  ? "border-emerald-400/55 bg-emerald-500/10 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.12)]"
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
                      isInvalid
                        ? "invalid"
                        : isValidated
                        ? "valid"
                        : isScheduled
                        ? "queued"
                        : null
                    }
                    dimmed={!isFocus && !isScheduled && !isValidated && !isInvalid}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <FrameStack
          frames={step.state.frames}
          nodes={step.state.nodes}
          emptyLabel="No scheduled range checks remain."
        />
        <ValidationLedger
          records={step.state.records}
          nodes={step.state.nodes}
          invalidId={step.state.invalidId}
        />
      </div>
    </section>
  );
}
