import type { CompletedPath, SumRootTreeNode } from "./generateTrace";

type Props = {
  title: string;
  paths: CompletedPath[];
  nodes: SumRootTreeNode[];
  total: number;
  highlightLeafId?: string | null;
  emptyLabel: string;
  helperText?: string;
};

function formatPath(ids: string[], nodesById: Map<string, SumRootTreeNode>) {
  return ids.map((id) => nodesById.get(id)?.value ?? "?").join("->");
}

export default function CompletedPathsTable({
  title,
  paths,
  nodes,
  total,
  highlightLeafId,
  emptyLabel,
  helperText,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
            {title}
          </span>
          {helperText ? (
            <p className="max-w-xl text-xs leading-6 text-slate-400">
              {helperText}
            </p>
          ) : null}
        </div>

        <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-[11px] font-mono text-slate-300">
          Total: <span className="text-emerald-200">{total}</span>
        </div>
      </div>

      {paths.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-2">
          {paths.map((path, index) => {
            const highlighted =
              highlightLeafId !== undefined
                ? path.leafId === highlightLeafId
                : index === paths.length - 1;

            return (
              <div
                key={`${path.leafId}-${index}`}
                className={`grid gap-3 rounded-[1rem] border px-3 py-3 text-sm transition-all duration-300 md:grid-cols-[minmax(0,1fr)_110px] ${
                  highlighted
                    ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_18px_rgba(52,211,153,0.14)]"
                    : "border-slate-800/80 bg-slate-950/70"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Path
                  </p>
                  <p className="mt-1 font-mono text-slate-100">
                    {formatPath(path.ids, nodesById)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Number
                  </p>
                  <p className="mt-1 font-mono text-emerald-200">
                    {path.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
