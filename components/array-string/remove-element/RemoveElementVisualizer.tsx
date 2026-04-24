import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { RemoveElementTraceStep } from "./generateTrace";

export default function RemoveElementVisualizer({
  step,
}: {
  step: RemoveElementTraceStep;
}) {
  const rows = [
    {
      label: "nums",
      description: "Green cells are already kept. Red marks the current target value. Purple is the next write slot.",
      cells: step.state.working.map((value, index) => {
        const tags: string[] = [];
        if (step.pointers.read === index) {
          tags.push("read");
        }
        if (step.pointers.write === index) {
          tags.push("write");
        }
        if (index < step.state.keptLength) {
          tags.push("kept");
        }

        let tone: "green" | "purple" | "yellow" | "red" | "slate" = "slate";
        if (value === step.state.target) {
          tone = "red";
        }
        if (index < step.state.keptLength) {
          tone = "green";
        }
        if (step.pointers.write === index) {
          tone = "purple";
        }
        if (step.pointers.read === index) {
          tone = value === step.state.target ? "red" : "yellow";
        }

        return { value, tone, tags };
      }),
    },
  ];

  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          In-Place Filtering
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Read every value once, but only copy survivors into the front prefix
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The kept prefix grows only when the current value is not the removal
          target. Everything beyond the prefix can be treated as disposable.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="red" title="Removal Target">
          Remove every occurrence of {step.state.target}. The accepted answer is
          the prefix of length {step.state.keptLength}.
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView rows={rows} />
      </div>
    </section>
  );
}
