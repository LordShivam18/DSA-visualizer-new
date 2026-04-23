import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import ResultCloud from "../shared/ResultCloud";
import StatCard from "../shared/StatCard";
import NumberPool from "./NumberPool";
import type { CombinationsTraceStep } from "./generateTrace";

export default function CombinationsWorkbench({
  step,
}: {
  step: CombinationsTraceStep;
}) {
  return (
    <PanelShell
      title="Subset Builder"
      subtitle="The start pointer keeps choices increasing, which means each combination appears exactly once."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="n" value={step.state.n} tone="violet" />
        <StatCard label="k" value={step.state.k} tone="cyan" />
        <StatCard label="Path Size" value={step.state.path.length} tone="amber" />
        <StatCard
          label="Results"
          value={step.state.results.length}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Yellow: number under test" tone="yellow" />
        <LegendPill label="Green: already chosen" tone="emerald" />
        <LegendPill label="Purple: still available" tone="violet" />
        <LegendPill label="Cyan: active recursion state" tone="cyan" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="rounded-[1.25rem] border border-slate-800/80 bg-[#050916] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Current Combination Slots
            </p>
            <div className="mt-4 flex min-h-[112px] flex-wrap gap-3 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/70 p-4">
              {Array.from({ length: Math.max(step.state.k, 1) }, (_, index) => {
                const value = step.state.path[index];
                const isFilled = value !== undefined;

                return (
                  <div
                    key={`slot-${index}`}
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition-all duration-300 ${
                      isFilled
                        ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                        : "border-slate-800/80 bg-slate-950 text-slate-600"
                    }`}
                  >
                    {isFilled ? value : "_"}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-200">
              path = [{step.state.path.join(", ")}]
            </div>
          </div>

          <NumberPool
            n={step.state.n}
            path={step.state.path}
            start={step.pointers.start}
            candidate={step.pointers.candidate}
          />
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="Call Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title: `start ${frame.start}`,
              subtitle: `path [${frame.path.join(", ")}]`,
              active: frame.status === "active",
              success: frame.status === "complete",
            }))}
          />

          <ResultCloud
            title="Completed Combinations"
            items={step.state.results.map((entry) => `[${entry.join(",")}]`)}
            activeItem={
              step.state.results.length > 0
                ? `[${step.state.results[step.state.results.length - 1].join(",")}]`
                : null
            }
            emptyLabel="Finished subsets will appear here as soon as the base case is reached."
            tone="emerald"
          />
        </div>
      </div>
    </PanelShell>
  );
}
