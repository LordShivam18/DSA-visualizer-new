"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/backtracking/combination-sum/CodePanel";
import CombinationSumWorkbench from "../../../components/backtracking/combination-sum/CombinationSumWorkbench";
import Controls from "../../../components/backtracking/combination-sum/Controls";
import MicroscopeView from "../../../components/backtracking/combination-sum/MicroscopeView";
import TracePanel from "../../../components/backtracking/combination-sum/TracePanel";
import {
  formatCombinationSumResults,
  generateTrace,
  parseCombinationSumInput,
  type CombinationSumTraceStep,
} from "../../../components/backtracking/combination-sum/generateTrace";

const defaultCandidates = "[2,3,6,7]";
const defaultTarget = "7";

const presets = [
  {
    name: "Example 1",
    candidates: "[2,3,6,7]",
    target: "7",
    output: "[[2,2,3],[7]]",
  },
  {
    name: "Example 2",
    candidates: "[2,3,5]",
    target: "8",
    output: "[[2,2,2,2],[2,3,3],[3,5]]",
  },
  {
    name: "Tight Prune",
    candidates: "[4,5,11]",
    target: "12",
    output: "[[4,4,4]]",
  },
] as const;

export default function CombinationSumPage() {
  const [candidatesInput, setCandidatesInput] = useState(defaultCandidates);
  const [targetInput, setTargetInput] = useState(defaultTarget);
  const [trace, setTrace] = useState<CombinationSumTraceStep[]>(() =>
    generateTrace(defaultCandidates, defaultTarget)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValues(nextCandidates: string, nextTarget: string) {
    setCandidatesInput(nextCandidates);
    setTargetInput(nextTarget);
    setTrace(generateTrace(nextCandidates, nextTarget));
    setCursor(0);
  }

  const normalized = parseCombinationSumInput(candidatesInput, targetInput);

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/backtracking" label="Backtracking" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Backtracking / Remaining Target / Reusable Candidates
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">Combination Sum</span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Keep subtracting the chosen candidate from the remaining target,
            reuse the same index when needed, and prune the moment a branch
            overshoots the target.
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <div className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Input
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => runWithValues(preset.candidates, preset.target)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name} <span className="text-slate-500">-&gt; {preset.output}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Candidates
                </label>
                <input
                  value={candidatesInput}
                  onChange={(event) => setCandidatesInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="[2,3,6,7]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Target
                </label>
                <input
                  value={targetInput}
                  onChange={(event) => setTargetInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="7"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Normalized candidates: [{normalized.candidates.join(", ")}], target {normalized.target}
              </span>
              <button
                onClick={() => runWithValues(candidatesInput, targetInput)}
                className="btn-neon btn-neon-cyan"
              >
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-4 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
          <span className="font-semibold text-slate-50">Current action:</span>{" "}
          {mode === "beginner"
            ? step.explanationBeginner
            : step.explanationExpert}
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.92fr)]">
          <section className="space-y-5">
            <Controls
              stepIndex={cursor}
              totalSteps={trace.length}
              mode={mode}
              onModeChange={setMode}
              onPrev={() => setCursor((current) => Math.max(current - 1, 0))}
              onNext={() =>
                setCursor((current) => Math.min(current + 1, trace.length - 1))
              }
              onReset={() => setCursor(0)}
              canPrev={canPrev}
              canNext={canNext}
            />

            <CombinationSumWorkbench step={step} />
            <MicroscopeView step={step} mode={mode} />
          </section>

          <aside className="space-y-5">
            <TracePanel step={step} />
            <CodePanel step={step} />
          </aside>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <div
            className={`glass-card p-5 ${
              step.done
                ? "border-emerald-400/30 bg-emerald-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.done ? "bg-emerald-400" : "bg-cyan-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done ? "text-emerald-400" : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span className={step.done ? "text-emerald-300" : "text-cyan-300"}>
                combinationSum(...) = {formatCombinationSumResults(step.state.results)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Candidates
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.candidates.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Solutions
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {step.state.results.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Trace Steps
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {trace.length}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  exponential backtracking
                </span>
              </span>
              <span>
                Last solution:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.results.length === 0
                    ? "none"
                    : `[${step.state.results[step.state.results.length - 1].join(", ")}]`}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
