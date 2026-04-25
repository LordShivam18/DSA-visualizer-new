"use client";

export type LessonFeatureMode = "learn" | "prediction";

const modeMeta: Record<
  LessonFeatureMode,
  { label: string; description: string; accent: string }
> = {
  learn: {
    label: "Guided",
    description: "Use the timeline as an explorable walkthrough.",
    accent: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  prediction: {
    label: "Prediction",
    description: "Pause before each reveal and force next-step recall.",
    accent: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

export default function LessonModeToggle({
  value,
  onChange,
}: {
  value: LessonFeatureMode;
  onChange: (nextValue: LessonFeatureMode) => void;
}) {
  return (
    <section className="rounded-[1.2rem] border border-slate-200 bg-white/85 p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-4 w-1.5 rounded-full bg-violet-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Lesson Mode
          </p>
          <p className="text-sm text-slate-600">
            Keep the same trace, but switch between guided reveal and recall pressure.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {(Object.keys(modeMeta) as LessonFeatureMode[]).map((mode) => {
          const meta = modeMeta[mode];

          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              className={`rounded-[1rem] border px-4 py-4 text-left transition-all ${
                value === mode
                  ? `${meta.accent} shadow-[0_14px_28px_rgba(15,23,42,0.08)]`
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="text-sm font-semibold">{meta.label}</div>
              <p className="mt-2 text-sm leading-6 opacity-90">{meta.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
