import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { RemoveDuplicatesTraceStep } from "./generateTrace";

export default function RemoveDuplicatesVisualizer({
  step,
}: {
  step: RemoveDuplicatesTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sorted Array Deduplication
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Compare against the last unique value, not the whole prefix
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Sorted order turns duplicate detection into a local check. The write
          pointer grows only when a new value arrives.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="yellow" title="Comparison">
          {step.state.comparison}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "Green marks the unique prefix. Purple is the next free unique slot. Cyan marks the current read value.",
              cells: step.state.working.map((value, index) => {
                const tags: string[] = [];
                if (index < step.state.uniqueLength) {
                  tags.push("uniq");
                }
                if (step.pointers.read === index) {
                  tags.push("read");
                }
                if (step.pointers.write === index) {
                  tags.push("write");
                }

                let tone: "green" | "purple" | "cyan" | "red" | "slate" = "slate";
                if (index < step.state.uniqueLength) {
                  tone = "green";
                }
                if (step.pointers.write === index) {
                  tone = "purple";
                }
                if (step.pointers.read === index) {
                  tone =
                    step.pointers.write !== null &&
                    step.pointers.write > 0 &&
                    value === step.state.working[step.pointers.write - 1]
                      ? "red"
                      : "cyan";
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
