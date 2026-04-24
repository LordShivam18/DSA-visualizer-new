import type { RomanToIntegerTraceStep } from "./generateTrace";

export default function RomanGlyphStrip({
  step,
}: {
  step: RomanToIntegerTraceStep;
}) {
  const activeIndex = step.pointers.index;
  const lookahead = step.pointers.lookahead;

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Roman Glyph Strip
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Cyan is the current symbol, yellow is the lookahead, and green marks
            symbols whose contribution has already been committed.
          </p>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
          {step.state.roman.length} symbol
          {step.state.roman.length === 1 ? "" : "s"}
        </span>
      </div>

      {step.state.roman.length === 0 ? (
        <div className="rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-8 text-center text-sm text-slate-500">
          Enter a Roman numeral such as <span className="font-mono">MCMXCIV</span>.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {step.state.roman.map((symbol, index) => {
            const processed =
              activeIndex === null ? true : index < Math.max(activeIndex, 0);

            let tone =
              "border-slate-700/80 bg-slate-950/70 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.4)]";
            if (processed) {
              tone =
                "border-emerald-400/45 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
            }
            if (lookahead === index) {
              tone =
                "border-amber-400/55 bg-amber-500/10 text-amber-50 shadow-[0_0_26px_rgba(245,158,11,0.18)]";
            }
            if (activeIndex === index) {
              tone =
                "border-cyan-400/65 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.22)]";
            }

            const tags: string[] = [];
            if (activeIndex === index) tags.push("curr");
            if (lookahead === index) tags.push("next");
            if (processed) tags.push("counted");

            return (
              <div
                key={`${symbol}-${index}`}
                className={`min-w-[92px] flex-1 rounded-[1rem] border px-3 py-3 transition-all ${tone}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                    idx {index}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-3xl font-semibold">{symbol}</div>
                  <div className="mt-2 font-mono text-sm opacity-75">
                    value {step.state.values[index]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
