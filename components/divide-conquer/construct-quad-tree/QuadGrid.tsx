import type { GridValue, RegionPointer } from "./generateTrace";

type Props = {
  grid: GridValue[][];
  activeRegion: RegionPointer | null;
  childRegion: RegionPointer | null;
};

function inside(region: RegionPointer | null, row: number, col: number) {
  if (!region) {
    return false;
  }

  return (
    row >= region.row &&
    row < region.row + region.size &&
    col >= region.col &&
    col < region.col + region.size
  );
}

export default function QuadGrid({
  grid,
  activeRegion,
  childRegion,
}: Props) {
  if (grid.length === 0) {
    return (
      <div className="rounded-[1.2rem] border border-dashed border-slate-700/80 px-4 py-10 text-center text-sm text-slate-500">
        Enter a square 0/1 grid to see quadrant splits.
      </div>
    );
  }

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Grid Region View</p>
      <div
        className="mt-4 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const inActive = inside(activeRegion, rowIndex, colIndex);
            const inChild = inside(childRegion, rowIndex, colIndex);

            let toneClass =
              cell === 1
                ? "border-emerald-400/30 bg-emerald-500/14 text-emerald-50"
                : "border-slate-800/80 bg-slate-950/90 text-slate-400";

            if (inActive) {
              toneClass =
                "border-cyan-400/65 bg-cyan-500/14 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.14)]";
            }

            if (inChild) {
              toneClass =
                "border-yellow-400/70 bg-yellow-500/16 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]";
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square rounded-xl border text-center text-lg font-semibold leading-[3rem] transition-all duration-300 ${toneClass}`}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
