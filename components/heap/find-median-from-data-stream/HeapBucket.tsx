import type { HeapSide } from "./generateTrace";

type Props = {
  title: string;
  subtitle: string;
  heap: number[];
  side: HeapSide;
  activeIndex: number | null;
  role: "max" | "min";
};

function buildLevels(heap: number[]) {
  const levels: number[][] = [];
  let index = 0;
  let width = 1;

  while (index < heap.length) {
    levels.push(heap.slice(index, index + width));
    index += width;
    width *= 2;
  }

  return levels;
}

export default function HeapBucket({
  title,
  subtitle,
  heap,
  side,
  activeIndex,
  role,
}: Props) {
  const levels = buildLevels(heap);

  return (
    <div className="rounded-[1.3rem] border border-slate-800/80 bg-[#050916] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-50">{subtitle}</h3>
        </div>

        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-100">
          size {heap.length}
        </span>
      </div>

      {heap.length === 0 ? (
        <div className="mt-5 rounded-[1.15rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
          This heap is empty right now.
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {heap.map((value, index) => {
              let toneClass =
                "border-slate-800/80 bg-slate-950/70 text-slate-200";

              if (index === 0) {
                toneClass =
                  role === "max"
                    ? "border-emerald-400/45 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.14)]"
                    : "border-yellow-400/45 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.14)]";
              }

              if (index === activeIndex) {
                toneClass =
                  "border-cyan-400/45 bg-cyan-500/12 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.14)]";
              }

              return (
                <div
                  key={`${side}-${index}-${value}`}
                  className={`rounded-[1rem] border px-3 py-3 transition-all duration-300 ${toneClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      heap[{index}]
                    </span>
                    <span className="text-[11px] text-slate-400">{side}</span>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{value}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Heap Shape
            </p>
            <div className="mt-4 space-y-4">
              {levels.map((level, levelIndex) => {
                const levelStart = 2 ** levelIndex - 1;

                return (
                  <div
                    key={levelIndex}
                    className="flex flex-wrap items-center justify-center gap-3"
                  >
                    {level.map((value, offset) => {
                      const index = levelStart + offset;

                      let toneClass =
                        "border-slate-700/80 bg-slate-950/80 text-slate-200";

                      if (index === 0) {
                        toneClass =
                          role === "max"
                            ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.16)]"
                            : "border-yellow-400/55 bg-yellow-500/12 text-yellow-50 shadow-[0_0_20px_rgba(250,204,21,0.16)]";
                      }

                      if (index === activeIndex) {
                        toneClass =
                          "border-cyan-400/55 bg-cyan-500/12 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.16)]";
                      }

                      return (
                        <div
                          key={`${side}-node-${index}-${value}`}
                          className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border text-center transition-all duration-300 ${toneClass}`}
                        >
                          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {index}
                          </span>
                          <span className="mt-1 text-lg font-semibold">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
