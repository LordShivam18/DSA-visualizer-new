import type { LastAction } from "./generateTrace";

interface WaterChartProps {
  heights: number[];
  left: number;
  right: number;
  bestLeft: number | null;
  bestRight: number | null;
  maxArea: number;
  currentArea: number;
  lastAction: LastAction | null;
}

export default function WaterChart({
  heights,
  left,
  right,
  bestLeft,
  bestRight,
  maxArea,
  currentArea,
  lastAction,
}: WaterChartProps) {
  const n = heights.length;
  const maxHeight = Math.max(...heights);

  const hasContainer = left < right;

  let waterLeft = 0;
  let waterWidth = 0;
  let waterHeight = 0;

  if (hasContainer) {
    const innerLeftRatio = (left + 0.1) / n;
    const innerRightRatio = (right + 0.9) / n;
    waterLeft = innerLeftRatio * 100;
    waterWidth = (innerRightRatio - innerLeftRatio) * 100;

    const effectiveHeight = Math.min(heights[left], heights[right]);
    waterHeight = (effectiveHeight / maxHeight) * 100;
  }

  const isNewBest = lastAction?.kind === "update-best";

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>
          L = {left}, R = {right}
        </div>
        <div>
          currArea ={" "}
          <span className="text-cyan-300">{currentArea.toString()}</span> ·
          maxArea ={" "}
          <span className="text-emerald-300">{maxArea.toString()}</span>
        </div>
      </div>

      <div className="relative h-72 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-black border border-slate-800/80 overflow-hidden shadow-[0_0_45px_rgba(15,23,42,1)] px-6 pt-8 pb-6">
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#1e293b_0,_transparent_55%)]" />
          <div className="absolute inset-8 border border-slate-800/70 rounded-3xl" />
        </div>

        {/* Water fill area */}
        {hasContainer && (
          <div
            className={`absolute bottom-6 rounded-3xl bg-cyan-500/20 border border-cyan-400/60 backdrop-blur-sm shadow-[0_0_40px_rgba(34,211,238,0.7)] transition-all duration-500 ease-out ${
              isNewBest
                ? "ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-slate-900"
                : ""
            }`}
            style={{
              left: `${waterLeft}%`,
              width: `${waterWidth}%`,
              height: `${waterHeight}%`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/50 via-cyan-400/20 to-transparent opacity-80" />
            <div className="absolute inset-x-0 top-0 h-[3px] bg-cyan-200/80 blur-[2px]" />
          </div>
        )}

        {/* Bars */}
        <div className="relative h-full flex items-end justify-between gap-2">
          {heights.map((h, idx) => {
            const isLeft = idx === left;
            const isRight = idx === right;
            const isBest =
              bestLeft !== null &&
              bestRight !== null &&
              (idx === bestLeft || idx === bestRight);

            const barHeight = (h / maxHeight) * 100;

            const base =
              "w-7 md:w-8 rounded-2xl border transition-all duration-500 ease-out translate-y-0";
            let color =
              "bg-slate-800/80 border-slate-700 shadow-[0_0_8px_rgba(15,23,42,0.8)]";

            if (isBest) {
              color =
                "bg-gradient-to-t from-amber-500/30 via-amber-400/20 to-slate-900 border-amber-400/80 shadow-[0_0_28px_rgba(251,191,36,0.9)]";
            }

            if (isLeft) {
              color =
                "bg-gradient-to-t from-cyan-500/40 via-cyan-400/30 to-slate-900 border-cyan-400 shadow-[0_0_32px_rgba(34,211,238,0.9)]";
            }

            if (isRight) {
              color =
                "bg-gradient-to-t from-fuchsia-500/40 via-fuchsia-400/30 to-slate-900 border-fuchsia-400 shadow-[0_0_32px_rgba(232,121,249,0.9)]";
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-end gap-2 flex-1"
              >
                <div
                  className={`${base} ${color}`}
                  style={{ height: `${barHeight}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {idx}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pointer chips */}
        <div className="absolute left-6 top-4 flex gap-2 text-[11px] font-mono">
          <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/70 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            L = {left}
          </div>
          <div className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/70 text-fuchsia-200 shadow-[0_0_20px_rgba(232,121,249,0.7)]">
            R = {right}
          </div>
        </div>
      </div>
    </div>
  );
}
