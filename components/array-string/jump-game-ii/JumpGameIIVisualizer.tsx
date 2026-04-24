import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { JumpGameIITraceStep } from "./generateTrace";

export default function JumpGameIIVisualizer({
  step,
}: {
  step: JumpGameIITraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Greedy BFS Layers
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          currentEnd closes the current jump window, and farthest prepares the next
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Yellow marks the current index, purple shows the current window end,
          and cyan shows how far the next window can reach.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="green" title="Jump Count">
          jumps = {step.state.jumps}, currentEnd = {step.state.currentEnd},
          farthest = {step.state.farthest}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "Green cells are already inside the committed window. Purple marks the window end, yellow marks the active index.",
              cells: step.state.nums.map((value, index) => {
                const tags: string[] = [];
                if (index <= step.state.currentEnd) {
                  tags.push("win");
                }
                if (step.pointers.currentEnd === index) {
                  tags.push("end");
                }
                if (step.pointers.index === index) {
                  tags.push("idx");
                }
                if (step.state.reachFromCurrent === index) {
                  tags.push("reach");
                }

                let tone: "green" | "purple" | "yellow" | "cyan" | "slate" = "slate";
                if (index <= step.state.currentEnd) {
                  tone = "green";
                }
                if (step.state.reachFromCurrent === index) {
                  tone = "cyan";
                }
                if (step.pointers.currentEnd === index) {
                  tone = "purple";
                }
                if (step.pointers.index === index) {
                  tone = "yellow";
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
