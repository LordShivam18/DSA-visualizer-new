import {
  formatRange,
  type ValidateTreeNode,
  type ValidationFrame,
} from "./generateTrace";

type Props = {
  frames: ValidationFrame[];
  nodes: ValidateTreeNode[];
  emptyLabel: string;
};

export default function FrameStack({ frames, nodes, emptyLabel }: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const displayFrames = [...frames].reverse();

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Range Check Stack
        </h3>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-violet-100">
          {frames.length} frame{frames.length === 1 ? "" : "s"}
        </span>
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        Top frame is processed next. Each frame carries all ancestor limits for one node.
      </p>

      {displayFrames.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {displayFrames.map((frame, index) => {
            const node = nodesById.get(frame.id);

            return (
              <div
                key={`${frame.id}-${index}`}
                className={[
                  "rounded-xl border px-3 py-2 transition-all duration-300",
                  index === 0
                    ? "border-violet-400/45 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.16)]"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-200",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    {index === 0 ? "top" : frame.side}
                  </span>
                  <span className="font-mono text-sm">{node?.value ?? "?"}</span>
                  <span className="font-mono text-xs text-cyan-200">
                    {formatRange(frame.low, frame.high)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
