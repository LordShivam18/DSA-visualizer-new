import type { GridValue } from "./generateTrace";

type Props = {
  row: number;
  col: number;
  value: GridValue;
  toneClass: string;
  tags: string[];
  islandId: number | null;
};

export default function GridCell({
  row,
  col,
  value,
  toneClass,
  tags,
  islandId,
}: Props) {
  return (
    <div
      className={`relative flex aspect-square min-h-[72px] flex-col justify-between overflow-hidden rounded-[1rem] border px-3 py-2 transition-all duration-300 ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
          {row},{col}
        </span>
        {islandId !== null ? (
          <span className="rounded-full border border-white/10 bg-slate-950/40 px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] text-slate-200">
            I{islandId}
          </span>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="font-mono text-3xl font-semibold">{value}</span>
        <div className="flex flex-wrap justify-end gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-slate-950/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
