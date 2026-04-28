"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import type { LessonEntryExperience } from "@/lib/academy/entryPoints";

import LessonOnboardingOverlay from "./LessonOnboardingOverlay";

function difficultyTone(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "easy") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (normalized === "hard") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-800";
}

function StarterLessonControls({
  entryExperience,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  canPrev,
  canNext,
  lockReason,
}: {
  entryExperience: Exclude<LessonEntryExperience, "default">;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
  lockReason: string | null;
}) {
  const progress =
    totalSteps <= 1 ? 100 : Math.round((stepIndex / (totalSteps - 1)) * 100);
  const helperCopy =
    entryExperience === "guided"
      ? "Move one step at a time. The next reveal unlocks after your prediction."
      : "Step through the trace and watch how each decision changes the state.";

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Controls
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{helperCopy}</p>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600">
          Step{" "}
          <span className="font-mono font-semibold text-slate-900">
            {stepIndex + 1}/{Math.max(totalSteps, 1)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-xl border border-cyan-200 bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        >
          {entryExperience === "guided" ? "Reveal next step" : "Next step"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50"
        >
          Restart
        </button>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>Trace progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {lockReason ? (
        <div className="mt-4 rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {lockReason}
        </div>
      ) : null}
    </section>
  );
}

export default function GuidedEntryLessonLayout({
  entryExperience,
  taxonomy,
  title,
  difficulty,
  description,
  visualization,
  predictionCard,
  whyPanel,
  completionFeedback,
  replayPanel,
  showOnboarding,
  onDismissOnboarding,
  onInteract,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  canPrev,
  canNext,
  lockReason,
}: {
  entryExperience: Exclude<LessonEntryExperience, "default">;
  taxonomy: string;
  title: string;
  difficulty: string;
  description: string;
  visualization: ReactNode;
  predictionCard: ReactNode;
  whyPanel: ReactNode;
  completionFeedback: ReactNode;
  replayPanel: ReactNode;
  showOnboarding: boolean;
  onDismissOnboarding: () => void;
  onInteract: () => void;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
  lockReason: string | null;
}) {
  const modeLabel =
    entryExperience === "guided" ? "First problem" : "Interactive demo";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f8f4ec] text-slate-900"
      onPointerDownCapture={onInteract}
      onKeyDownCapture={onInteract}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_22%),linear-gradient(180deg,#fffdf8_0%,#f7f1e6_58%,#f8f4ec_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:py-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700"
          >
            Guided DSA Academy
          </Link>
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            No signup required
          </span>
        </div>

        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {modeLabel}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-700">{description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              {taxonomy}
            </span>
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${difficultyTone(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <section className="relative">
            <LessonOnboardingOverlay
              open={showOnboarding}
              onDismiss={onDismissOnboarding}
            />
            {visualization}
          </section>

          <aside className="space-y-4">
            {predictionCard ? (
              predictionCard
            ) : (
              <section className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Demo flow
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Watch how the algorithm thinks.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Use the controls to follow one clean example from the first move
                  to the final answer.
                </p>
              </section>
            )}

            <StarterLessonControls
              entryExperience={entryExperience}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              onPrev={onPrev}
              onNext={onNext}
              onReset={onReset}
              canPrev={canPrev}
              canNext={canNext}
              lockReason={lockReason}
            />

            {whyPanel}
          </aside>
        </div>

        {completionFeedback ? (
          <div className="max-w-3xl">{completionFeedback}</div>
        ) : null}

        {replayPanel ? <div className="max-w-5xl">{replayPanel}</div> : null}
      </div>
    </div>
  );
}
