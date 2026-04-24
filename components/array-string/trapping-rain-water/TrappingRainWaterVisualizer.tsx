import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { TrappingRainWaterTraceStep } from "./generateTrace";

export default function TrappingRainWaterVisualizer({
  step,
}: {
  step: TrappingRainWaterTraceStep;
}) {
  const { left, right, currentIndex } = step.pointers;
  const { side } = step.state;

  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Two-Pointer Water Accounting
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          The shorter side decides which bar can be finalized now.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Left and right maxima form moving walls. Whenever one side is
          currently lower, that side already has enough information to settle
          the trapped water at its pointer.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_320px]">
        <ArrayRowsView
          rows={[
            {
              label: "height",
              description:
                "Cyan marks the left pointer, purple marks the right pointer, and the active bar is tagged as now.",
              cells: step.state.height.map((value, index) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "yellow" | "slate" =
                  "slate";

                if (left === index) {
                  tone = "cyan";
                  tags.push("L");
                }
                if (right === index) {
                  tone = "purple";
                  tags.push("R");
                }
                if (currentIndex === index) {
                  tone = side === "left" ? "cyan" : side === "right" ? "purple" : "yellow";
                  tags.push("now");
                }

                return { value, tone, tags };
              }),
            },
            {
              label: "trapped water",
              description:
                "Green bars have already contributed trapped water to the total.",
              cells: step.state.trapped.map((value, index) => {
                const tags: string[] = [];
                let tone: "cyan" | "green" | "purple" | "slate" =
                  value > 0 ? "green" : "slate";

                if (currentIndex === index) {
                  tone = value > 0 ? "green" : side === "left" ? "cyan" : "purple";
                  tags.push("now");
                }
                if (value > 0) {
                  tags.push("water");
                }

                return { value, tone, tags };
              }),
            },
          ]}
        />

        <div className="space-y-4">
          <AccentBanner tone="cyan" title="Left Max">
            {step.state.leftMax}
          </AccentBanner>
          <AccentBanner tone="purple" title="Right Max">
            {step.state.rightMax}
          </AccentBanner>
          <AccentBanner tone="green" title="Collected Water">
            {step.state.water}
          </AccentBanner>
          <AccentBanner tone={side === "right" ? "purple" : "cyan"} title="Active Side">
            {side ?? "idle"}
          </AccentBanner>
        </div>
      </div>
    </section>
  );
}
