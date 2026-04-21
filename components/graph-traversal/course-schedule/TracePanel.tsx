import type {
  CourseScheduleActionKind,
  CourseScheduleTraceStep,
} from "./generateTrace";

type Props = {
  step: CourseScheduleTraceStep;
};

const actionTone: Record<CourseScheduleActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "add-edge": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "seed-ready": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "take-course": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "inspect-neighbor": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "reduce-indegree": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "enqueue-course": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each snapshot records queue changes, indegree updates, and cycle evidence.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 ${actionTone[step.actionKind]}`}>
          {step.actionKind}
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
          Taken {step.state.processedCount}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-violet-400/40 bg-violet-500/10 text-violet-200"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-[#061020] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-100">{step.action}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Course
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentCourse ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.neighborCourse ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.queueFront ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.queue.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Blocked
          </p>
          <p className="mt-2 text-2xl font-semibold text-rose-200">
            {step.state.remainingBlocked.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Indegree Snapshot
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {step.state.indegree.map((value, course) => (
            <div
              key={course}
              className={`rounded-xl border px-3 py-2 ${
                step.pointers.currentCourse === course
                  ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                  : step.pointers.neighborCourse === course
                  ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
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

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
