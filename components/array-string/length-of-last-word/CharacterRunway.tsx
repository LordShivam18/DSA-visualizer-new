import type { LengthOfLastWordTraceStep } from "./generateTrace";

function renderChar(char: string) {
  return char === " " ? "·" : char;
}

export default function CharacterRunway({
  step,
}: {
  step: LengthOfLastWordTraceStep;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Reverse Scan Runway
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Spaces are drawn as middots. Cyan marks the current cursor, red shows
          trimmed tail spaces, and green marks the last word being counted.
        </p>
      </div>

      {step.state.chars.length === 0 ? (
        <div className="rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-8 text-center text-sm text-slate-500">
          Enter a sentence like <span className="font-mono">Hello World</span>.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {step.state.chars.map((char, index) => {
            const inWord =
              step.state.wordStart !== null &&
              step.state.wordEnd !== null &&
              index >= step.state.wordStart &&
              index <= step.state.wordEnd;
            const trimmed =
              step.state.wordEnd !== null && index > step.state.wordEnd;

            let tone =
              "border-slate-700/80 bg-slate-950/70 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.4)]";
            if (trimmed) {
              tone =
                "border-rose-400/40 bg-rose-500/10 text-rose-50 shadow-[0_0_24px_rgba(244,63,94,0.16)]";
            }
            if (inWord) {
              tone =
                "border-emerald-400/45 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
            }
            if (step.pointers.index === index) {
              tone =
                "border-cyan-400/65 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.22)]";
            }

            return (
              <div
                key={`${char}-${index}`}
                className={`min-w-[72px] flex-1 rounded-[1rem] border px-3 py-3 text-center transition-all ${tone}`}
              >
                <div className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                  idx {index}
                </div>
                <div className="mt-3 font-mono text-3xl font-semibold">
                  {renderChar(char)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
