import type { LongestCommonPrefixTraceStep } from "./generateTrace";

export default function PrefixRibbon({
  step,
}: {
  step: LongestCommonPrefixTraceStep;
}) {
  const chars = step.state.prefix.split("");

  return (
    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="rounded-[1.1rem] border border-cyan-400/35 bg-cyan-500/10 p-4 text-cyan-50">
        <p className="text-xs uppercase tracking-[0.2em] opacity-75">Candidate</p>
        <p className="mt-2 font-mono text-3xl font-semibold">
          {step.state.candidateChar || "-"}
        </p>
      </div>
      <div className="rounded-[1.1rem] border border-emerald-400/35 bg-emerald-500/10 p-4 text-emerald-50">
        <p className="text-xs uppercase tracking-[0.2em] opacity-75">Accepted Prefix</p>
        {chars.length === 0 ? (
          <p className="mt-2 text-sm text-emerald-100/75">No confirmed prefix yet.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {chars.map((char, index) => (
              <div
                key={`${char}-${index}`}
                className="rounded-[0.9rem] border border-emerald-300/35 bg-emerald-400/10 px-3 py-2 text-center shadow-[0_0_20px_rgba(52,211,153,0.16)]"
              >
                <span className="font-mono text-xl font-semibold">{char}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
