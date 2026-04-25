"use client";

import type {
  InterviewConfig,
  PracticeConfig,
} from "@/lib/academy/models";

import { lightPanelClassName } from "../array-string/shared/ui";

type InterviewEvaluation = {
  accuracy: number;
  correctness: boolean;
  efficiencyScore: number;
  confidenceScore: number;
  finalScore: number;
  weakSignals: string[];
  notes: string[];
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function InterviewWorkbench({
  config,
  strategyOptions,
  selectedStrategyId,
  onSelectStrategy,
  answer,
  onAnswerChange,
  selfConfidence,
  onConfidenceChange,
  hintBudget,
  hintRequests,
  visibleHints,
  timeRemainingSec,
  evaluation,
  timedOut,
  onRequestHint,
  onSubmit,
}: {
  config: InterviewConfig;
  strategyOptions: PracticeConfig["strategyOptions"];
  selectedStrategyId: string | null;
  onSelectStrategy: (strategyId: string) => void;
  answer: string;
  onAnswerChange: (value: string) => void;
  selfConfidence: number;
  onConfidenceChange: (value: number) => void;
  hintBudget: number;
  hintRequests: number;
  visibleHints: PracticeConfig["hints"];
  timeRemainingSec: number;
  evaluation: InterviewEvaluation | null;
  timedOut: boolean;
  onRequestHint: () => void;
  onSubmit: () => void;
}) {
  const timerUrgencyClassName =
    timeRemainingSec <= 60
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : timeRemainingSec <= 180
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
            Interview Mode
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Simulate a pressure round
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Hints are capped, the trace stays hidden until the round ends, and
            the final evaluation scores correctness, efficiency, and interview confidence.
          </p>
        </div>

        <div
          className={`rounded-[1.2rem] border px-4 py-3 text-right ${timerUrgencyClassName}`}
        >
          <div className="text-xs uppercase tracking-[0.18em]">Time remaining</div>
          <div className="mt-2 text-2xl font-semibold">
            {formatTime(timeRemainingSec)}
          </div>
          <div className="mt-1 text-xs">
            Hint budget {hintRequests}/{hintBudget}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Opening strategy
            </p>
            <div className="mt-4 grid gap-3">
              {strategyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSelectStrategy(option.id)}
                  className={`rounded-[1rem] border px-4 py-4 text-left transition-all ${
                    selectedStrategyId === option.id
                      ? "border-violet-300 bg-violet-50 shadow-[0_14px_32px_rgba(139,92,246,0.12)]"
                      : "border-slate-200 bg-white hover:border-violet-200"
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

          <label className="block text-sm font-medium text-slate-700">
            <span>Final answer</span>
            <input
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="Enter the max profit"
              className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-violet-300"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>{config.confidencePrompt}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={selfConfidence}
              onChange={(event) => onConfidenceChange(Number(event.target.value))}
              className="mt-4 w-full accent-violet-500"
            />
            <div className="mt-2 text-sm text-slate-500">{selfConfidence}%</div>
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onSubmit}
              disabled={evaluation !== null}
              className="rounded-xl border border-violet-200 bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.2)] transition-all hover:-translate-y-0.5 hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Submit Round
            </button>
            <button
              onClick={onRequestHint}
              disabled={hintRequests >= hintBudget || evaluation !== null}
              className="rounded-xl border border-amber-200 bg-white px-5 py-2.5 text-sm font-medium text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              Use Hint
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Live constraints
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <div className="rounded-[0.95rem] border border-slate-200 bg-white px-3 py-3">
                Timer: {formatTime(config.timeLimitSec)} total
              </div>
              <div className="rounded-[0.95rem] border border-slate-200 bg-white px-3 py-3">
                Benchmark: under {Math.round(config.benchmarkMs / 60000)} minutes for a strong pacing score
              </div>
              <div className="rounded-[0.95rem] border border-slate-200 bg-white px-3 py-3">
                Immediate correctness feedback is withheld until submission or timeout.
              </div>
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Consumed hints
            </p>
            <div className="mt-4 space-y-3">
              {visibleHints.length === 0 ? (
                <div className="rounded-[1rem] border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
                  No hints consumed. You are still in a clean interview run.
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
                evaluation.correctness
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
              }`}
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Final evaluation
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {evaluation.finalScore} / 100
                  </p>
                </div>
                <div className="text-right text-sm text-slate-700">
                  <div>Correctness: {evaluation.accuracy}%</div>
                  <div>Efficiency: {evaluation.efficiencyScore}%</div>
                  <div>Confidence: {evaluation.confidenceScore}%</div>
                </div>
              </div>

              {timedOut ? (
                <div className="mt-4 rounded-[0.95rem] border border-rose-200 bg-white/70 px-3 py-2 text-sm text-rose-700">
                  The timer expired before submission, so the round was auto-evaluated.
                </div>
              ) : null}

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
