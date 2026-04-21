import type { RightViewLevelSummary } from "./generateTrace";

type Props = {
  title: string;
  summaries: RightViewLevelSummary[];
  emptyLabel: string;
  helperText?: string;
  highlightId?: string | null;
};

export default function RightViewStrip({
  title,
  summaries,
  emptyLabel,
  helperText,
  highlightId = null,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-100">
          {summaries.length} visible
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
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {summaries.map((summary) => {
            const isHighlight = summary.visibleId === highlightId;

            return (
              <div
                key={`${summary.level}-${summary.visibleId}`}
                className={[
                  "rounded-xl border px-3 py-2 transition-all duration-300",
                  isHighlight
                    ? "border-emerald-400/40 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.18)]"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    L{summary.level}
                  </span>
                  <span className="font-mono text-sm text-emerald-100">
                    {summary.visibleValue}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    width {summary.width}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
