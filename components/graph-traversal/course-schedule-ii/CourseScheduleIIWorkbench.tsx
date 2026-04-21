import CourseNodeCard from "./CourseNodeCard";
import DirectedEdge from "./DirectedEdge";
import ReadyQueue from "./ReadyQueue";
import TopologicalOrderStrip from "./TopologicalOrderStrip";
import type {
  CourseScheduleIIEdge,
  CourseScheduleIITraceStep,
} from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function buildPositionMap(total: number, width: number, height: number) {
  const map = new Map<number, Point>();

  if (total === 0) {
    return map;
  }

  if (total === 1) {
    map.set(0, { x: width / 2, y: height / 2 });
    return map;
  }

  const radius = Math.min(width, height) / 2 - 62;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let course = 0; course < total; course += 1) {
    const angle = -Math.PI / 2 + (course * 2 * Math.PI) / total;
    map.set(course, {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  return map;
}

function edgeMatches(
  edge: CourseScheduleIIEdge,
  focus: { from: number; to: number } | null
) {
  if (!focus) {
    return false;
  }

  return edge.from === focus.from && edge.to === focus.to;
}

export default function CourseScheduleIIWorkbench({
  step,
}: {
  step: CourseScheduleIITraceStep;
}) {
  const positions = buildPositionMap(step.state.numCourses, 420, 320);
  const queueSet = new Set(step.state.queue);
  const orderSet = new Set(step.state.order);
  const blockedSet = new Set(step.state.remainingBlocked);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Kahn Topological BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Build one valid course order while the ready queue keeps replenishing
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The queue produces a topological order if the graph is acyclic.
            Otherwise the process stalls and the output must be empty.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Courses: {step.state.numCourses}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Queue: {step.state.queue.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Order: {step.state.order.length}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Course
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentCourse ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.neighborCourse ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.queueFront ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Output Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.order.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active course
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: dependency being updated
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: ready in queue
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: fixed in order
        </span>
      </div>

      {step.state.numCourses === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          Enter a course count to build the graph and ordering trace.
        </div>
      ) : (
        <div className="mt-6 rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-50">
              Prerequisite Graph
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Dequeue order is only valid if every arrow points from earlier to later in the final list.
            </p>
          </div>

          <div className="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-[1.2rem] border border-slate-800/80 bg-slate-950/50">
            <svg className="absolute inset-0 h-full w-full">
              {step.state.edges.map((edge) => {
                const source = positions.get(edge.from);
                const target = positions.get(edge.to);
                if (!source || !target) {
                  return null;
                }

                const active = edgeMatches(edge, step.pointers.edgeFocus);
                const stroke = active
                  ? "#22d3ee"
                  : orderSet.has(edge.from) && orderSet.has(edge.to)
                  ? "#34d399"
                  : "#334155";
                const width = active ? 3.1 : 2.2;
                const opacity = active ? 0.96 : 0.74;

                return (
                  <DirectedEdge
                    key={`${edge.from}-${edge.to}-${edge.pairIndex}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={stroke}
                    width={width}
                    opacity={opacity}
                  />
                );
              })}
            </svg>

            {step.state.nodes.map((node) => {
              const position = positions.get(node.course);
              if (!position) {
                return null;
              }

              const indegree = step.state.indegree[node.course] ?? 0;
              const badges: string[] = [];
              let toneClass =
                "border-slate-700/80 bg-slate-900/80 text-slate-100";

              if (queueSet.has(node.course)) {
                toneClass =
                  "border-violet-400/65 bg-violet-500/14 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.16)]";
                badges.push("READY");
              }

              if (orderSet.has(node.course)) {
                toneClass =
                  "border-emerald-400/80 bg-emerald-500/16 text-emerald-50 shadow-[0_0_28px_rgba(52,211,153,0.2)]";
                badges.unshift("ORDER");
              }

              if (blockedSet.has(node.course) && step.done && step.state.result?.length === 0) {
                toneClass =
                  "border-rose-400/70 bg-rose-500/16 text-rose-50 shadow-[0_0_28px_rgba(251,113,133,0.2)]";
                badges.unshift("LOOP");
              }

              if (step.pointers.neighborCourse === node.course) {
                toneClass =
                  "border-yellow-400/85 bg-yellow-500/16 text-yellow-50 shadow-[0_0_30px_rgba(250,204,21,0.2)]";
                badges.unshift("CHK");
              }

              if (step.pointers.currentCourse === node.course) {
                toneClass =
                  "border-cyan-400/85 bg-cyan-500/16 text-cyan-50 shadow-[0_0_32px_rgba(34,211,238,0.22)]";
                badges.unshift("CUR");
              }

              return (
                <CourseNodeCard
                  key={node.course}
                  x={position.x}
                  y={position.y}
                  course={node.course}
                  indegree={indegree}
                  toneClass={toneClass}
                  badges={badges}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <ReadyQueue
          queue={step.state.queue}
          currentCourse={step.pointers.currentCourse}
        />
        <TopologicalOrderStrip
          order={step.state.order}
          currentCourse={step.pointers.currentCourse}
        />
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Indegree Ledger
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {step.state.indegree.map((value, course) => (
            <div
              key={course}
              className={`rounded-xl border px-3 py-3 ${
                step.pointers.currentCourse === course
                  ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                  : step.pointers.neighborCourse === course
                  ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                  : step.state.queue.includes(course)
                  ? "border-violet-400/35 bg-violet-500/10 text-violet-100"
                  : step.state.order.includes(course)
                  ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                  : "border-slate-800/80 bg-slate-950/70 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm">Course {course}</span>
                <span className="font-mono text-sm">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
