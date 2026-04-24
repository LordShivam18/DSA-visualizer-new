import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { CandyTraceStep } from "./generateTrace";

export default function CandyVisualizer({
  step,
}: {
  step: CandyTraceStep;
}) {
  const index = step.pointers.index;
  const neighborIndex = step.pointers.neighborIndex;

  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Two-Pass Greedy Repair
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          One pass fixes rising slopes. One pass fixes falling slopes.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The candies row starts at all ones, then only grows when a local
          rating rule forces it to grow.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_320px]">
        <ArrayRowsView
          rows={[
            {
              label: "ratings",
              description:
                "Yellow marks the child under inspection. Purple marks the neighbor used for comparison.",
              cells: step.state.ratings.map((value, current) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "yellow" | "slate" =
                  "slate";

                if (neighborIndex === current) {
                  tone = "purple";
                  tags.push(step.state.phase === "left" ? "left" : "right");
                }
                if (index === current) {
                  tone = neighborIndex === current ? "green" : "yellow";
                  tags.push("idx");
                }

                return { value, tone, tags };
              }),
            },
            {
              label: "candies",
              description:
                "Green means the current count satisfies both passes so far. Cyan marks the slot being updated now.",
              cells: step.state.candies.map((value, current) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "yellow" | "slate" =
                  "green";

                if (neighborIndex === current) {
                  tone = "purple";
                  tags.push("neighbor");
                }
                if (index === current) {
                  tone = "cyan";
                  tags.push("idx");
                }
                if (step.state.phase === "done") {
                  tags.push("final");
                }

                return {
                  value,
                  tone,
                  tags,
                };
              }),
            },
          ]}
        />

        <div className="space-y-4">
          <AccentBanner tone="purple" title="Phase">
            {step.state.phase}
          </AccentBanner>
          <AccentBanner tone="green" title="Current Total">
            {step.state.candies.reduce((sum, value) => sum + value, 0)}
          </AccentBanner>
          <AccentBanner tone="cyan" title="Required Candy">
            {step.state.requiredCandy ?? "n/a"}
          </AccentBanner>
        </div>
      </div>
    </section>
  );
}
