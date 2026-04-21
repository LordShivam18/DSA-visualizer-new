import { formatCoord, type Coord } from "./generateTrace";

type Props = {
  title: string;
  frontier: Coord[];
  active: Coord | null;
  emptyLabel: string;
};

export default function FrontierQueue({
  title,
  frontier,
  active,
  emptyLabel,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Border-connected O cells wait here until BFS expands them.
          </p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {frontier.length}
        </span>
      </div>

      {frontier.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-6 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {frontier.map((coord, index) => {
            const isActive =
              active?.row === coord.row && active?.col === coord.col;

            return (
              <div
                key={`${coord.row}-${coord.col}-${index}`}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 transition-all ${
                  isActive
                    ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.14)]"
                    : index === 0
                    ? "border-violet-400/35 bg-violet-500/10 text-violet-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <span className="font-mono text-sm">{formatCoord(coord)}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {isActive ? "current" : index === 0 ? "front" : "queued"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
