import type { QueueEntry } from "./generateTrace";

type Props = {
  queue: QueueEntry[];
  activeSquare: number | null;
};

export default function FrontierQueue({ queue, activeSquare }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        BFS Queue
      </p>
      {queue.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-5 text-sm text-slate-500">
          The queue is empty right now.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {queue.map((entry, index) => {
            const isActive = entry.square === activeSquare;

            return (
              <div
                key={`${entry.square}-${index}`}
                className={`rounded-xl border px-3 py-3 transition-all ${
                  isActive
                    ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                    : index === 0
                    ? "border-violet-400/35 bg-violet-500/10 text-violet-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">Square {entry.square}</span>
                  <span className="font-mono text-sm">{entry.rolls} rolls</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
