"use client";

import DarkTraceProblemPage from "@/components/academy/DarkTraceProblemPage";

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

const defaultInputs = {
  board: `A B C E
S F C S
A D E E`,
  word: "ABCCED",
};

const presets = [
  {
    name: "Example 1",
    summary: "-> true",
    values: defaultInputs,
  },
  {
    name: "Example 2",
    summary: "-> true",
    values: {
      board: defaultInputs.board,
      word: "SEE",
    },
  },
  {
    name: "Blocked Reuse",
    summary: "-> false",
    values: {
      board: defaultInputs.board,
      word: "ABCB",
    },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.board, values.word);
}

export default function WordSearchPage() {
  return (
    <DarkTraceProblemPage<typeof defaultInputs, WordSearchTraceStep>
      meta={{
        categoryHref: "/backtracking",
        categoryLabel: "Backtracking",
        taxonomy: "Backtracking / Grid DFS / Path Reuse Constraint",
        title: "Word Search",
        difficulty: "Medium",
        description:
          "Try each board cell as a start, walk orthogonal neighbors that match the next character, and backtrack the path the moment a branch cannot continue the word.",
        complexity: "O(rows * cols * 4^wordLength)",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        {
          key: "board",
          label: "Board",
          multiline: true,
          rows: 6,
          placeholder: "A B C E\nS F C S\nA D E E",
          helper:
            "Accepted board formats: spaced rows, compact rows like ABCE, or JSON arrays.",
        },
        {
          key: "word",
          label: "Word",
          placeholder: "ABCCED",
        },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={WordSearchWorkbench}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
      renderOutput={({ step, trace }) => (
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
      )}
    />
  );
}
