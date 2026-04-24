import type { ReverseWordsTraceStep } from "./generateTrace";

function renderSource(source: string) {
  return source.length === 0 ? "(empty)" : source.replace(/ /g, "·");
}

export default function SentenceRibbon({
  step,
}: {
  step: ReverseWordsTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Sentence Normalizer
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          The raw input is shown with middots for spaces. Clean tokens are the
          only pieces that survive into the reversed sentence.
        </p>
      </div>

      <div className="mt-4 rounded-[1rem] border border-slate-700/80 bg-slate-950/80 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Raw Input
        </p>
        <p className="mt-2 break-all font-mono text-sm text-slate-200">
          {renderSource(step.state.source)}
        </p>
      </div>

      <div className="mt-4 rounded-[1rem] border border-slate-700/80 bg-slate-950/80 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Normalized Tokens
        </p>
        {step.state.allTokens.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No clean words found.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {step.state.allTokens.map((word, index) => {
              let tone =
                "border-slate-700/80 bg-slate-950/75 text-slate-200 shadow-[0_0_18px_rgba(15,23,42,0.4)]";
              if (step.state.extracted.length > index) {
                tone =
                  "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]";
              }
              if (step.pointers.sourceIndex === index) {
                tone =
                  "border-cyan-400/60 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.2)]";
              }
              if (step.pointers.buildIndex === index) {
                tone =
                  "border-amber-400/55 bg-amber-500/12 text-amber-50 shadow-[0_0_28px_rgba(245,158,11,0.2)]";
              }

              return (
                <div
                  key={`${word}-${index}`}
                  className={`rounded-[0.95rem] border px-3 py-2 transition-all ${tone}`}
                >
                  <span className="font-mono text-sm">{word}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
