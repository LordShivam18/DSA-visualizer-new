import type { LengthOfLastWordTraceStep } from "./generateTrace";

export default function LastWordGauge({
  step,
}: {
  step: LengthOfLastWordTraceStep;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-[1.1rem] border border-cyan-400/35 bg-cyan-500/10 p-4 text-cyan-50">
        <p className="text-xs uppercase tracking-[0.2em] opacity-75">Phase</p>
        <p className="mt-2 text-2xl font-semibold">{step.state.phase}</p>
      </div>
      <div className="rounded-[1.1rem] border border-emerald-400/35 bg-emerald-500/10 p-4 text-emerald-50">
        <p className="text-xs uppercase tracking-[0.2em] opacity-75">Last Word</p>
        <p className="mt-2 break-all font-mono text-2xl font-semibold">
          {step.state.lastWord || "-"}
        </p>
      </div>
      <div className="rounded-[1.1rem] border border-violet-400/35 bg-violet-500/10 p-4 text-violet-50">
        <p className="text-xs uppercase tracking-[0.2em] opacity-75">Length</p>
        <p className="mt-2 text-2xl font-semibold">{step.state.length}</p>
      </div>
    </div>
  );
}
