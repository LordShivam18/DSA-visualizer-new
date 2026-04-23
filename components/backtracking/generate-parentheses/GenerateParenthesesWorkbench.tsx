import BalanceMeter from "./BalanceMeter";
import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import ResultCloud from "../shared/ResultCloud";
import StatCard from "../shared/StatCard";
import type { GenerateParenthesesTraceStep } from "./generateTrace";

export default function GenerateParenthesesWorkbench({
  step,
}: {
  step: GenerateParenthesesTraceStep;
}) {
  return (
    <PanelShell
      title="Prefix Validity Studio"
      subtitle="The branch only survives if every prefix stays closable into a valid parentheses string."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Pairs" value={step.state.n} tone="violet" />
        <StatCard label="Length" value={step.state.current.length} tone="cyan" />
        <StatCard label="Balance" value={step.state.balance} tone="amber" />
        <StatCard
          label="Results"
          value={step.state.results.length}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Cyan: opening bracket branch" tone="cyan" />
        <LegendPill label="Violet: closing bracket branch" tone="violet" />
        <LegendPill label="Yellow: next character focus" tone="yellow" />
        <LegendPill label="Green: completed string" tone="emerald" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-[#050916] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Current String
              </p>
              <div className="mt-4 flex min-h-[112px] flex-wrap gap-3 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/70 p-4">
                {Array.from({ length: Math.max(step.state.n * 2, 1) }, (_, index) => {
                  const value = step.state.current[index] ?? "";
                  const isFilled = Boolean(value);
                  const isNext = !isFilled && index === step.state.current.length;

                  return (
                    <div
                      key={`paren-slot-${index}`}
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition-all duration-300 ${
                        isNext
                          ? "border-yellow-400/65 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]"
                          : isFilled
                          ? value === "("
                            ? "border-cyan-400/55 bg-cyan-500/12 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.16)]"
                            : "border-violet-400/55 bg-violet-500/12 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.16)]"
                          : "border-slate-800/80 bg-slate-950 text-slate-600"
                      }`}
                    >
                      {value || "_"}
                    </div>
                  );
                })}
              </div>
            </div>

            <BalanceMeter
              openUsed={step.state.openUsed}
              closeUsed={step.state.closeUsed}
              n={step.state.n}
            />
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Next Legal Moves
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div
                className={`rounded-2xl border px-4 py-3 text-2xl font-semibold ${
                  step.state.openUsed < step.state.n
                    ? step.pointers.nextChar === "("
                      ? "border-yellow-400/65 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]"
                      : "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-500"
                }`}
              >
                (
              </div>
              <div
                className={`rounded-2xl border px-4 py-3 text-2xl font-semibold ${
                  step.state.closeUsed < step.state.openUsed
                    ? step.pointers.nextChar === ")"
                      ? "border-yellow-400/65 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]"
                      : "border-violet-400/45 bg-violet-500/10 text-violet-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-500"
                }`}
              >
                )
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="Call Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title: `depth ${frame.depth} | bal ${frame.openUsed - frame.closeUsed}`,
              subtitle: `"${frame.current}"`,
              active: frame.status === "active",
              success: frame.status === "complete",
            }))}
          />

          <ResultCloud
            title="Completed Strings"
            items={step.state.results}
            activeItem={step.state.results[step.state.results.length - 1] ?? null}
            emptyLabel="Well-formed strings will appear here once the length reaches 2n."
            tone="emerald"
          />
        </div>
      </div>
    </PanelShell>
  );
}
