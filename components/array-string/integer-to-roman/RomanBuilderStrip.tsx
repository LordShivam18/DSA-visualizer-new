import type { IntegerToRomanTraceStep } from "./generateTrace";

export default function RomanBuilderStrip({
  step,
}: {
  step: IntegerToRomanTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Minted Fragments
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Each green chip is a Roman fragment already committed to the output.
        </p>
      </div>

      {step.state.fragments.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
          No fragments minted yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            {step.state.fragments.map((fragment, index) => (
              <div
                key={`${fragment.symbol}-${index}`}
                className="rounded-[1rem] border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]"
              >
                <div className="text-center">
                  <div className="text-2xl font-semibold">{fragment.symbol}</div>
                  <div className="mt-1 font-mono text-xs opacity-80">
                    {fragment.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[1rem] border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-cyan-50">
            <p className="text-xs uppercase tracking-[0.18em] opacity-75">
              Current Output
            </p>
            <p className="mt-2 break-all font-mono text-xl">{step.state.output}</p>
          </div>
        </div>
      )}
    </div>
  );
}
