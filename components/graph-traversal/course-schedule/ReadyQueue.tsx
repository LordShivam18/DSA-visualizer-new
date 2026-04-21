type Props = {
  queue: number[];
  currentCourse: number | null;
};

export default function ReadyQueue({ queue, currentCourse }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Ready Queue
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Only zero-indegree courses can wait here.
          </p>
        </div>
        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-100">
          {queue.length}
        </span>
      </div>

      {queue.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-6 text-sm text-slate-500">
          No ready course is waiting in the queue.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {queue.map((course, index) => (
            <div
              key={`${course}-${index}`}
              className={`rounded-xl border px-3 py-2 ${
                currentCourse === course
                  ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                  : index === 0
                  ? "border-violet-400/35 bg-violet-500/10 text-violet-100"
                  : "border-slate-800/80 bg-slate-950/70 text-slate-300"
              }`}
            >
              <span className="font-mono text-sm">Course {course}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
