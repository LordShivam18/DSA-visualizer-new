"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/backtracking/word-search/CodePanel";
import Controls from "../../../components/backtracking/word-search/Controls";
import MicroscopeView from "../../../components/backtracking/word-search/MicroscopeView";
import TracePanel from "../../../components/backtracking/word-search/TracePanel";
import WordSearchWorkbench from "../../../components/backtracking/word-search/WordSearchWorkbench";
import {
  formatPath,
  formatWordSearchResult,
  generateTrace,
  type WordSearchTraceStep,
} from "../../../components/backtracking/word-search/generateTrace";

const defaultBoard = `A B C E
S F C S
A D E E`;
const defaultWord = "ABCCED";

const presets = [
  {
    name: "Example 1",
    board: defaultBoard,
    word: "ABCCED",
    output: "true",
  },
  {
    name: "Example 2",
    board: defaultBoard,
    word: "SEE",
    output: "true",
  },
  {
    name: "Blocked Reuse",
    board: defaultBoard,
    word: "ABCB",
    output: "false",
  },
] as const;

export default function WordSearchPage() {
  const [boardInput, setBoardInput] = useState(defaultBoard);
  const [wordInput, setWordInput] = useState(defaultWord);
  const [trace, setTrace] = useState<WordSearchTraceStep[]>(() =>
    generateTrace(defaultBoard, defaultWord)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValues(nextBoard: string, nextWord: string) {
    setBoardInput(nextBoard);
    setWordInput(nextWord);
    setTrace(generateTrace(nextBoard, nextWord));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,113,133,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/backtracking" label="Backtracking" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Backtracking / Grid DFS / Path Reuse Constraint
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">Word Search</span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Try each board cell as a start, walk orthogonal neighbors that match
            the next character, and backtrack the path the moment a branch
            cannot continue the word.
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
                  onClick={() => runWithValues(preset.board, preset.word)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name} <span className="text-slate-500">-&gt; {preset.output}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Board
                </label>
                <textarea
                  value={boardInput}
                  onChange={(event) => setBoardInput(event.target.value)}
                  className="input-field mt-2 min-h-[160px] resize-y"
                  placeholder={"A B C E\\nS F C S\\nA D E E"}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">
                  Word
                </label>
                <input
                  value={wordInput}
                  onChange={(event) => setWordInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="ABCCED"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Accepted board formats: spaced rows, compact rows like ABCE, or JSON arrays.
              </span>
              <button
                onClick={() => runWithValues(boardInput, wordInput)}
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

            <WordSearchWorkbench step={step} />
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
                ? step.state.found
                  ? "border-emerald-400/30 bg-emerald-500/5"
                  : "border-rose-400/30 bg-rose-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.done
                    ? step.state.found
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                    : "bg-cyan-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done
                    ? step.state.found
                      ? "text-emerald-400"
                      : "text-rose-300"
                    : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span
                className={
                  step.done
                    ? step.state.found
                      ? "text-emerald-300"
                      : "text-rose-300"
                    : "text-cyan-300"
                }
              >
                exist(...) = {formatWordSearchResult(step.state.found)}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Path:</span>{" "}
              {formatPath(step.state.successfulPath)}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Word Length
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.word.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Tested Starts
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.testedStarts.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Trace Steps
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {trace.length}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(rows * cols * 4^wordLength)
                </span>
              </span>
              <span>
                Last dead end:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.deadEndCells.length === 0
                    ? "none"
                    : `(${step.state.deadEndCells[step.state.deadEndCells.length - 1].row},${step.state.deadEndCells[step.state.deadEndCells.length - 1].col})`}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
