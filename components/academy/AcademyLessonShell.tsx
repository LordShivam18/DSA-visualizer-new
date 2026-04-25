"use client";

import type { AcademyMode, Difficulty } from "@/lib/academy/models";

import { lightPanelClassName } from "../array-string/shared/ui";
import AcademyTopNav from "./AcademyTopNav";

function difficultyClassName(difficulty: Difficulty) {
  if (difficulty === "Easy") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (difficulty === "Hard") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

const modeMeta: Record<
  AcademyMode,
  { label: string; description: string; accent: string }
> = {
  learn: {
    label: "Guided Learn",
    description: "Play the trace with teaching notes and synced code lines.",
    accent: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  prediction: {
    label: "Prediction",
    description: "Pause before each step and force a learner guess.",
    accent: "border-violet-200 bg-violet-50 text-violet-700",
  },
  practice: {
    label: "Practice",
    description: "Hide the answer, meter hints, and unlock reveal only after effort.",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  interview: {
    label: "Interview",
    description: "Timer on, hints capped, evaluation delayed until the round ends.",
    accent: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

export default function AcademyLessonShell({
  problemId,
  taxonomy,
  title,
  difficulty,
  description,
  complexity,
  activeMode,
  onModeChange,
  inputArea,
  controls,
  modeExperience,
  visualization,
  microscope,
  sidebar,
  footer,
  mastery,
  sessionInsight,
}: {
  problemId: string;
  taxonomy: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  complexity: string;
  activeMode: AcademyMode;
  onModeChange: (mode: AcademyMode) => void;
  inputArea: React.ReactNode;
  controls: React.ReactNode;
  modeExperience: React.ReactNode;
  visualization: React.ReactNode;
  microscope: React.ReactNode;
  sidebar: React.ReactNode;
  footer: React.ReactNode;
  mastery: number;
  sessionInsight: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#ecf5ff_52%,#f6f7fb_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
        <AcademyTopNav currentProblemId={problemId} />

        <header className={`${lightPanelClassName} overflow-hidden p-6 md:p-8`}>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
                {taxonomy}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${difficultyClassName(
                    difficulty
                  )}`}
                >
                  {difficulty}
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                {description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Lesson mastery
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {mastery}%
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full border border-slate-200 bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Session focus
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {sessionInsight}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {complexity}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div>{inputArea}</div>
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Premium lesson modes
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(Object.keys(modeMeta) as AcademyMode[]).map((mode) => {
                  const meta = modeMeta[mode];

                  return (
                    <button
                      key={mode}
                      onClick={() => onModeChange(mode)}
                      className={`rounded-[1rem] border px-4 py-4 text-left transition-all ${
                        activeMode === mode
                          ? `${meta.accent} shadow-[0_16px_36px_rgba(15,23,42,0.08)]`
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-sm font-semibold">{meta.label}</div>
                      <p className="mt-2 text-sm leading-6 opacity-90">
                        {meta.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {controls}
        {modeExperience}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.95fr)]">
          <section className="space-y-5">
            {visualization}
            {microscope}
          </section>
          <aside className="space-y-5">{sidebar}</aside>
        </div>

        {footer}
      </div>
    </div>
  );
}
