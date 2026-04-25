"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AcademyLessonShell from "@/components/academy/AcademyLessonShell";
import AdaptiveRecommendationRail from "@/components/academy/AdaptiveRecommendationRail";
import InterviewWorkbench from "@/components/academy/InterviewWorkbench";
import { useLearningPlatform } from "@/components/academy/LearningPlatformProvider";
import PracticeWorkbench from "@/components/academy/PracticeWorkbench";
import PredictionCheckpointCard from "@/components/academy/PredictionCheckpointCard";
import { useInterviewMode } from "@/components/academy/hooks/useInterviewMode";
import { usePracticeMode } from "@/components/academy/hooks/usePracticeMode";
import { usePredictionEngine } from "@/components/academy/hooks/usePredictionEngine";
import { useProgressTracker } from "@/components/academy/hooks/useProgressTracker";
import { useTimeline } from "@/components/core/animation/useTimeline";
import { stockIILessonDefinition } from "@/lib/academy/catalog";
import type { AcademyMode, SessionEvaluation, SessionRecord } from "@/lib/academy/models";
import { createSessionId } from "@/lib/academy/storage";

import CodePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/CodePanel";
import MicroscopeView from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/MicroscopeView";
import StockProfitIIVisualizer from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/StockProfitIIVisualizer";
import TracePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/TracePanel";
import {
  generateTrace,
  type StockIITraceStep,
} from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const problemId = stockIILessonDefinition.problemId;
const defaultInputs = {
  prices: "[7,1,5,3,6,4]",
};

