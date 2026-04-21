import type { RangePointer } from "./generateTrace";

type Props = {
  nums: number[];
  activeRange: RangePointer | null;
  midIndex: number | null;
  builtIndices: number[];
};

export default function ArrayWindowStrip({
  nums,
  activeRange,
  midIndex,
  builtIndices,
}: Props) {
  const builtSet = new Set(builtIndices);

  if (nums.length === 0) {
    return (
      <div className="rounded-[1.2rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
        Enter a sorted array to watch the recursive splits.
      </div>
    );
  }

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        Array Slice View
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {nums.map((value, index) => {
          const inRange =
            activeRange !== null &&
            index >= activeRange.left &&
            index <= activeRange.right;
          const isMid = midIndex === index;
          const isBuilt = builtSet.has(index);

          let toneClass =
            "border-slate-800/80 bg-slate-950/80 text-slate-300 shadow-[0_0_18px_rgba(15,23,42,0.45)]";

          if (isBuilt) {
            toneClass =
              "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]";
          }

          if (inRange) {
            toneClass =
              "border-yellow-400/55 bg-yellow-500/12 text-yellow-50 shadow-[0_0_24px_rgba(250,204,21,0.16)]";
          }

          if (isMid) {
            toneClass =
              "border-cyan-400/70 bg-cyan-500/14 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.22)]";
          }

          const tags: string[] = [];
          if (activeRange && index === activeRange.left) {
            tags.push("L");
          }
          if (isMid) {
            tags.push("MID");
          }
          if (activeRange && index === activeRange.right) {
            tags.push("R");
          }
          if (isBuilt && !isMid) {
            tags.push("BST");
          }

          return (
            <div
              key={`${value}-${index}`}
              className={`min-w-[72px] rounded-[1.1rem] border px-3 py-3 text-center transition-all duration-300 ${toneClass}`}
            >
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                idx {index}
              </div>
              <div className="mt-2 text-2xl font-semibold">{value}</div>
              <div className="mt-2 flex min-h-5 flex-wrap justify-center gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700/60 bg-slate-950/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
