import type { BoardCellRecord } from "./generateTrace";

type Props = {
  cell: BoardCellRecord;
  toneClass: string;
  tags: string[];
  distance: number | null;
};

export default function BoardSquare({ cell, toneClass, tags, distance }: Props) {
  return (
    <div
      className={`relative flex aspect-square min-h-[84px] flex-col justify-between overflow-hidden rounded-[1.1rem] border p-3 transition-all duration-300 ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {cell.label}
        </span>
        <div className="flex flex-wrap justify-end gap-1">
          {tags.map((tag) => (
            <span
              key={`${cell.label}-${tag}`}
              className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-300">
          ({cell.row}, {cell.col})
        </p>
        {cell.portalTo !== null ? (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              cell.portalType === "snake"
                ? "border-rose-400/35 bg-rose-500/12 text-rose-100"
                : "border-emerald-400/35 bg-emerald-500/12 text-emerald-100"
            }`}
          >
            {cell.portalType === "snake" ? "Snake" : "Ladder"} -&gt;{" "}
            {cell.portalTo}
          </span>
        ) : (
          <span className="inline-flex rounded-full border border-slate-700/80 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-400">
            Plain square
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Distance
        </span>
        <span className="font-mono text-sm text-slate-100">
          {distance === null ? "--" : distance}
        </span>
      </div>
    </div>
  );
}
