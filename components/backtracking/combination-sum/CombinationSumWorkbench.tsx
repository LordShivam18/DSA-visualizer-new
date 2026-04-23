import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import ResultCloud from "../shared/ResultCloud";
import StatCard from "../shared/StatCard";
import TargetMeter from "./TargetMeter";
import type { CombinationSumTraceStep } from "./generateTrace";

export default function CombinationSumWorkbench({
  step,
}: {
  step: CombinationSumTraceStep;
}) {
  return (
    <PanelShell
      title="Target-Chasing Search"
      subtitle="This branch search keeps subtracting from the remaining target, and it may reuse the same candidate as long as the remainder stays non-negative."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Target" value={step.state.target} tone="violet" />
        <StatCard label="Current Sum" value={step.state.currentSum} tone="cyan" />
        <StatCard label="Remaining" value={step.state.remaining} tone="amber" />
        <StatCard
          label="Solutions"
          value={step.state.results.length}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Yellow: candidate under test" tone="yellow" />
        <LegendPill label="Green: value already chosen" tone="emerald" />
        <LegendPill label="Purple: candidate still available" tone="violet" />
        <LegendPill label="Red: overshoot prune" tone="rose" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-[#050916] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Current Path
              </p>
              <div className="mt-4 flex min-h-[112px] flex-wrap gap-3 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/70 p-4">
                {step.state.path.length === 0 ? (
                  <span className="text-sm text-slate-500">
                    No candidates chosen yet.
                  </span>
                ) : (
                  step.state.path.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/55 bg-emerald-500/12 text-2xl font-semibold text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                    >
                      {value}
                    </div>
                  ))
                )}
              </div>
            </div>

            <TargetMeter
              currentSum={step.state.currentSum}
              target={step.state.target}
              remaining={step.state.remaining}
            />
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Candidate Rail
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {step.state.candidates.map((value, index) => {
                const countInPath = step.state.path.filter((item) => item === value).length;
                const isCandidate = step.pointers.candidateIndex === index;
                const isChosen = countInPath > 0;
                const isAvailable =
                  step.pointers.startIndex !== null && index >= step.pointers.startIndex;

                return (
                  <div
                    key={`${value}-${index}`}
                    className={`rounded-[1.1rem] border px-4 py-3 transition-all duration-300 ${
                      isCandidate && step.state.remaining < value
                        ? "border-rose-400/60 bg-rose-500/12 text-rose-50 shadow-[0_0_22px_rgba(251,113,133,0.16)]"
                        : isCandidate
                        ? "border-yellow-400/65 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]"
                        : isChosen
                        ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                        : isAvailable
                        ? "border-violet-400/45 bg-violet-500/10 text-violet-100"
                        : "border-slate-800/80 bg-slate-950/70 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">{value}</span>
                      {countInPath > 0 ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                          x{countInPath}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="Call Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title: `start ${frame.startIndex} | rem ${frame.remaining}`,
              subtitle: `path [${frame.path.join(", ")}]`,
              active: frame.status === "active",
              success: frame.status === "complete",
              danger: frame.status === "overshoot",
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
            emptyLabel="Exact target hits will appear here once the remainder reaches zero."
            tone="emerald"
          />
        </div>
      </div>
    </PanelShell>
  );
}