const presets = [
  { name: "Example 1", summary: "=> 7", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 4",
    values: { prices: "[1,2,3,4,5]" },
  },
  {
    name: "Flat and drops",
    summary: "=> 0",
    values: { prices: "[5,5,4,4,3,2]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.prices);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(1, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function buildEfficiencyScore(durationMs: number, benchmarkMs: number, hintsUsed = 0) {
  const ratio = benchmarkMs === 0 ? 1 : durationMs / benchmarkMs;
  const raw = ratio <= 1 ? 92 - hintsUsed * 4 : 92 - (ratio - 1) * 32 - hintsUsed * 4;
  return clamp(Math.round(raw), 18, 100);
}

function buildFinalScore(
  accuracy: number,
  efficiencyScore: number,
  confidenceScore: number
) {
  return clamp(
    Math.round(accuracy * 0.52 + efficiencyScore * 0.26 + confidenceScore * 0.22),
    0,
    100
  );
}

function buildLearnEvaluation(durationMs: number): SessionEvaluation {
  const efficiencyScore = buildEfficiencyScore(
    durationMs,
    stockIILessonDefinition.interview?.benchmarkMs ?? 180000
  );
  const confidenceScore = clamp(Math.round(74 + efficiencyScore * 0.16), 0, 100);

  return {
    accuracy: 100,
    correctness: true,
    efficiencyScore,
    confidenceScore,
    finalScore: buildFinalScore(100, efficiencyScore, confidenceScore),
    weakSignals: [],
    notes: [
      "You completed the guided walkthrough and exposed every greedy state change.",
      "This mode is optimized for concept absorption rather than pressure scoring.",
    ],
  };
}

function buildPredictionEvaluation(
  durationMs: number,
  accuracy: number,
  askedCount: number,
  correctCount: number
): SessionEvaluation {
  const efficiencyScore = buildEfficiencyScore(
    durationMs,
    stockIILessonDefinition.interview?.benchmarkMs ?? 180000
  );
  const confidenceScore = clamp(
    Math.round(42 + accuracy * 0.46 + (askedCount === correctCount ? 6 : 0)),
    0,
    100
  );
  const weakSignals: string[] = [];

  if (accuracy < 75) {
    weakSignals.push("next-step prediction");
  }

  if (correctCount < askedCount) {
    weakSignals.push("greedy state recall");
  }

  return {
    accuracy,
    correctness: accuracy >= 70,
    efficiencyScore,
    confidenceScore,
    finalScore: buildFinalScore(accuracy, efficiencyScore, confidenceScore),
    weakSignals,
    notes: [
      `You answered ${correctCount} of ${askedCount} prediction checkpoints correctly.`,
      "Prediction mode scores active recall instead of passive step consumption.",
    ],
  };
}

function buildPracticeEvaluation(
  durationMs: number,
  accuracy: number,
  correctness: boolean,
  selfConfidence: number,
  weakSignals: string[],
  notes: string[],
  hintsUsed: number
): SessionEvaluation {
  const efficiencyScore = buildEfficiencyScore(
    durationMs,
    stockIILessonDefinition.interview?.benchmarkMs ?? 180000,
    hintsUsed
  );
  const confidenceScore = clamp(
    Math.round(selfConfidence * 0.62 + (correctness ? 24 : -10) + efficiencyScore * 0.18),
    0,
    100
  );

  return {
    accuracy,
    correctness,
    efficiencyScore,
    confidenceScore,
    finalScore: buildFinalScore(accuracy, efficiencyScore, confidenceScore),
    weakSignals,
    notes,
  };
}

function sessionInsightForMode(mode: AcademyMode) {
  switch (mode) {
    case "learn":
      return "Use autoplay and synced code to build the mental model before pressure-testing recall.";
    case "prediction":
      return "Every next step is locked until a prediction is submitted, creating active recall on every transition.";
    case "practice":
      return "The trace is hidden until the learner commits to an answer or spends hint budget.";
    case "interview":
      return "Interview mode delays feedback, caps hints, and scores pacing alongside correctness.";
    default:
      return "";
  }
}

export default function StockIIPage() {
  const { state, setActiveMode, recordSession } = useLearningPlatform();
  const storedMode = state.activeModes[problemId];

  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<StockIITraceStep[]>(() =>
    buildTrace(defaultInputs)
  );
  const [mode, setMode] = useState<AcademyMode>(storedMode ?? "prediction");
  const [runId, setRunId] = useState(0);
  const [lastSessionMessage, setLastSessionMessage] = useState(
    sessionInsightForMode(storedMode ?? "prediction")
  );

  const sessionStartedAtRef = useRef(0);
  const recordedCycleKeyRef = useRef<string | null>(null);

  const timeline = useTimeline(trace);
  const { pause, play, prev, next, reset, setLockedSteps, setSpeed } = timeline;
  const step = timeline.activeStep ?? trace[0];
  const finalStep = trace[trace.length - 1];
  const practiceConfig = stockIILessonDefinition.practice!;
  const interviewConfig = stockIILessonDefinition.interview!;
  const correctStrategyId =
    practiceConfig.strategyOptions.find((option) => option.isCorrect)?.id ??
    "positive-deltas";
  const expectedAnswer = String(
    finalStep.state.result ?? finalStep.state.totalProfit
  );
  const expectedMoves = finalStep.state.transactions;
  const resetKey = `${runId}:${mode}:${inputs.prices}`;
  const cycleKey = `${runId}:${mode}`;

  const prediction = usePredictionEngine({
    trace,
    activeIndex: timeline.activeIndex,
    enabled: mode === "prediction",
    resetKey,
  });

  const practice = usePracticeMode({
    config: practiceConfig,
    expectedAnswer,
    expectedMoves,
    resetKey,
  });

  const interview = useInterviewMode({
    config: interviewConfig,
    hints: practiceConfig.hints,
    expectedAnswer,
    correctStrategyId,
    resetKey,
  });

  const { problemProgress, recommendations, recentSessions } =
    useProgressTracker(problemId);

  useEffect(() => {
    if (storedMode) {
      setMode(storedMode);
    }
  }, [storedMode]);

  useEffect(() => {
    setActiveMode(problemId, mode);
  }, [mode, setActiveMode]);

  useEffect(() => {
    sessionStartedAtRef.current = Date.now();
    recordedCycleKeyRef.current = null;
    setLastSessionMessage(sessionInsightForMode(mode));
  }, [cycleKey, mode]);

  const lockState = useMemo(() => {
    if (mode === "prediction") {
      return {
        indices: prediction.lockedStepIndices,
        reason: "Answer the prediction to unlock the next animation step.",
      };
    }

    if (mode === "practice" && !practice.solutionUnlocked) {
      return {
        indices: trace.slice(1).map((item) => item.step),
        reason: "Practice mode hides the solution until you submit or reveal the final hint.",
      };
    }

    if (mode === "interview" && !interview.evaluation) {
      return {
        indices: trace.slice(1).map((item) => item.step),
        reason: "Interview mode locks the solution until the round is evaluated.",
      };
    }

    return {
      indices: [] as number[],
      reason: undefined,
    };
  }, [
    interview.evaluation,
    mode,
    practice.solutionUnlocked,
    prediction.lockedStepIndices,
    trace,
  ]);

  useEffect(() => {
    setLockedSteps(lockState.indices, lockState.reason);
  }, [lockState.indices, lockState.reason, setLockedSteps]);

  const completeSession = useCallback((
    sessionMode: AcademyMode,
    evaluation: SessionEvaluation,
    extras: Pick<SessionRecord, "hintsUsed" | "prediction" | "completed"> & {
      practice?: SessionRecord["practice"];
      interview?: SessionRecord["interview"];
      message: string;
    }
  ) => {
    if (recordedCycleKeyRef.current === cycleKey) {
      return;
    }

    recordedCycleKeyRef.current = cycleKey;

    const endedAt = new Date().toISOString();
    const durationMs = Date.now() - sessionStartedAtRef.current;
    const session: SessionRecord = {
      id: createSessionId(problemId, sessionMode),
      problemId,
      problemTitle: stockIILessonDefinition.title,
      route: stockIILessonDefinition.route,
      topicId: stockIILessonDefinition.topicId,
      topicLabel: stockIILessonDefinition.topicLabel,
      difficulty: stockIILessonDefinition.difficulty,
      mode: sessionMode,
      startedAt: new Date(sessionStartedAtRef.current).toISOString(),
      endedAt,
      durationMs,
      inputSummary: inputs.prices,
      hintsUsed: extras.hintsUsed,
      prediction: extras.prediction,
      practice: extras.practice,
      interview: extras.interview,
      evaluation,
      completed: extras.completed,
    };

    recordSession(session);
    setLastSessionMessage(extras.message);
  }, [cycleKey, inputs.prices, recordSession]);

  useEffect(() => {
    if (mode !== "learn" || !step.done) {
      return;
    }

    completeSession(
      "learn",
      buildLearnEvaluation(Date.now() - sessionStartedAtRef.current),
      {
        hintsUsed: 0,
        prediction: { asked: 0, correct: 0 },
        completed: true,
        message: "Guided learn session completed and recorded in your dashboard.",
      }
    );
  }, [completeSession, mode, step.done]);

  useEffect(() => {
    if (mode !== "prediction" || !step.done || prediction.askedCount === 0) {
      return;
    }

    completeSession(
      "prediction",
      buildPredictionEvaluation(
        Date.now() - sessionStartedAtRef.current,
        prediction.accuracy,
        prediction.askedCount,
        prediction.correctCount
      ),
      {
        hintsUsed: 0,
        prediction: {
          asked: prediction.askedCount,
          correct: prediction.correctCount,
        },
        completed: prediction.accuracy >= 70,
        message: "Prediction round scored and synced to your progress profile.",
      }
    );
  }, [
    completeSession,
    mode,
    prediction.accuracy,
    prediction.askedCount,
    prediction.correctCount,
    step.done,
  ]);

  useEffect(() => {
    if (mode !== "interview" || !interview.evaluation) {
      return;
    }

    completeSession("interview", interview.evaluation, {
      hintsUsed: interview.hintRequests,
      prediction: { asked: 0, correct: 0 },
      interview: {
        strategyId: interview.selectedStrategyId,
        expectedAnswer: interview.answer,
        selfConfidence: interview.selfConfidence,
        timedOut: interview.timedOut,
        timeLimitSec: interviewConfig.timeLimitSec,
        timeRemainingSec: interview.timeRemainingSec,
      },
      completed: interview.evaluation.correctness,
      message: "Interview simulation evaluated and written to session history.",
    });
  }, [
    completeSession,
    interview.answer,
    interview.evaluation,
    interview.hintRequests,
    interview.selectedStrategyId,
    interview.selfConfidence,
    interview.timeRemainingSec,
    interview.timedOut,
    interviewConfig.timeLimitSec,
    mode,
  ]);

  function run(nextValues = inputs) {
    const nextTrace = buildTrace(nextValues);

    setInputs(nextValues);
    setTrace(nextTrace);
    setRunId((current) => current + 1);
    pause();
  }

  function switchMode(nextMode: AcademyMode) {
    if (nextMode === mode) {
      return;
    }

    pause();
    reset();
    setMode(nextMode);
  }

  function handlePredictionSelection(choiceId: string) {
    const feedback = prediction.submitPrediction(choiceId);

    if (feedback) {
      setLastSessionMessage(
        feedback.correct
          ? "Correct prediction unlocked the next step."
          : "Feedback delivered. The next step is still unlocked so the learner can compare mental model to reality."
      );
    }
  }

  function handlePracticeEvaluation() {
    const result = practice.evaluateAttempt();

    if (!result) {
      return;
    }

    const evaluation = buildPracticeEvaluation(
      Date.now() - sessionStartedAtRef.current,
      result.accuracy,
      result.correct,
      practice.selfConfidence,
      result.weakSignals,
      result.notes,
      practice.hintLevel
    );

    completeSession("practice", evaluation, {
      hintsUsed: practice.hintLevel,
      prediction: { asked: 0, correct: 0 },
      practice: {
        strategyId: practice.selectedStrategyId,
        expectedAnswer: practice.answer,
        movePlan: practice.movePlan,
        selfConfidence: practice.selfConfidence,
      },
      completed: result.correct,
      message: "Practice attempt graded and stored with hint usage and confidence.",
    });
  }

  const progressPercent =
    trace.length <= 1
      ? 100
      : Math.round((timeline.activeIndex / (trace.length - 1)) * 100);
  const lockMessage =
    lockState.reason && (timeline.lockedTargetIndex !== null || lockState.indices.length > 0)
      ? lockState.reason
      : "Timeline is fully unlocked for this mode.";
  const mastery = problemProgress?.mastery ?? 0;

  const inputArea = (
    <div className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Scenario Builder</h2>
          <p className="text-sm text-slate-500">
            Use presets or enter custom arrays to keep every mode grounded in the same trace.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => run(preset.values)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            {preset.name}
            {preset.summary ? (
              <span className="ml-1 text-slate-400">- {preset.summary}</span>
            ) : null}
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-medium text-slate-700">
        <span>prices</span>
        <input
          value={inputs.prices}
          onChange={(event) =>
            setInputs((current) => ({ ...current, prices: event.target.value }))
          }
          placeholder="[7,1,5,3,6,4]"
          className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-cyan-300 focus:bg-white"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Accepts CSV, whitespace-separated numbers, or a JSON array.</span>
        <button
          onClick={() => run()}
          className="rounded-xl border border-cyan-200 bg-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
        >
          Rebuild Lesson
        </button>
      </div>
    </div>
  );

  const controls = (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={prev}
            disabled={!timeline.canPrev}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
          >
            Prev Step
          </button>
          <button
            onClick={next}
            disabled={!timeline.canNext}
            className="rounded-xl border border-cyan-200 bg-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_26px_rgba(34,211,238,0.2)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          >
            Next Step
          </button>
          <button
            onClick={timeline.isPlaying ? pause : play}
            disabled={mode !== "learn"}
            className="rounded-xl border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition-all hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            {timeline.isPlaying ? "Pause" : "Autoplay"}
          </button>
          <button
            onClick={() => {
                reset();
                pause();
              }}
            className="rounded-xl border border-emerald-200 bg-white px-5 py-2 text-sm font-medium text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs text-slate-600">
            Step{" "}
            <span className="font-mono font-semibold text-slate-800">
              {timeline.activeIndex + 1}/{Math.max(trace.length, 1)}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setSpeed(speed as 0.5 | 1 | 2)}
                className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                  timeline.speed === speed
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <span>Reveal Progress</span>
            <span className="font-mono text-slate-700">{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
          <span className="font-semibold text-slate-900">Timeline gate:</span>{" "}
          {lockMessage}
        </div>
      </div>
    </section>
  );

  let modeExperience: React.ReactNode;

  if (mode === "prediction") {
    modeExperience = (
      <PredictionCheckpointCard
        checkpoint={prediction.checkpoint}
        feedback={prediction.feedback}
        askedCount={prediction.askedCount}
        correctCount={prediction.correctCount}
        onSelect={handlePredictionSelection}
      />
    );
  } else if (mode === "practice") {
    modeExperience = (
      <PracticeWorkbench
        config={practiceConfig}
        selectedStrategyId={practice.selectedStrategyId}
        onSelectStrategy={practice.setSelectedStrategyId}
        answer={practice.answer}
        onAnswerChange={practice.setAnswer}
        movePlan={practice.movePlan}
        onMovePlanChange={practice.setMovePlan}
        selfConfidence={practice.selfConfidence}
        onConfidenceChange={practice.setSelfConfidence}
        visibleHints={practice.visibleHints}
        evaluation={practice.evaluation}
        solutionUnlocked={practice.solutionUnlocked}
        onUnlockHint={practice.unlockNextHint}
        onEvaluate={handlePracticeEvaluation}
      />
    );
  } else if (mode === "interview") {
    modeExperience = (
      <InterviewWorkbench
        config={interviewConfig}
        strategyOptions={practiceConfig.strategyOptions}
        selectedStrategyId={interview.selectedStrategyId}
        onSelectStrategy={interview.setSelectedStrategyId}
        answer={interview.answer}
        onAnswerChange={interview.setAnswer}
        selfConfidence={interview.selfConfidence}
        onConfidenceChange={interview.setSelfConfidence}
        hintBudget={interview.hintBudget}
        hintRequests={interview.hintRequests}
        visibleHints={interview.visibleHints}
        timeRemainingSec={interview.timeRemainingSec}
        evaluation={interview.evaluation}
        timedOut={interview.timedOut}
        onRequestHint={interview.requestHint}
        onSubmit={interview.submitInterview}
      />
    );
  } else {
    modeExperience = (
      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-center gap-3">
          <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Guided Lesson Mode
            </h2>
            <p className="text-sm text-slate-500">
              This is the calmest lane: autoplay is enabled, notes are immediate,
              and the trace is optimized for understanding before assessment.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Current action",
              value: step.actionKind,
              detail: step.action,
            },
            {
              label: "Teaching lens",
              value: "Beginner + expert",
              detail: `${step.beginnerNote} ${step.expertNote}`,
            },
            {
              label: "Why paid",
              value: "Guided retention",
              detail:
                "The same trace later becomes prediction, practice, and interview content without rebuilding the lesson.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const sidebar = (
    <>
      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-center gap-3">
          <span className="h-4 w-1.5 rounded-full bg-emerald-400" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Lesson Progress
            </h2>
            <p className="text-sm text-slate-500">
              Persistence is stored locally with a backend-ready session schema.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Mastery",
              value: `${mastery}%`,
              detail: "Weighted by accuracy, completion rate, and hint usage.",
            },
            {
              label: "Attempts",
              value: String(problemProgress?.attempts ?? 0),
              detail: "Every graded mode session increments attempts.",
            },
            {
              label: "Best accuracy",
              value: `${Math.round(problemProgress?.bestAccuracy ?? 0)}%`,
              detail: "Highest accuracy seen across tracked sessions.",
            },
            {
              label: "Fastest run",
              value: problemProgress?.fastestTimeMs
                ? formatTime(problemProgress.fastestTimeMs)
                : "--",
              detail: "Useful for pacing and interview readiness.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[1.2rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-slate-700">
          <span className="font-semibold text-slate-900">Session pulse:</span>{" "}
          {lastSessionMessage}
        </div>
      </section>

      <AdaptiveRecommendationRail items={recommendations} title="Adaptive Recommendations" />
      <TracePanel step={step} />
      <CodePanel step={step} />
    </>
  );

  const footer = (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div
        className={`${lightPanelClassName} p-5 ${
          step.done ? "border-emerald-200 bg-emerald-50/60" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`h-5 w-1.5 rounded-full ${
              step.done ? "bg-emerald-400" : "bg-cyan-400"
            }`}
          />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Outcome Console</h3>
            <p className="text-sm text-slate-500">
              The same result panel works for guided, predictive, practice, and interview sessions.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
          maxProfit = {step.state.result ?? step.state.totalProfit}
        </div>

        <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-slate-700">
          <span className="font-semibold text-slate-900">Current action:</span>{" "}
          {step.beginnerNote}
        </div>
      </div>

      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-center gap-3">
          <span className="h-4 w-1.5 rounded-full bg-amber-400" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Lesson History
            </h2>
            <p className="text-sm text-slate-500">
              Session summaries create retention hooks that justify a subscription.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {recentSessions.length === 0 ? (
            <div className="rounded-[1.1rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              Complete a graded mode to generate session history.
            </div>
          ) : (
            recentSessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="rounded-[1rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {session.mode}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(session.endedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <div>{session.evaluation.finalScore}/100</div>
                    <div>{formatTime(session.durationMs)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  return (
    <AcademyLessonShell
      problemId={problemId}
      taxonomy={`Array / String / Premium Guided Lesson / ${stockIILessonDefinition.taxonomy}`}
      title={stockIILessonDefinition.title}
      difficulty={stockIILessonDefinition.difficulty}
      description="A trace-driven greedy visualizer has been upgraded into a monetizable lesson: prediction checkpoints, practice gating, interview simulation, persistent progress, and adaptive next steps all sit on top of the same algorithm state model."
      complexity="O(n) time / O(1) extra space"
      activeMode={mode}
      onModeChange={switchMode}
      inputArea={inputArea}
      controls={controls}
      modeExperience={modeExperience}
      visualization={<StockProfitIIVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode="expert" />}
      sidebar={sidebar}
      footer={footer}
      mastery={mastery}
      sessionInsight={sessionInsightForMode(mode)}
    />
  );
}
