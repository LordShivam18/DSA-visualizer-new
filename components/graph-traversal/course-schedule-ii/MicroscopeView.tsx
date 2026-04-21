import type { CourseScheduleIITraceStep } from "./generateTrace";

type Props = {
  step: CourseScheduleIITraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: CourseScheduleIITraceStep) {
  switch (step.actionKind) {
    case "add-edge":
      return "The graph is learning who must come before whom.";
    case "seed-ready":
      return "Any course with indegree 0 is a valid candidate to appear early in the order.";
    case "append-order":
      return "A ready course is being locked into the final answer now.";
    case "inspect-neighbor":
      return "The current course can help unlock other courses that depend on it.";
    case "reduce-indegree":
      return "A waiting count just dropped because one prerequisite was satisfied.";
    case "enqueue-course":
      return "That course can now join the queue because it has no blockers left.";
    default:
      return step.state.result?.length === step.state.numCourses
        ? "The queue built a full legal order for all courses."
        : "The queue stopped too early, so no full course order exists.";
  }
}

function buildExpertFocus(step: CourseScheduleIITraceStep) {
  switch (step.actionKind) {
    case "add-edge":
      return "Prereq -> course edges plus indegree counts define the dependency graph consumed by Kahn's algorithm.";
    case "seed-ready":
      return "Zero-indegree vertices form the frontier of admissible next choices in the topological order.";
    case "append-order":
      return "Dequeuing a zero-indegree vertex appends one more element to a valid topological prefix.";
    case "inspect-neighbor":
      return "Outgoing edges represent constraints removed from the residual graph after committing the current course.";
    case "reduce-indegree":
      return "Indegree decrements maintain the invariant that indegree equals unresolved prerequisites.";
    case "enqueue-course":
      return "A course enters the queue exactly when every prerequisite already appears in the order prefix.";
    default:
      return step.state.result?.length === step.state.numCourses
        ? "A full topological ordering exists because the queue consumed every vertex."
        : "An incomplete ordering proves the residual graph still contains a directed cycle.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Focus on how the queue and the growing order stay consistent with prerequisites.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Course
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentCourse ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.neighborCourse ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.queue.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Order Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.order.length}/{step.state.numCourses}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? buildBeginnerFocus(step)
            : buildExpertFocus(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Order Snapshot
          </p>
          <p className="mt-4 font-mono text-sm text-emerald-100">
            {step.state.order.length === 0
              ? "[]"
              : `[${step.state.order.join(", ")}]`}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Cycle Signal
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Remaining blocked courses:
            <span className="ml-2 font-mono text-rose-200">
              {step.state.remainingBlocked.length === 0
                ? "none"
                : step.state.remainingBlocked.join(", ")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
