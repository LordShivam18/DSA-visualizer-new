type Props = {
  gene: string;
  toneClass: string;
  label: string;
  badges?: string[];
  highlightIndices?: number[];
  footer?: string;
};

export default function GeneSequence({
  gene,
  toneClass,
  label,
  badges = [],
  highlightIndices = [],
  footer,
}: Props) {
  const highlightSet = new Set(highlightIndices);

  return (
    <div className={`rounded-[1.15rem] border p-4 transition-all duration-300 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-mono text-lg text-slate-50">{gene || "--"}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {badges.map((badge) => (
            <span
              key={`${label}-${badge}`}
              className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-8 gap-2">
        {(gene || "--------").split("").map((char, index) => (
          <div
            key={`${label}-${index}`}
            className={`rounded-xl border px-0 py-2 text-center font-mono text-sm transition-all ${
              highlightSet.has(index)
                ? "border-yellow-400/50 bg-yellow-500/12 text-yellow-50 shadow-[0_0_18px_rgba(250,204,21,0.16)]"
                : "border-slate-800/80 bg-slate-950/70 text-slate-200"
            }`}
          >
            {char}
          </div>
        ))}
      </div>

      {footer ? (
        <p className="mt-3 text-xs text-slate-400">{footer}</p>
      ) : null}
    </div>
  );
}
