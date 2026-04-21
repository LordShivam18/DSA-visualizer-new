import {
  formatRange,
  type ValidateTreeNode,
  type ValidationRecord,
} from "./generateTrace";

type Props = {
  records: ValidationRecord[];
  nodes: ValidateTreeNode[];
  invalidId?: string | null;
};

export default function ValidationLedger({
  records,
  nodes,
  invalidId = null,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Bound Check Ledger
        </h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
          strict ranges
        </span>
      </div>

      {records.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          No node has been checked yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {records.map((record, index) => {
            const node = nodesById.get(record.id);
            const activeInvalid = invalidId === record.id;

            return (
              <div
                key={`${record.id}-${index}`}
                className={[
                  "rounded-[1rem] border p-3 transition-all duration-300",
                  !record.valid || activeInvalid
                    ? "border-rose-400/45 bg-rose-500/10 shadow-[0_0_22px_rgba(251,113,133,0.16)]"
                    : "border-emerald-400/35 bg-emerald-500/10",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    check {index + 1}
                  </span>
                  <span className="font-mono text-sm text-cyan-100">
                    {node?.value ?? record.value}
                  </span>
                  <span className="font-mono text-xs text-slate-300">
                    in {formatRange(record.low, record.high)}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                      record.valid
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                        : "border-rose-400/40 bg-rose-500/10 text-rose-100"
                    }`}
                  >
                    {record.valid ? "pass" : "fail"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {record.reason}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
