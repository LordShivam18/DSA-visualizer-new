import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { GasStationTraceStep } from "./generateTrace";

export default function GasStationVisualizer({
  step,
}: {
  step: GasStationTraceStep;
}) {
  const currentIndex = step.pointers.index;
  const startIndex = step.pointers.start;

  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Greedy Circuit Scan
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Keep one start candidate and discard segments that go negative.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          `tank` measures whether the current candidate can survive the route
          prefix. `total` checks whether the full circle is feasible at all.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_320px]">
        <ArrayRowsView
          rows={[
            {
              label: "gas",
              description:
                "Purple marks the current start candidate. Yellow marks the station being processed.",
              cells: step.state.gas.map((value, index) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "yellow" | "slate" =
                  "slate";

                if (startIndex === index) {
                  tone = "purple";
                  tags.push("start");
                }
                if (currentIndex === index) {
                  tone = startIndex === index ? "green" : "yellow";
                  tags.push("idx");
                }

                return { value, tone, tags };
              }),
            },
            {
              label: "cost",
              description:
                "This row shows the travel cost that must be paid to leave each station.",
              cells: step.state.cost.map((value, index) => ({
                value,
                tone: currentIndex === index ? "yellow" : "slate",
                tags: currentIndex === index ? ["idx"] : [],
              })),
            },
            {
              label: "net = gas - cost",
              description:
                "Positive stations add buffer. Negative stations consume it.",
              cells: step.state.net.map((value, index) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "red" | "slate" =
                  value >= 0 ? "green" : "red";

                if (startIndex === index) {
                  tags.push("start");
                }
                if (currentIndex === index) {
                  tone = value >= 0 ? "cyan" : "red";
                  tags.push("idx");
                }

                return { value, tone, tags };
              }),
            },
          ]}
        />

        <div className="space-y-4">
          <AccentBanner tone="cyan" title="Running Tank">
            {step.state.tank}
          </AccentBanner>
          <AccentBanner tone="green" title="Total Net Gas">
            {step.state.total}
          </AccentBanner>
          <AccentBanner tone="purple" title="Current Start Candidate">
            {step.state.start}
          </AccentBanner>
        </div>
      </div>
    </section>
  );
}
