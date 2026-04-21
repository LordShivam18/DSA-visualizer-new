import type { CourseScheduleTraceStep } from "./generateTrace";

type Props = {
  step: CourseScheduleTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: CourseScheduleTraceStep) {
  switch (step.actionKind) {
    case "add-edge":
      return "The graph is learning that one course must happen before another.";
    case "seed-ready":
      return "Any course with indegree 0 is ready now because nothing is still blocking it.";
    case "take-course":
      return "The queue is handing us a safe course to complete next.";
    case "inspect-neighbor":
      return "Each outgoing edge means the current course helps unlock another course.";
    case "reduce-indegree":
      return "A remaining prerequisite count just dropped because one needed course was finished.";
    case "enqueue-course":
      return "That course has no blockers left, so it can join the queue.";
    default:
      return step.state.result
        ? "Because every course entered the queue eventually, the schedule is possible."
        : "Some courses kept waiting forever, which means a cycle blocked the schedule.";
  }
}

function buildExpertFocus(step: CourseScheduleTraceStep) {
  switch (step.actionKind) {
    case "add-edge":
      return "Kahn's algorithm stores prereq -> course and increments indegree[course] to count unresolved incoming constraints.";
    case "seed-ready":
      return "The initial frontier is exactly the set of zero-indegree vertices.";
    case "take-course":
      return "Dequeuing a zero-indegree vertex commits one item of the topological order.";
    case "inspect-neighbor":
      return "Processing an outgoing edge simulates deleting it from the remaining dependency graph.";
    case "reduce-indegree":
      return "Indegree decrements track how many prerequisite edges still survive for that vertex.";
    case "enqueue-course":
      return "A vertex enters the queue precisely when all incoming edges have been removed.";
    default:
      return step.state.result
        ? "Success occurs when processedCount == numCourses, which proves the graph is acyclic."
        : "Failure occurs when processedCount < numCourses, leaving a directed cycle in the residual graph.";
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
            Focus on the zero-indegree invariant that drives the queue.
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
            Taken
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.processedCount}/{step.state.numCourses}
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
            Queue Snapshot
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {step.state.queue.length === 0 ? (
              <span className="text-sm text-slate-500">Queue is empty.</span>
            ) : (
              step.state.queue.map((course, index) => (
                <span
                  key={`${course}-${index}`}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    index === 0
                      ? "border-violet-400/35 bg-violet-500/10 text-violet-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  {course}
                </span>
              ))
            )}
          </div>
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
