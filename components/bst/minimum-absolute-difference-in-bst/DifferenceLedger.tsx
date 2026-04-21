import {
  formatDiff,
  type DifferenceRecord,
  type MinDiffTreeNode,
} from "./generateTrace";

type Props = {
  records: DifferenceRecord[];
  nodes: MinDiffTreeNode[];
  bestPairIds?: [string, string] | null;
};

export default function DifferenceLedger({
  records,
  nodes,
  bestPairIds = null,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Difference Ledger
        </h3>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-yellow-100">
          adjacent pairs
        </span>
      </div>

      {records.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          The first comparison appears after two inorder values are visited.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {records.map((record, index) => {
            const prev = nodesById.get(record.prevId);
            const current = nodesById.get(record.currentId);
            const isBest =
              bestPairIds?.[0] === record.prevId &&
              bestPairIds?.[1] === record.currentId;

            return (
              <div
                key={`${record.prevId}-${record.currentId}-${index}`}
                className={[
                  "rounded-[1rem] border p-3 transition-all duration-300",
                  isBest
                    ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                    : "border-slate-800/80 bg-slate-950/70",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    pair {index + 1}
                  </span>
                  <span className="font-mono text-sm text-cyan-100">
                    {current?.value ?? "?"} - {prev?.value ?? "?"} ={" "}
                    {record.diff}
                  </span>
                  {isBest ? (
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-100">
                      best
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  best after this pair:{" "}
                  <span className="font-mono text-emerald-200">
                    {formatDiff(record.bestAfter)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
