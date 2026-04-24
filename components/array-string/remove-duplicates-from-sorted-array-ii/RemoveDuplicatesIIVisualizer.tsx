import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { RemoveDuplicatesIITraceStep } from "./generateTrace";

export default function RemoveDuplicatesIIVisualizer({
  step,
}: {
  step: RemoveDuplicatesIITraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sorted Array / At Most Two Copies
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Look two positions back to detect a forbidden third duplicate
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The write pointer still marks the next free slot, but the rule now
          uses nums[write - 2] to decide whether the current value is safe.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="yellow" title="Two-Copy Rule">
          {step.state.comparison}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "Green is the valid prefix, purple is the next free slot, and red marks a blocked third copy.",
              cells: step.state.working.map((value, index) => {
                const tags: string[] = [];
                if (index < step.state.keptLength) {
                  tags.push("keep");
                }
                if (step.pointers.read === index) {
                  tags.push("read");
                }
                if (step.pointers.write === index) {
                  tags.push("write");
                }
                if (
                  step.pointers.write !== null &&
                  step.pointers.write >= 2 &&
                  index === step.pointers.write - 2
                ) {
                  tags.push("w-2");
                }

                let tone: "green" | "purple" | "yellow" | "red" | "slate" = "slate";
                if (index < step.state.keptLength) {
                  tone = "green";
                }
                if (
                  step.pointers.write !== null &&
                  step.pointers.write >= 2 &&
                  index === step.pointers.write - 2
                ) {
                  tone = "yellow";
                }
                if (step.pointers.write === index) {
                  tone = "purple";
                }
                if (
                  step.pointers.read === index &&
                  step.pointers.write !== null &&
                  step.pointers.write >= 2 &&
                  value === step.state.working[step.pointers.write - 2]
                ) {
                  tone = "red";
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
