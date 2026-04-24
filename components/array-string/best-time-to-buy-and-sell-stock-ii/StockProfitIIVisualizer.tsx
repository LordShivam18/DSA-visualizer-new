import { AccentBanner, ArrayRowsView, KeyValueGrid, lightPanelClassName } from "../shared/ui";
import type { StockIITraceStep } from "./generateTrace";

export default function StockProfitIIVisualizer({
  step,
}: {
  step: StockIITraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Greedy Profit Accumulation
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Every upward edge adds profit to the answer
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Cyan marks the current day pair. Green means the current rise is being
          collected into the running total.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="green" title="Collected Profit">
          Total profit so far: {step.state.totalProfit}
        </AccentBanner>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <ArrayRowsView
          rows={[
            {
              label: "prices",
              description:
                "Purple marks the previous day, cyan marks the current day, and green means the pair contributes profit.",
              cells: step.state.prices.map((value, index) => {
                const tags: string[] = [];
                if (step.pointers.prevDay === index) {
                  tags.push("prev");
                }
                if (step.pointers.day === index) {
                  tags.push("day");
                }

                let tone: "purple" | "cyan" | "green" | "slate" = "slate";
                if (
                  step.pointers.prevDay !== null &&
                  step.pointers.day !== null &&
                  step.state.prices[step.pointers.day] >
                    step.state.prices[step.pointers.prevDay] &&
                  (index === step.pointers.prevDay || index === step.pointers.day)
                ) {
                  tone = "green";
                }
                if (step.pointers.prevDay === index) {
                  tone = "purple";
                }
                if (step.pointers.day === index) {
                  tone = "cyan";
                }

                return { value, tone, tags };
              }),
            },
          ]}
        />

        <KeyValueGrid
          title="Collected Moves"
          description="Each positive adjacent rise contributes directly to the final answer."
          entries={step.state.transactions.map((item, index) => ({
            key: `trade ${index + 1}`,
            value: item,
            tone: "green",
          }))}
          emptyLabel="No positive rise has been collected yet."
        />
      </div>
    </section>
  );
}
