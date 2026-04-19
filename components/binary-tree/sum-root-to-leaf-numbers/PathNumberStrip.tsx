import type { SumRootTreeNode } from "./generateTrace";

type Accent = "amber" | "cyan" | "emerald" | "violet" | "yellow";

type Props = {
  title: string;
  ids: string[];
  nodes: SumRootTreeNode[];
  accent: Accent;
  emptyLabel: string;
  helperText?: string;
};

const accentClasses: Record<
  Accent,
  {
    chip: string;
    box: string;
    arrow: string;
    number: string;
  }
> = {
  amber: {
    chip: "border-amber-400/40 bg-amber-500/10 text-amber-100",
    box: "border-amber-400/40 bg-amber-500/10 text-amber-50 shadow-[0_0_16px_rgba(251,191,36,0.16)]",
    arrow: "text-amber-300/80",
    number: "text-amber-100",
  },
  cyan: {
    chip: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
    box: "border-cyan-400/40 bg-cyan-500/10 text-cyan-50 shadow-[0_0_16px_rgba(34,211,238,0.16)]",
    arrow: "text-cyan-300/80",
    number: "text-cyan-100",
  },
  emerald: {
    chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
    box: "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_16px_rgba(52,211,153,0.16)]",
    arrow: "text-emerald-300/80",
    number: "text-emerald-100",
  },
  violet: {
    chip: "border-violet-400/40 bg-violet-500/10 text-violet-100",
    box: "border-violet-400/40 bg-violet-500/10 text-violet-50 shadow-[0_0_16px_rgba(167,139,250,0.16)]",
    arrow: "text-violet-300/80",
    number: "text-violet-100",
  },
  yellow: {
    chip: "border-yellow-400/40 bg-yellow-500/10 text-yellow-100",
    box: "border-yellow-400/40 bg-yellow-500/10 text-yellow-50 shadow-[0_0_16px_rgba(250,204,21,0.16)]",
    arrow: "text-yellow-300/80",
    number: "text-yellow-100",
  },
};

export default function PathNumberStrip({
  title,
  ids,
  nodes,
  accent,
  emptyLabel,
  helperText,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const digits = ids
    .map((id) => nodesById.get(id)?.value)
    .filter((value): value is number => typeof value === "number");
  const builtNumber = digits.length === 0 ? "0" : digits.join("");
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
          {digits.length}
        </span>
      </div>

      {digits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {digits.map((digit, index) => (
              <div key={`${title}-${index}-${digit}`} className="flex items-center gap-2">
                <div
                  className={`min-w-10 rounded-xl border px-3 py-2 text-center font-mono text-sm transition-all duration-300 ${palette.box}`}
                >
                  {digit}
                </div>

                {index < digits.length - 1 ? (
                  <span className={`text-sm ${palette.arrow}`}>-&gt;</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Number:</span>
            <span className={`font-mono text-lg ${palette.number}`}>
              {builtNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
