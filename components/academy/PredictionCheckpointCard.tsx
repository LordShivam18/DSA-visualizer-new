"use client";

import type {
  PredictionCheckpoint,
  PredictionFeedback,
} from "@/lib/academy/models";

import { lightPanelClassName } from "../array-string/shared/ui";

export default function PredictionCheckpointCard({
  checkpoint,
  feedback,
  askedCount,
  correctCount,
  onSelect,
  variant = "default",
}: {
  checkpoint: PredictionCheckpoint | null;
  feedback: PredictionFeedback | null;
  askedCount: number;
  correctCount: number;
  onSelect: (choiceId: string) => void;
  variant?: "default" | "guided";
}) {
  if (variant === "guided") {
    return (
      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Prediction prompt
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              What should happen next?
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Make a quick guess before the next move is revealed.
            </p>
          </div>

          {askedCount > 0 ? (
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
              {correctCount}/{askedCount} correct
            </div>
          ) : null}
        </div>

        {checkpoint ? (
          <div className="mt-5">
            <div className="rounded-[1.2rem] border border-cyan-200 bg-cyan-50/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">
                {checkpoint.skill}
              </p>
              <p className="mt-2 text-base font-medium leading-7 text-slate-900">
                {checkpoint.prompt}
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              {checkpoint.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => onSelect(choice.id)}
                  className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_16px_40px_rgba(34,211,238,0.1)]"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {choice.label}
                  </div>
                  {choice.detail ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {choice.detail}
                    </p>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {feedback ? (
          <div
            className={`mt-5 rounded-[1.2rem] border px-4 py-4 text-sm leading-7 ${
              feedback.correct
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            <p className="font-semibold">
              {feedback.correct ? "Correct." : "Not quite."}
            </p>
            <p className="mt-2">{feedback.explanation}</p>
            {!feedback.correct && feedback.diagnosis ? (
              <p className="mt-3 border-t border-current/15 pt-3">
                {feedback.diagnosis}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
            Prediction Mode
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Answer before the animation unlocks
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            The next step stays locked until the learner commits to a prediction.
            This turns a passive trace into active recall.
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-600">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Prediction accuracy
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {askedCount === 0 ? 0 : Math.round((correctCount / askedCount) * 100)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {correctCount}/{Math.max(askedCount, 0)} correct
          </div>
        </div>
      </div>

      {checkpoint ? (
        <div className="mt-5">
          <div className="rounded-[1.25rem] border border-cyan-200 bg-cyan-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">
              Skill Focus
            </p>
            <p className="mt-2 text-sm font-semibold text-cyan-900">
              {checkpoint.skill}
            </p>
            <p className="mt-3 text-base font-medium leading-7 text-slate-800">
              {checkpoint.prompt}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {checkpoint.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onSelect(choice.id)}
                className="rounded-[1.15rem] border border-slate-200 bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_16px_40px_rgba(34,211,238,0.1)]"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {choice.label}
                </div>
                {choice.detail ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {choice.detail}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[1.2rem] border border-emerald-200 bg-emerald-50/70 px-4 py-5 text-sm leading-7 text-emerald-800">
          The next checkpoint is already unlocked. Advance the timeline to keep the session going.
        </div>
      )}

      {feedback ? (
        <div
          className={`mt-5 rounded-[1.2rem] border px-4 py-4 text-sm leading-7 ${
            feedback.correct
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <span className="font-semibold">
            {feedback.correct ? "Correct prediction." : "Not quite."}
          </span>{" "}
          {feedback.explanation}
          {!feedback.correct && feedback.diagnosis ? (
            <p className="mt-3 border-t border-current/15 pt-3">
              <span className="font-semibold">Diagnosis:</span> {feedback.diagnosis}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
