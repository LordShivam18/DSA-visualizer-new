type Props = {
  order: number[];
  currentCourse: number | null;
};

export default function TopologicalOrderStrip({
  order,
  currentCourse,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Order Builder
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Every dequeued course is appended here to form the final answer.
          </p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          {order.length}
        </span>
      </div>

      {order.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-6 text-sm text-slate-500">
          The output order is empty right now.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {order.map((course, index) => (
            <div
              key={`${course}-${index}`}
              className={`rounded-xl border px-3 py-2 ${
                currentCourse === course
                  ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                  : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
              }`}
            >
              <span className="font-mono text-sm">{course}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
