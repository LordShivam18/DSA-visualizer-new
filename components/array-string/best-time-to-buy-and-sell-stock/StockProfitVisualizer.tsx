import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { StockTraceStep } from "./generateTrace";

export default function StockProfitVisualizer({
  step,
}: {
  step: StockTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Greedy Scan / Single Transaction
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Keep the cheapest buy so far, and treat every later day as a sell candidate
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The purple marker is the cheapest day seen so far. The cyan marker is
          today. Green highlights the best sell day found so far.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="green" title="Best Transaction">
          Buy day {step.state.bestBuy ?? step.state.minIndex ?? "n/a"} and sell
          day {step.state.bestSell ?? "n/a"} for profit {step.state.maxProfit}.
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "prices",
              description:
                "Purple marks the cheapest buy day so far, cyan marks the day under inspection, and green is the current best sell day.",
              cells: step.state.prices.map((value, index) => {
                const tags: string[] = [];
                if (step.pointers.day === index) {
                  tags.push("day");
                }
                if (step.state.minIndex === index) {
                  tags.push("buy");
                }
                if (step.state.bestSell === index) {
                  tags.push("sell");
                }

                let tone: "cyan" | "purple" | "green" | "slate" = "slate";
                if (step.state.bestSell === index) {
                  tone = "green";
                }
                if (step.state.minIndex === index) {
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
      </div>
    </section>
  );
}
