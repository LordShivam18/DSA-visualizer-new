import type { Mode, TeachingTraceFrame } from "./types";
import {
  DarkAccentBanner,
  DarkHintList,
  DarkMetricGrid,
  DarkPointerGrid,
  darkPanelClassName,
} from "./darkUi";

export default function DarkMicroscopeView({
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
    <div className={`${darkPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.42)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <DarkAccentBanner
          tone={mode === "beginner" ? "cyan" : "purple"}
          title={mode === "beginner" ? "What Is Happening" : "Why It Works"}
        >
          {mode === "beginner" ? step.beginnerNote : step.expertNote}
        </DarkAccentBanner>
      </div>

      <div className="mt-5">
        <DarkAccentBanner tone="yellow" title="Focus">
          {step.focus}
        </DarkAccentBanner>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Pointer Snapshot
          </p>
          <div className="mt-3">
            <DarkPointerGrid items={step.pointerChips} />
          </div>
          <div className="mt-4">
            <DarkMetricGrid items={step.metrics} columns="md:grid-cols-2" />
          </div>
        </div>

        <DarkHintList title="Teaching Notes" items={step.hints} />
      </div>
    </div>
  );
}
