import type { Coord } from "./generateTrace";

type Props = {
  value: number;
  row: number;
  col: number;
  flatIndex: number;
  searchLeft: number;
  searchRight: number;
  midIndex: number | null;
  resultCoord: Coord | null;
};

export default function MatrixCell({
  value,
  row,
  col,
  flatIndex,
  searchLeft,
  searchRight,
  midIndex,
  resultCoord,
}: Props) {
  const inRange = flatIndex >= searchLeft && flatIndex <= searchRight;
  const isMid = midIndex === flatIndex;
  const isFound =
    resultCoord !== null && resultCoord.row === row && resultCoord.col === col;

  const tone = isFound
    ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.28)]"
    : isMid
    ? "border-yellow-400/60 bg-yellow-500/15 text-yellow-100 shadow-[0_0_24px_rgba(251,191,36,0.26)]"
    : inRange
    ? "border-cyan-400/30 bg-cyan-500/8 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
    : "border-slate-800/80 bg-slate-950/55 text-slate-500";

  return (
    <div
      className={`relative min-h-[92px] rounded-[1.1rem] border p-3 transition-all duration-300 ${tone}`}
    >
      <div className="flex items-start justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
        <span>
          r{row} c{col}
        </span>
        <span>#{flatIndex}</span>
      </div>

      <div className="mt-4 text-center text-2xl font-semibold">{value}</div>

      {isMid ? (
        <div className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-200">
          Mid
        </div>
      ) : isFound ? (
        <div className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
          Found
        </div>
      ) : inRange ? (
        <div className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-cyan-200">
          Active
        </div>
      ) : (
        <div className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-slate-600">
          Discarded
        </div>
      )}
    </div>
  );
}
