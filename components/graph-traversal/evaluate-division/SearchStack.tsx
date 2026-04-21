import type { SearchFrame } from "./generateTrace";

type Props = {
  stack: SearchFrame[];
  currentVariable: string | null;
};

export default function SearchStack({ stack, currentVariable }: Props) {
  const ordered = [...stack].reverse();

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            DFS Stack
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Top entries hold the next variable and the ratio accumulated so far.
          </p>
        </div>
        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-100">
          {stack.length}
        </span>
      </div>

      {ordered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-6 text-sm text-slate-500">
          The stack is empty right now.
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          {ordered.map((frame, index) => (
            <div
              key={`${frame.variable}-${index}`}
              className={`rounded-xl border px-3 py-3 ${
                currentVariable === frame.variable
                  ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                  : index === 0
                  ? "border-violet-400/40 bg-violet-500/10 text-violet-100"
                  : "border-slate-800/80 bg-slate-950/70 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm">{frame.variable}</span>
                <span className="font-mono text-xs text-slate-300">
                  {frame.product.toFixed(5)}
                </span>
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {frame.path.join(" -> ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
