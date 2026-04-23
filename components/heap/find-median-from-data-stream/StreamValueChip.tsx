import type { StreamOperation } from "./generateTrace";

type Props = {
  operation: StreamOperation;
  active: boolean;
  output: number | null | undefined;
};

export default function StreamValueChip({ operation, active, output }: Props) {
  const baseClass = active
    ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.14)]"
    : operation.kind === "median"
    ? "border-yellow-400/35 bg-yellow-500/10 text-yellow-100"
    : "border-violet-400/35 bg-violet-500/10 text-violet-100";

  return (
    <div className={`rounded-[1rem] border px-3 py-3 transition-all duration-300 ${baseClass}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {operation.kind}
        </span>
        {operation.kind === "median" && output !== undefined ? (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-200">
            {output === null ? "null" : output}
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-lg font-semibold">{operation.label}</div>
    </div>
  );
}
