"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/backtracking/n-queens-ii/CodePanel";
import Controls from "../../../components/backtracking/n-queens-ii/Controls";
import MicroscopeView from "../../../components/backtracking/n-queens-ii/MicroscopeView";
import NQueensWorkbench from "../../../components/backtracking/n-queens-ii/NQueensWorkbench";
import TracePanel from "../../../components/backtracking/n-queens-ii/TracePanel";
import {
  formatPlacementBoard,
  generateTrace,
  parseNQueensInput,
  type NQueensTraceStep,
} from "../../../components/backtracking/n-queens-ii/generateTrace";

const defaultInput = "4";

const presets = [
  {
    name: "Example 1",
    value: "4",
    output: "2",
  },
  {
    name: "Single Queen",
    value: "1",
    output: "1",
  },
  {
    name: "Five Queens",
    value: "5",
    output: "10",
  },
] as const;

export default function NQueensIIPage() {
  const [input, setInput] = useState(defaultInput);
  const [trace, setTrace] = useState<NQueensTraceStep[]>(() =>
    generateTrace(defaultInput)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValue(value: string) {
    setInput(value);
    setTrace(generateTrace(value));
    setCursor(0);
  }

  const normalized = parseNQueensInput(input);

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,113,133,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/backtracking" label="Backtracking" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Backtracking / Constraint Sets / Chessboard Search
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">N-Queens II</span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Place one queen per row, reject attacked squares instantly through
            column and diagonal guards, and count every complete non-attacking
            board that survives the full search.
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
                  onClick={() => runWithValue(preset.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name} <span className="text-slate-500">-&gt; {preset.output}</span>
                </button>
              ))}
            </div>

            <label className="text-xs font-medium text-slate-400">
              Board size n
            </label>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input-field mt-2"
              placeholder="4"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Interactive traces are easiest to read for n up to about 6. Normalized n: {normalized}
              </span>
              <button onClick={() => runWithValue(input)} className="btn-neon btn-neon-cyan">
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

            <NQueensWorkbench step={step} />
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
                totalNQueens(...) = {step.state.solutions}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Board Size
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.n}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Solutions
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {step.state.solutions}
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
                  {step.state.solutionBoards.length === 0
                    ? "none"
                    : formatPlacementBoard(
                        step.state.solutionBoards[step.state.solutionBoards.length - 1]
                      )}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
