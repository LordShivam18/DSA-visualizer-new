import QueryStrip from "./QueryStrip";
import SearchStack from "./SearchStack";
import VariableNode from "./VariableNode";
import WeightedEdge from "./WeightedEdge";
import type {
  EdgeFocus,
  EquationRecord,
  EvaluateDivisionTraceStep,
} from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(labels: string[], width: number, height: number) {
  const map = new Map<string, Point>();

  if (labels.length === 0) {
    return map;
  }

  if (labels.length === 1) {
    map.set(labels[0], { x: width / 2, y: height / 2 });
    return map;
  }

  const radius = Math.min(width, height) / 2 - 62;
  const centerX = width / 2;
  const centerY = height / 2;

  labels.forEach((label, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / labels.length;
    map.set(label, {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  });

  return map;
}

function edgeMatches(edge: EquationRecord, focus: EdgeFocus | null) {
  if (!focus) {
    return false;
  }

  return (
    (edge.from === focus.from && edge.to === focus.to) ||
    (edge.from === focus.to && edge.to === focus.from)
  );
}

function pathIncludesEdge(edge: EquationRecord, path: string[] | null) {
  if (!path || path.length < 2) {
    return false;
  }

  for (let index = 0; index < path.length - 1; index += 1) {
    const a = path[index];
    const b = path[index + 1];
    if (
      (edge.from === a && edge.to === b) ||
      (edge.from === b && edge.to === a)
    ) {
      return true;
    }
  }

  return false;
}

export default function EvaluateDivisionWorkbench({
  step,
}: {
  step: EvaluateDivisionTraceStep;
}) {
  const labels = step.state.graphNodes.map((node) => node.variable);
  const positions = buildPositionMap(labels, 420, 320);
  const visitedSet = new Set(step.state.visited);
  const activePathSet = new Set(step.state.activePath ?? []);
  const successPathSet = new Set(step.state.successfulPath ?? []);
  const currentQuery = step.state.currentQuery;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Weighted Graph DFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Multiply edge weights while searching for a variable-to-variable path
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Every equation becomes two reciprocal edges. Each query restarts DFS
            from scratch and carries a running ratio through the graph.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Variables: {labels.length}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Equations: {step.state.equations.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Resolved: {step.state.answers.filter((value) => value !== null).length}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Query
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-cyan-200">
            {currentQuery ? `${currentQuery.from} / ${currentQuery.to}` : "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Variable
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-cyan-200">
            {step.pointers.currentVariable ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-yellow-200">
            {step.pointers.neighborVariable ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Running Ratio
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-emerald-200">
            {step.pointers.currentProduct === null
              ? "none"
              : step.pointers.currentProduct.toFixed(5)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active variable
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: neighbor under inspection
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: discovered this query
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: successful answer path
        </span>
      </div>

      {labels.length === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          Add equations to build the variable graph.
        </div>
      ) : (
        <div className="mt-6 rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-50">Variable Graph</h3>
            <p className="mt-1 text-sm text-slate-400">
              Edge labels show forward and reverse weights from each original equation.
            </p>
          </div>

          <div className="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-[1.2rem] border border-slate-800/80 bg-slate-950/50">
            <svg className="absolute inset-0 h-full w-full">
              {step.state.equations.map((equation, index) => {
                const source = positions.get(equation.from);
                const target = positions.get(equation.to);
                if (!source || !target) {
                  return null;
                }

                const active = edgeMatches(equation, step.pointers.edgeFocus);
                const success = pathIncludesEdge(equation, step.state.successfulPath);
                const stroke = success
                  ? "#34d399"
                  : active
                  ? "#22d3ee"
                  : "#334155";
                const width = success ? 3.4 : active ? 3 : 2.1;
                const opacity = success ? 0.96 : active ? 0.92 : 0.72;
                const labelToneClass = success
                  ? "border-emerald-400/50 bg-emerald-500/12 text-emerald-100"
                  : active
                  ? "border-cyan-400/50 bg-cyan-500/12 text-cyan-100"
                  : "border-slate-700/80 bg-slate-950/80 text-slate-300";

                return (
                  <WeightedEdge
                    key={`${equation.from}-${equation.to}-${index}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={stroke}
                    width={width}
                    opacity={opacity}
                    label={`${equation.weight.toFixed(2)} / ${equation.reverseWeight.toFixed(2)}`}
                    labelToneClass={labelToneClass}
                  />
                );
              })}
            </svg>

            {labels.map((label) => {
              const position = positions.get(label);
              if (!position) {
                return null;
              }

              const badges: string[] = [];
              let toneClass =
                "border-slate-700/80 bg-slate-900/80 text-slate-100";

              if (visitedSet.has(label)) {
                toneClass =
                  "border-violet-400/65 bg-violet-500/14 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.16)]";
                badges.push("SEEN");
              }

              if (activePathSet.has(label)) {
                toneClass =
                  "border-violet-300/75 bg-violet-500/18 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.22)]";
                badges.unshift("PATH");
              }

              if (successPathSet.has(label)) {
                toneClass =
                  "border-emerald-400/80 bg-emerald-500/18 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.22)]";
                badges.unshift("OK");
              }

              if (step.pointers.neighborVariable === label) {
                toneClass =
                  "border-yellow-400/85 bg-yellow-500/16 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.2)]";
                badges.unshift("CHK");
              }

              if (step.pointers.currentVariable === label) {
                toneClass =
                  "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_32px_rgba(34,211,238,0.22)]";
                badges.unshift("CUR");
              }

              if (currentQuery?.from === label) {
                badges.unshift("SRC");
              } else if (currentQuery?.to === label) {
                badges.unshift("DST");
              }

              return (
                <VariableNode
                  key={label}
                  x={position.x}
                  y={position.y}
                  label={label}
                  toneClass={toneClass}
                  badges={badges}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <QueryStrip
          queries={step.state.queries}
          answers={step.state.answers}
          currentQueryIndex={step.state.currentQueryIndex}
        />

        <SearchStack
          stack={step.state.searchStack}
          currentVariable={step.pointers.currentVariable}
        />
      </div>
    </section>
  );
}
