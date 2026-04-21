import type { CompleteTreeNode, CountLedgerEntry } from "./generateTrace";

type Props = {
  title: string;
  entries: CountLedgerEntry[];
  nodes: CompleteTreeNode[];
  highlightNodeId: string | null;
  emptyLabel: string;
  helperText: string;
};

export default function CountLedgerTable({
  title,
  entries,
  nodes,
  highlightNodeId,
  emptyLabel,
  helperText,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{helperText}</p>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
          Resolved{" "}
          <span className="font-mono text-emerald-200">{entries.length}</span>
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-4 py-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-[1rem] border border-slate-800/80">
          <div className="grid grid-cols-[1.1fr_0.9fr_0.8fr_0.9fr] gap-3 border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <span>Subtree Root</span>
            <span>Strategy</span>
            <span>Heights</span>
            <span>Count</span>
          </div>
          <div className="divide-y divide-slate-800/80">
            {entries.map((entry) => {
              const nodeValue = nodesById.get(entry.nodeId)?.value ?? "?";
              const highlighted = entry.nodeId === highlightNodeId;

              return (
                <div
                  key={entry.nodeId}
                  className={[
                    "grid grid-cols-[1.1fr_0.9fr_0.8fr_0.9fr] gap-3 px-4 py-3 text-sm transition-colors",
                    highlighted
                      ? "bg-emerald-500/10 text-emerald-50"
                      : "bg-[#06101d] text-slate-200",
                  ].join(" ")}
                >
                  <span className="font-mono">{nodeValue}</span>
                  <span className="capitalize">{entry.strategy}</span>
                  <span className="font-mono">
                    {entry.leftHeight}/{entry.rightHeight}
                  </span>
                  <span className="font-mono text-emerald-200">
                    {entry.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
