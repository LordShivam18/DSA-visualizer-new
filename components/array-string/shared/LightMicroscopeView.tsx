import type { Mode, TeachingTraceFrame } from "./types";
import {
  AccentBanner,
  HintList,
  lightPanelClassName,
  MetricGrid,
  PointerGrid,
} from "./ui";

export default function LightMicroscopeView({
  step,
  mode,
  title = "Microscope View",
  subtitle = "Beginner mode explains the move. Expert mode explains the invariant.",
}: {
  step: TeachingTraceFrame;
  mode: Mode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.35)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <AccentBanner
          tone={mode === "beginner" ? "cyan" : "purple"}
          title={mode === "beginner" ? "What Is Happening" : "Why It Works"}
        >
          {mode === "beginner" ? step.beginnerNote : step.expertNote}
        </AccentBanner>
      </div>

      <div className="mt-5">
        <AccentBanner tone="yellow" title="Focus">
          {step.focus}
        </AccentBanner>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Pointer Snapshot
          </p>
          <div className="mt-3">
            <PointerGrid items={step.pointerChips} />
          </div>
          <div className="mt-4">
            <MetricGrid items={step.metrics} columns="md:grid-cols-2" />
          </div>
        </div>

        <HintList title="Teaching Notes" items={step.hints} />
      </div>
    </div>
  );
}
