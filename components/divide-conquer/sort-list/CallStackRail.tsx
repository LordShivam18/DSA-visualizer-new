import type { MergeSortFrame, ResolvedSegment } from "./generateTrace";

type Props = {
  frames: MergeSortFrame[];
  resolvedSegments: ResolvedSegment[];
  activeLabel: string | null;
};

export default function CallStackRail({
  frames,
  resolvedSegments,
  activeLabel,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Recursion Stack
        </p>
        <div className="mt-4 space-y-2">
          {frames.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No active recursive calls.
            </div>
          ) : (
            frames
              .slice()
              .reverse()
              .map((frame) => {
                const isActive = frame.label === activeLabel;

                return (
                  <div
                    key={frame.label}
                    className={`rounded-xl border px-3 py-3 ${
                      isActive
                        ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                        : frame.stage === "merge"
                        ? "border-violet-400/35 bg-violet-500/10 text-violet-100"
                        : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{frame.label}</span>
                      <span className="rounded-full border border-slate-700/70 bg-slate-950/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                        {frame.stage}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      depth {frame.depth} • {frame.values.length} node
                      {frame.values.length === 1 ? "" : "s"}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Resolved Runs
        </p>
        <div className="mt-4 space-y-2">
          {resolvedSegments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No sorted run has returned yet.
            </div>
          ) : (
            resolvedSegments.map((segment) => (
              <div
                key={segment.label}
                className={`rounded-xl border px-3 py-3 ${
                  segment.kind === "merged"
                    ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                    : "border-yellow-400/35 bg-yellow-500/10 text-yellow-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{segment.label}</span>
                  <span className="font-mono text-sm">
                    [{segment.values.map((token) => token.value).join(", ")}]
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  depth {segment.depth} • {segment.kind}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
