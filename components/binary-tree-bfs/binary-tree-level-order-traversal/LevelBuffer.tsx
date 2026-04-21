import { formatValueArray } from "./generateTrace";

type Props = {
  values: number[];
  levelSize: number;
  writeIndex: number | null;
};

export default function LevelBuffer({ values, levelSize, writeIndex }: Props) {
  const slots = Array.from({ length: Math.max(levelSize, values.length) }, (_, index) =>
    values[index] ?? null
  );

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Active Level Vector
        </h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-100">
          {formatValueArray(values)}
        </span>
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        Values are appended in the same order they are popped from the BFS queue.
      </p>

      {slots.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          Waiting for the next level to start.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {slots.map((value, index) => {
            const active = writeIndex === index;
            const filled = value !== null;

            return (
              <div
                key={`level-buffer-${index}`}
                className={[
                  "flex h-16 w-16 flex-col items-center justify-center rounded-xl border transition-all duration-300",
                  active
                    ? "border-cyan-400/70 bg-cyan-500/14 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                    : filled
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-50"
                    : "border-dashed border-slate-700/80 bg-slate-950/50 text-slate-500",
                ].join(" ")}
              >
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  {index}
                </span>
                <span className="font-mono text-lg font-semibold">
                  {value ?? "-"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
