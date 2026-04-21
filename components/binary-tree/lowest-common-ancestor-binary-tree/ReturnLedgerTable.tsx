import type { LcaTreeNode, ReturnLedgerEntry } from "./generateTrace";

type Props = {
  title: string;
  entries: ReturnLedgerEntry[];
  nodes: LcaTreeNode[];
  highlightNodeId: string | null;
  emptyLabel: string;
  helperText: string;
};

function labelOf(nodesById: Map<string, LcaTreeNode>, id: string | null) {
  if (!id) {
    return "null";
  }

  return String(nodesById.get(id)?.value ?? "?");
}

export default function ReturnLedgerTable({
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
          Returns{" "}
          <span className="font-mono text-emerald-200">{entries.length}</span>
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-4 py-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-[1rem] border border-slate-800/80">
          <div className="grid grid-cols-[0.95fr_0.9fr_0.9fr_0.95fr_1fr] gap-3 border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <span>Subtree</span>
            <span>Left</span>
            <span>Right</span>
            <span>Returned</span>
            <span>Reason</span>
          </div>
          <div className="divide-y divide-slate-800/80">
            {entries.map((entry) => {
              const highlighted = entry.nodeId === highlightNodeId;

              return (
                <div
                  key={entry.nodeId}
                  className={[
                    "grid grid-cols-[0.95fr_0.9fr_0.9fr_0.95fr_1fr] gap-3 px-4 py-3 text-sm transition-colors",
                    highlighted
                      ? "bg-emerald-500/10 text-emerald-50"
                      : "bg-[#06101d] text-slate-200",
                  ].join(" ")}
                >
                  <span className="font-mono">{labelOf(nodesById, entry.nodeId)}</span>
                  <span className="font-mono">{labelOf(nodesById, entry.leftReturnId)}</span>
                  <span className="font-mono">{labelOf(nodesById, entry.rightReturnId)}</span>
                  <span className="font-mono text-emerald-200">
                    {labelOf(nodesById, entry.resultId)}
                  </span>
                  <span className="capitalize">{entry.reason.replace("-", " ")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
