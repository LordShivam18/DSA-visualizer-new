import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { RotateArrayTraceStep } from "./generateTrace";

export default function RotateArrayVisualizer({
  step,
}: {
  step: RotateArrayTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Reversal Rotation
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Rotate in-place by reversing the whole array, then two smaller segments
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The active phase tells you which segment is being reversed right now,
          and the left/right pointers show the exact swap pair.
        </p>
      </div>

      <div className="mt-5">
        <AccentBanner tone="purple" title="Current Phase">
          {step.state.phase} - {step.state.comparison}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "Purple and yellow mark the active swap pair. Green means the rotation is complete.",
              cells: step.state.working.map((value, index) => {
                const tags: string[] = [];
                if (step.pointers.left === index) {
                  tags.push("left");
                }
                if (step.pointers.right === index) {
                  tags.push("right");
                }

                let tone: "purple" | "yellow" | "green" | "slate" = "slate";
                if (step.done) {
                  tone = "green";
                }
                if (step.pointers.right === index) {
                  tone = "yellow";
                }
                if (step.pointers.left === index) {
                  tone = "purple";
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
