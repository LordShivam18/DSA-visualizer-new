import { ArrayRowsView, lightPanelClassName, AccentBanner } from "../shared/ui";
import type { MergeSortedArrayTraceStep } from "./generateTrace";

export default function MergeSortedArrayVisualizer({
  step,
}: {
  step: MergeSortedArrayTraceStep;
}) {
  const rows = [
    {
      label: "nums1 Buffer",
      description: "Purple is the current nums1 tail. Yellow is the next write slot. Green slots are already final.",
      cells: step.state.working.map((value, index) => {
        const tags: string[] = [];
        if (step.pointers.i === index) {
          tags.push("i");
        }
        if (step.pointers.write === index) {
          tags.push("w");
        }
        if (
          step.pointers.write !== null &&
          index > step.pointers.write &&
          !tags.includes("done")
        ) {
          tags.push("done");
        }

        let tone: "cyan" | "purple" | "yellow" | "green" | "red" | "slate" = "slate";
        if (step.pointers.write !== null && index > step.pointers.write) {
          tone = "green";
        }
        if (index >= step.state.m && step.pointers.write !== null && index <= step.pointers.write) {
          tone = "red";
        }
        if (step.pointers.write === index) {
          tone = "yellow";
        }
        if (step.pointers.i === index) {
          tone = "purple";
        }

        return {
          value,
          tone,
          tags,
          secondary: index < step.state.m ? "initial" : "buffer",
          ghost: index >= step.state.m && step.pointers.write !== null && index <= step.pointers.write,
        };
      }),
    },
    {
      label: "nums2",
      description: "Cyan marks the current nums2 tail under comparison.",
      cells: step.state.nums2.map((value, index) => ({
        value,
        tone: step.pointers.j === index ? ("cyan" as const) : ("slate" as const),
        tags: step.pointers.j === index ? ["j"] : [],
      })),
      emptyLabel: "nums2 is empty.",
    },
  ];

  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            In-Place Backward Merge
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Fill nums1 from the end so no unfinished value gets overwritten
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            The merge window closes from right to left. Each step chooses the
            larger tail value and permanently seals one more slot in the final
            sorted suffix.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <AccentBanner tone="cyan" title="Merge Lens">
          {step.state.comparison}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView rows={rows} />
      </div>
    </section>
  );
}
