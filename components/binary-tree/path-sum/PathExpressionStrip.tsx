import type { PathSumTreeNode } from "./generateTrace";

type Accent = "amber" | "cyan" | "emerald" | "red" | "violet" | "yellow";

type Props = {
  title: string;
  ids: string[];
  nodes: PathSumTreeNode[];
  accent: Accent;
  emptyLabel: string;
  helperText?: string;
  showSum?: boolean;
};

const accentClasses: Record<
  Accent,
  {
    chip: string;
    box: string;
    operator: string;
    total: string;
  }
> = {
  amber: {
    chip: "border-amber-400/40 bg-amber-500/10 text-amber-100",
    box: "border-amber-400/40 bg-amber-500/10 text-amber-50 shadow-[0_0_16px_rgba(251,191,36,0.16)]",
    operator: "text-amber-300/80",
    total: "text-amber-100",
  },
  cyan: {
    chip: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
    box: "border-cyan-400/40 bg-cyan-500/10 text-cyan-50 shadow-[0_0_16px_rgba(34,211,238,0.16)]",
    operator: "text-cyan-300/80",
    total: "text-cyan-100",
  },
  emerald: {
    chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
    box: "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_16px_rgba(52,211,153,0.16)]",
    operator: "text-emerald-300/80",
    total: "text-emerald-100",
  },
  red: {
    chip: "border-rose-400/40 bg-rose-500/10 text-rose-100",
    box: "border-rose-400/40 bg-rose-500/10 text-rose-50 shadow-[0_0_16px_rgba(251,113,133,0.16)]",
    operator: "text-rose-300/80",
    total: "text-rose-100",
  },
  violet: {
    chip: "border-violet-400/40 bg-violet-500/10 text-violet-100",
    box: "border-violet-400/40 bg-violet-500/10 text-violet-50 shadow-[0_0_16px_rgba(167,139,250,0.16)]",
    operator: "text-violet-300/80",
    total: "text-violet-100",
  },
  yellow: {
    chip: "border-yellow-400/40 bg-yellow-500/10 text-yellow-100",
    box: "border-yellow-400/40 bg-yellow-500/10 text-yellow-50 shadow-[0_0_16px_rgba(250,204,21,0.16)]",
    operator: "text-yellow-300/80",
    total: "text-yellow-100",
  },
};

export default function PathExpressionStrip({
  title,
  ids,
  nodes,
  accent,
  emptyLabel,
  helperText,
  showSum = true,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const values = ids
    .map((id) => nodesById.get(id)?.value)
    .filter((value): value is number => typeof value === "number");
  const total = values.reduce((sum, value) => sum + value, 0);
  const palette = accentClasses[accent];

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${palette.chip}`}
          >
            {title}
          </span>
          {helperText ? (
            <p className="max-w-xl text-xs leading-6 text-slate-400">
              {helperText}
            </p>
          ) : null}
        </div>

        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-[11px] font-mono text-slate-300">
          {ids.length}
        </span>
      </div>

      {ids.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {values.map((value, index) => (
              <div key={`${title}-${index}-${value}`} className="flex items-center gap-2">
                <div
                  className={`min-w-10 rounded-xl border px-3 py-2 text-center font-mono text-sm transition-all duration-300 ${palette.box}`}
                >
                  {value}
                </div>

                {index < values.length - 1 ? (
                  <span className={`text-sm ${palette.operator}`}>+</span>
                ) : null}
              </div>
            ))}

            {showSum ? (
              <>
                <span className={`text-sm ${palette.operator}`}>=</span>
                <div
                  className={`rounded-xl border border-slate-700/80 bg-slate-950/75 px-3 py-2 font-mono text-sm ${palette.total}`}
                >
                  {total}
                </div>
              </>
            ) : null}
          </div>

          <p className="font-mono text-xs text-slate-500">
            {values.join(" -> ")}
          </p>
        </div>
      )}
    </div>
  );
}
