import type { Mode, TeachingTraceFrame } from "./types";
import {
  AccentPanel,
  matrixPanelClassName,
  MetricGrid,
  NoteList,
  PointerGrid,
} from "./ui";

export default function MatrixMicroscopeView({
  step,
  mode,
  title = "Microscope View",
  subtitle = "Beginner mode narrates the move. Expert mode anchors the invariant.",
}: {
  step: TeachingTraceFrame;
  mode: Mode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className={`${matrixPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-[#8eb8cf]" />
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <p className="text-sm text-stone-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <AccentPanel
          title={mode === "beginner" ? "What Is Happening" : "Why It Works"}
          tone={mode === "beginner" ? "sky" : "amber"}
        >
          {mode === "beginner" ? step.beginnerNote : step.expertNote}
        </AccentPanel>
      </div>

      <div className="mt-5">
        <AccentPanel title="Focus" tone="indigo">
          {step.focus}
        </AccentPanel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.25rem] border border-[#eadcc8] bg-[#fffaf5] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Active Markers
          </p>
          <div className="mt-3">
            <PointerGrid items={step.pointerChips} />
          </div>
          <div className="mt-4">
            <MetricGrid items={step.metrics} columns="md:grid-cols-2" />
          </div>
        </div>

        <NoteList title="Teaching Notes" items={step.hints} />
      </div>
    </div>
  );
}
