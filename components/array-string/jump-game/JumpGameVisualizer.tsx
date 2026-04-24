import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { JumpGameTraceStep } from "./generateTrace";

export default function JumpGameVisualizer({
  step,
}: {
  step: JumpGameTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Greedy Reachability
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          The only thing that matters is the farthest reachable index so far
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Green marks the current reachable frontier. Cyan is the index being
          tested, and purple shows the jump span offered by that index.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="green" title="Reach Frontier">
          maxReach = {step.state.maxReach}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "Green cells are already inside the reachable frontier. Cyan marks the current index under inspection.",
              cells: step.state.nums.map((value, index) => {
                const tags: string[] = [];
                if (index <= step.state.maxReach) {
                  tags.push("reach");
                }
                if (step.pointers.index === index) {
                  tags.push("idx");
                }

                let tone: "green" | "cyan" | "purple" | "slate" = "slate";
                if (index <= step.state.maxReach) {
                  tone = "green";
                }
                if (step.pointers.index === index) {
                  tone = "cyan";
                }
                if (step.state.reachFromCurrent !== null && index === step.state.reachFromCurrent) {
                  tone = "purple";
                  tags.push("jump");
                }

                return {
                  value,
                  tone,
                  tags,
                  secondary:
                    step.pointers.index === index && step.state.reachFromCurrent !== null
                      ? `to ${step.state.reachFromCurrent}`
                      : undefined,
                };
              }),
            },
          ]}
        />
      </div>
    </section>
  );
}
