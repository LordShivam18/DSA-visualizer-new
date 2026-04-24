import { AccentBanner, ArrayRowsView, KeyValueGrid, lightPanelClassName } from "../shared/ui";
import type { RandomizedSetTraceStep } from "./generateTrace";

export default function RandomizedSetVisualizer({
  step,
}: {
  step: RandomizedSetTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Hashmap + Dynamic Array
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          The array stores dense values, and the hashmap remembers where each one lives
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The active operation is highlighted below. Inserts append, removes use
          swap-delete, and getRandom reads the array directly.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="cyan" title="Latest Return">
          {step.state.lastReturn ?? "none"}
        </AccentBanner>
      </div>

      <div className="mt-5 space-y-4">
        <ArrayRowsView
          rows={[
            {
              label: "operations",
              description:
                "Yellow marks the current operation. Secondary text shows the argument list.",
              cells: step.state.operations.map((op, index) => ({
                value: op,
                secondary:
                  step.state.args[index] && step.state.args[index].length > 0
                    ? JSON.stringify(step.state.args[index])
                    : "[]",
                tone: step.pointers.opIndex === index ? "yellow" : "slate",
                tags: step.pointers.opIndex === index ? ["op"] : [],
              })),
            },
            {
              label: "values array",
              description:
                "Cyan marks the active value index. Purple marks the deterministic getRandom pick.",
              cells: step.state.values.map((value, index) => {
                const tags: string[] = [];
                if (step.pointers.valueIndex === index) {
                  tags.push("idx");
                }
                if (step.state.chosenIndex === index) {
                  tags.push("pick");
                }

                let tone: "cyan" | "purple" | "green" | "slate" = "slate";
                if (step.state.chosenIndex === index) {
                  tone = "purple";
                }
                if (step.pointers.valueIndex === index) {
                  tone = "cyan";
                }

                return { value, tone, tags };
              }),
              emptyLabel: "The set is currently empty.",
            },
          ]}
        />

        <KeyValueGrid
          title="Hashmap (value -> index)"
          description="Every active value maps to the exact slot it occupies in the dense array."
          entries={Object.entries(step.state.positions).map(([key, value]) => ({
            key,
            value: String(value),
            tone: "purple",
          }))}
          emptyLabel="The hashmap is empty."
        />
      </div>
    </section>
  );
}
