import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import ResultCloud from "../shared/ResultCloud";
import StatCard from "../shared/StatCard";
import PermutationSlots from "./PermutationSlots";
import type { PermutationsTraceStep } from "./generateTrace";

export default function PermutationsWorkbench({
  step,
}: {
  step: PermutationsTraceStep;
}) {
  return (
    <PanelShell
      title="Permutation Forge"
      subtitle="Every depth fills the next slot, and the used-mask prevents any index from appearing twice in one arrangement."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Items" value={step.state.nums.length} tone="violet" />
        <StatCard label="Depth" value={step.pointers.depth} tone="cyan" />
        <StatCard
          label="Choices Tried"
          value={step.state.exploredChoices}
          tone="amber"
        />
        <StatCard
          label="Permutations"
          value={step.state.results.length}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Yellow: candidate index" tone="yellow" />
        <LegendPill label="Green: already used in this branch" tone="emerald" />
        <LegendPill label="Purple: still available" tone="violet" />
        <LegendPill label="Cyan: active recursion frame" tone="cyan" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <PermutationSlots
            nums={step.state.nums}
            path={step.state.path}
            used={step.state.used}
            candidateIndex={step.pointers.candidateIndex}
          />

          <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Used Mask
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {step.state.used.map((flag, index) => (
                <div
                  key={`used-${index}`}
                  className={`rounded-[1.05rem] border px-4 py-3 ${
                    flag
                      ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">index {index}</span>
                    <span className="font-mono text-sm">
                      {flag ? "true" : "false"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="Call Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title: `depth ${frame.depth}`,
              subtitle: `path [${frame.path.join(", ")}]`,
              active: frame.status === "active",
              success: frame.status === "complete",
            }))}
          />

          <ResultCloud
            title="Completed Permutations"
            items={step.state.results.map((entry) => `[${entry.join(",")}]`)}
            activeItem={
              step.state.results.length > 0
                ? `[${step.state.results[step.state.results.length - 1].join(",")}]`
                : null
            }
            emptyLabel="Finished orderings will appear here once every slot is filled."
            tone="emerald"
          />
        </div>
      </div>
    </PanelShell>
  );
}
