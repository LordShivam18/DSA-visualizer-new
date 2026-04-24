import type { MinimumWindowSubstringTraceStep } from "./generateTrace";

function statValue(step: MinimumWindowSubstringTraceStep, label: string) {
  return step.state.stats.find((stat) => stat.label === label)?.value ?? "0";
}

export default function CoverageRadar({
  step,
}: {
  step: MinimumWindowSubstringTraceStep;
}) {
  const coverage = statValue(step, "Coverage");
  const [formedRaw, requiredRaw] = coverage.split("/");
  const formed = Number(formedRaw ?? 0);
  const required = Number(requiredRaw ?? 0);
  const ratio = required > 0 ? Math.round((formed / required) * 100) : 100;
  const missing = step.state.ledgerEntries.filter(
    (entry) => Number(entry.have ?? "0") < Number(entry.need ?? "0")
  );

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Coverage Radar
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            The window is only valid when every requirement lights up
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            formed === required && required > 0
              ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
              : "border-yellow-400/35 bg-yellow-500/10 text-yellow-100"
          }`}
        >
          coverage {coverage}
        </span>
      </div>

      <div className="mt-5 rounded-[1.1rem] border border-slate-800/80 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
          <span>Requirement satisfaction</span>
          <span className="font-mono text-lg text-slate-50">{ratio}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full border border-slate-800 bg-[#07151b]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(250,204,21,0.65),rgba(52,211,153,0.85),rgba(34,211,238,0.75))] transition-all duration-300"
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {missing.length === 0 ? (
          <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
            window currently covers all requirements
          </span>
        ) : (
          missing.map((entry) => (
            <span
              key={entry.id}
              className="rounded-full border border-yellow-400/35 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-100"
            >
              {entry.key}: need {entry.need}, have {entry.have}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
