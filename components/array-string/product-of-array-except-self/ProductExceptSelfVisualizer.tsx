import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { ProductExceptSelfTraceStep } from "./generateTrace";

export default function ProductExceptSelfVisualizer({
  step,
}: {
  step: ProductExceptSelfTraceStep;
}) {
  const currentIndex = step.pointers.index;
  const prefixPhase = step.state.phase === "prefix";
  const suffixPhase = step.state.phase === "suffix";

  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Prefix X Suffix Construction
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          One pass writes left products. One pass multiplies right products.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The answer array is a staging area: first each cell stores what lies
          to its left, then the reverse pass injects what lies to its right.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "The yellow marker shows the index being processed in the current pass.",
              cells: step.state.nums.map((value, index) => ({
                value,
                tone: currentIndex === index ? "yellow" : "slate",
                tags: currentIndex === index ? ["idx"] : [],
              })),
            },
            {
              label: "answer",
              description:
                "Prefix-only cells are purple. Finalized cells from the suffix pass are green.",
              cells: step.state.answer.map((value, index) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "yellow" | "slate" =
                  "slate";

                if (step.state.phase === "done") {
                  tone = "green";
                  tags.push("final");
                } else if (prefixPhase) {
                  if (index < (currentIndex ?? 0)) {
                    tone = "purple";
                    tags.push("prefix");
                  }
                  if (index === currentIndex) {
                    tone = "cyan";
                    tags.push("write");
                  }
                } else if (suffixPhase) {
                  if (currentIndex !== null && index > currentIndex) {
                    tone = "green";
                    tags.push("final");
                  } else if (currentIndex !== null && index === currentIndex) {
                    tone = "cyan";
                    tags.push("now");
                  } else {
                    tone = "purple";
                    tags.push("prefix");
                  }
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
          <AccentBanner tone="cyan" title="Running Prefix">
            {step.state.prefix}
          </AccentBanner>
          <AccentBanner tone="green" title="Running Suffix">
            {step.state.suffix}
          </AccentBanner>
          <AccentBanner tone="purple" title="Phase">
            {step.state.phase}
          </AccentBanner>
        </div>
      </div>
    </section>
  );
}
