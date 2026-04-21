"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/binary-search/find-first-last-position/CodePanel";
import Controls from "../../../components/binary-search/find-first-last-position/Controls";
import MicroscopeView from "../../../components/binary-search/find-first-last-position/MicroscopeView";
import RangeSearchVisualizer from "../../../components/binary-search/find-first-last-position/RangeSearchVisualizer";
import TracePanel from "../../../components/binary-search/find-first-last-position/TracePanel";
import {
  generateTrace,
  type RangeSearchTraceStep,
} from "../../../components/binary-search/find-first-last-position/generateTrace";

const defaultInput = "5 7 7 8 8 10";
const defaultTarget = "8";

const presets = [
  { name: "Example 1", nums: "5 7 7 8 8 10", target: "8" },
  { name: "Example 2", nums: "5 7 7 8 8 10", target: "6" },
  { name: "Single Value", nums: "2 2 2 2", target: "2" },
] as const;

export default function FindFirstLastPositionPage() {
  const [input, setInput] = useState(defaultInput);
  const [targetInput, setTargetInput] = useState(defaultTarget);
  const [trace, setTrace] = useState<RangeSearchTraceStep[]>(() =>
    generateTrace(defaultInput, defaultTarget)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValues(nextInput: string, nextTarget: string) {
    setInput(nextInput);
    setTargetInput(nextTarget);
    setTrace(generateTrace(nextInput, nextTarget));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/binary-search" label="Binary Search" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Search / Boundaries / Duplicate Block
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Find First and Last Position
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This visualizer treats the target block like a hidden interval. One
            binary search finds the left edge, and a second mirrored search
            finds the right edge.
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
                  onClick={() => runWithValues(preset.nums, preset.target)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <label className="text-xs font-medium text-slate-400">Sorted array</label>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="input-field mt-2 min-h-[150px] resize-y"
                  placeholder={"Use values like 5 7 7 8 8 10"}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Target</label>
                <input
                  value={targetInput}
                  onChange={(event) => setTargetInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="8"
                />

                <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-400">
                  Duplicate values are exactly what make the two-pass boundary
                  idea useful here.
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Accepted formats: spaces, commas, newlines, or JSON arrays
              </span>
              <button
                onClick={() => runWithValues(input, targetInput)}
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

            <RangeSearchVisualizer step={step} />
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
              step.done && step.state.result?.[0] !== -1
                ? "border-emerald-400/30 bg-emerald-500/5"
                : step.done
                ? "border-rose-400/30 bg-rose-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.done && step.state.result?.[0] !== -1
                    ? "bg-emerald-400"
                    : "bg-cyan-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done
                    ? step.state.result?.[0] !== -1
                      ? "text-emerald-400"
                      : "text-rose-300"
                    : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              searchRange(nums, target) ={" "}
              <span
                className={
                  step.done && step.state.result?.[0] !== -1
                    ? "text-emerald-300"
                    : step.done
                    ? "text-rose-300"
                    : "text-cyan-300"
                }
              >
                {step.state.result
                  ? `[${step.state.result[0]}, ${step.state.result[1]}]`
                  : "pending"}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  First
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {step.state.firstCandidate ?? "none"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Last
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.lastCandidate ?? "none"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Trace Steps
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {trace.length}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(log n) time / O(1) space
                </span>
              </span>
              <span>
                Current phase:{" "}
                <span className="font-mono text-slate-200">{step.state.phase}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
