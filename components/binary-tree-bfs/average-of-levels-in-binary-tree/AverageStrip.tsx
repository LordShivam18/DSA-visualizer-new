import {
  formatAverage,
  type AverageTreeNode,
  type LevelAverageSummary,
} from "./generateTrace";

type Props = {
  title: string;
  summaries: LevelAverageSummary[];
  nodes: AverageTreeNode[];
  emptyLabel: string;
  helperText?: string;
  highlightLevel?: number | null;
};

export default function AverageStrip({
  title,
  summaries,
  nodes,
  emptyLabel,
  helperText,
  highlightLevel = null,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-100">
          {summaries.length} level{summaries.length === 1 ? "" : "s"}
        </span>
      </div>

      {helperText ? (
        <p className="mt-2 text-xs leading-6 text-slate-400">{helperText}</p>
      ) : null}

      {summaries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {summaries.map((summary) => {
            const values = summary.nodeIds.map(
              (id) => nodesById.get(id)?.value ?? "?"
            );
            const isHighlight = highlightLevel === summary.level;

            return (
              <div
                key={`level-${summary.level}`}
                className={[
                  "rounded-[1.05rem] border p-4 transition-all duration-300",
                  isHighlight
                    ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.18)]"
                    : "border-slate-800/80 bg-slate-950/70",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Level {summary.level}
                  </span>
                  <span className="font-mono text-sm text-slate-100">
                    [{values.join(", ")}]
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      Sum
                    </p>
                    <p className="mt-1 font-mono text-sm text-cyan-200">
                      {summary.sum}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      Count
                    </p>
                    <p className="mt-1 font-mono text-sm text-violet-200">
                      {summary.count}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      Average
                    </p>
                    <p className="mt-1 font-mono text-sm text-emerald-200">
                      {formatAverage(summary.average)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
