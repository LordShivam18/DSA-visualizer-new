"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/graph-traversal/surrounded-regions/CodePanel";
import Controls from "../../../components/graph-traversal/surrounded-regions/Controls";
import MicroscopeView from "../../../components/graph-traversal/surrounded-regions/MicroscopeView";
import SurroundedRegionsWorkbench from "../../../components/graph-traversal/surrounded-regions/SurroundedRegionsWorkbench";
import TracePanel from "../../../components/graph-traversal/surrounded-regions/TracePanel";
import {
  formatBoard,
  generateTrace,
  type SurroundedRegionsTraceStep,
} from "../../../components/graph-traversal/surrounded-regions/generateTrace";

const defaultInput = `XXXX
XOOX
XXOX
XOXX`;

const presets = [
  {
    name: "Example 1",
    value: `XXXX
XOOX
XXOX
XOXX`,
  },
  {
    name: "Cross",
    value: `XOOOX
OOXOO
XXXXX
OOXOO
XOOOX`,
  },
  {
    name: "All Safe",
    value: `OOOO
OXXO
OXXO
OOOO`,
  },
] as const;

export default function SurroundedRegionsPage() {
  const [input, setInput] = useState(defaultInput);
  const [trace, setTrace] = useState<SurroundedRegionsTraceStep[]>(() =>
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

  const outputBoard = step.state.result
    ? formatBoard(step.state.result)
    : formatBoard(
        step.state.board.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            step.state.captured[rowIndex][colIndex] ? "X" : cell
          )
        )
      );

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/graph-traversal" label="Graph Traversal" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Graph Traversal / Border Reachability / Flood Fill
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-rose-400 [text-shadow:0_0_18px_rgba(244,63,94,0.55)]">
              Surrounded Regions
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Instead of asking which O cells are surrounded, this visualizer asks
            the easier opposite question: which O cells can escape to the border?
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <div className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-rose-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Input
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => runWithValue(preset.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-rose-400/40 hover:text-rose-100"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <label className="text-xs font-medium text-slate-400">
              Board rows
            </label>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input-field mt-2 min-h-[170px] resize-y"
              placeholder={"Use newline rows like XXXX\\nXOOX\\nXXOX\\nXOXX"}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Accepted formats: plain X/O rows, pipe-separated rows, or JSON arrays
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

            <SurroundedRegionsWorkbench step={step} />
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
                  step.done ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done ? "text-emerald-400" : "text-rose-300"
                }`}
              >
                {step.done ? "Resolved" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-sm leading-7 text-slate-200">
              solve(board) = {outputBoard}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Border Seeds
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.borderSeedCount}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Safe Cells
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {step.state.safeCount}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Captured
                </p>
                <p className="mt-2 text-2xl font-semibold text-rose-200">
                  {step.state.capturedCount}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(rows * cols) time / O(rows * cols) space
                </span>
              </span>
              <span>
                Trace steps:{" "}
                <span className="font-mono text-slate-200">{trace.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
