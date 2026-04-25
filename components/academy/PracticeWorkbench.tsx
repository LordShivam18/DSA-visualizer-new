"use client";

import type { PracticeConfig } from "@/lib/academy/models";

import { lightPanelClassName } from "../array-string/shared/ui";

type PracticeEvaluation = {
  accuracy: number;
  correct: boolean;
  answerCorrect: boolean;
  strategyCorrect: boolean;
  movePlanCredit: boolean;
  weakSignals: string[];
  notes: string[];
};

export default function PracticeWorkbench({
  config,
  selectedStrategyId,
  onSelectStrategy,
  answer,
  onAnswerChange,
  movePlan,
  onMovePlanChange,
  selfConfidence,
  onConfidenceChange,
  visibleHints,
  evaluation,
  solutionUnlocked,
  onUnlockHint,
  onEvaluate,
}: {
  config: PracticeConfig;
  selectedStrategyId: string | null;
  onSelectStrategy: (strategyId: string) => void;
  answer: string;
  onAnswerChange: (value: string) => void;
  movePlan: string;
  onMovePlanChange: (value: string) => void;
  selfConfidence: number;
  onConfidenceChange: (value: number) => void;
  visibleHints: PracticeConfig["hints"];
  evaluation: PracticeEvaluation | null;
  solutionUnlocked: boolean;
  onUnlockHint: () => void;
  onEvaluate: () => void;
}) {
  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
            Practice Mode
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Solve first, reveal second
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            The solution trace stays hidden until the learner submits an attempt
            or deliberately spends reveal budget.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Reveal status
          </div>
          <div className="mt-2 font-semibold text-slate-900">
            {solutionUnlocked ? "Unlocked" : "Hidden"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {config.strategyPrompt}
            </p>
            <div className="mt-4 grid gap-3">
              {config.strategyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSelectStrategy(option.id)}
                  className={`rounded-[1rem] border px-4 py-4 text-left transition-all ${
                    selectedStrategyId === option.id
                      ? "border-cyan-300 bg-cyan-50 shadow-[0_14px_32px_rgba(34,211,238,0.12)]"
                      : "border-slate-200 bg-white hover:border-cyan-200"
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {option.label}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              <span>{config.answerLabel}</span>
              <input
                value={answer}
                onChange={(event) => onAnswerChange(event.target.value)}
                placeholder={config.answerPlaceholder}
                className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-cyan-300"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              <span>Confidence before reveal</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={selfConfidence}
                onChange={(event) => onConfidenceChange(Number(event.target.value))}
                className="mt-4 w-full accent-cyan-500"
              />
              <div className="mt-2 text-sm text-slate-500">{selfConfidence}%</div>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            <span>{config.solutionLabel}</span>
            <textarea
              value={movePlan}
              rows={4}
              onChange={(event) => onMovePlanChange(event.target.value)}
              placeholder="Example: 1->2, 3->4"
              className="mt-2 min-h-[120px] w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-cyan-300"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onEvaluate}
              className="rounded-xl border border-cyan-200 bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
            >
              Check Attempt
            </button>
            <button
              onClick={onUnlockHint}
              className="rounded-xl border border-amber-200 bg-white px-5 py-2.5 text-sm font-medium text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-50"
            >
              Reveal Next Hint
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Hint ladder
            </p>
            <div className="mt-4 space-y-3">
              {visibleHints.length === 0 ? (
                <div className="rounded-[1rem] border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
                  No hints revealed yet. Stay in solver mode as long as possible.
                </div>
              ) : (
                visibleHints.map((hint) => (
                  <div
                    key={hint.level}
                    className="rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      Hint {hint.level}: {hint.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      {hint.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {evaluation ? (
            <div
              className={`rounded-[1.2rem] border px-4 py-4 ${
                evaluation.correct
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Practice evaluation
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {evaluation.accuracy}%
                  </p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div>Answer: {evaluation.answerCorrect ? "Correct" : "Off"}</div>
                  <div>Strategy: {evaluation.strategyCorrect ? "Solid" : "Needs work"}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {evaluation.notes.map((note) => (
                  <div key={note} className="rounded-[0.9rem] bg-white/80 px-3 py-2">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
