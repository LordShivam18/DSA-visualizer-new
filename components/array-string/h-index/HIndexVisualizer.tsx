import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { HIndexTraceStep } from "./generateTrace";

export default function HIndexVisualizer({
  step,
}: {
  step: HIndexTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sort Then Threshold Scan
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          After sorting, each index becomes one direct h-index test
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Cyan marks the citation count under test, green shows the accepted
          prefix, and red marks the first failing threshold.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="yellow" title="Threshold Test">
          Need at least {step.state.requirement ?? "n/a"} citations at the
          current sorted position. Current h = {step.state.h}.
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "original citations",
              description: "The raw input order before sorting.",
              cells: step.state.original.map((value) => ({ value, tone: "slate" })),
            },
            {
              label: "sorted descending",
              description:
                "Green is the accepted prefix, cyan is the current test, and red is the first failing threshold.",
              cells: step.state.sorted.map((value, index) => {
                const tags: string[] = [];
                if (index < step.state.h) {
                  tags.push("ok");
                }
                if (step.pointers.index === index) {
                  tags.push("test");
                }

                let tone: "green" | "cyan" | "red" | "slate" = "slate";
                if (index < step.state.h) {
                  tone = "green";
                }
                if (step.pointers.index === index) {
                  tone =
                    step.state.requirement !== null && value >= step.state.requirement
                      ? "cyan"
                      : "red";
                }

                return {
                  value,
                  tone,
                  tags,
                  secondary: `need ${index + 1}`,
                };
              }),
            },
          ]}
        />
      </div>
    </section>
  );
}
