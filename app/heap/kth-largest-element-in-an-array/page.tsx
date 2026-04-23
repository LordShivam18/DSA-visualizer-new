"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/heap/kth-largest-element-in-an-array/CodePanel";
import Controls from "../../../components/heap/kth-largest-element-in-an-array/Controls";
import KthLargestWorkbench from "../../../components/heap/kth-largest-element-in-an-array/KthLargestWorkbench";
import MicroscopeView from "../../../components/heap/kth-largest-element-in-an-array/MicroscopeView";
import TracePanel from "../../../components/heap/kth-largest-element-in-an-array/TracePanel";
import {
  formatAnswer,
  generateTrace,
  type KthLargestTraceStep,
} from "../../../components/heap/kth-largest-element-in-an-array/generateTrace";

const defaultNumbers = "3, 2, 1, 5, 6, 4";
const defaultK = "2";

const presets = [
  {
    name: "Example 1",
    numbers: "3, 2, 1, 5, 6, 4",
    k: "2",
    output: "5",
  },
  {
    name: "Example 2",
    numbers: "3, 2, 3, 1, 2, 4, 5, 5, 6",
    k: "4",
    output: "4",
  },
  {
    name: "Descending",
    numbers: "10, 9, 8, 7, 6, 5",
    k: "3",
    output: "8",
  },
] as const;

export default function KthLargestElementInArrayPage() {
  const [numbersInput, setNumbersInput] = useState(defaultNumbers);
  const [kInput, setKInput] = useState(defaultK);
  const [trace, setTrace] = useState<KthLargestTraceStep[]>(() =>
    generateTrace(defaultNumbers, defaultK)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValues(nextNumbers: string, nextK: string) {
    setNumbersInput(nextNumbers);
    setKInput(nextK);
    setTrace(generateTrace(nextNumbers, nextK));
    setCursor(0);
  }

  const liveAnswer = step.done ? step.state.answer : step.state.heapTop?.value ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/heap" label="Heap" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Heap / Min-Heap / Top-k Filtering
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Kth Largest Element in an Array
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Stream the numbers through a size-k min-heap and watch smaller
            survivors get trimmed away until the kth largest value sits at the
            root.
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
                  onClick={() => runWithValues(preset.numbers, preset.k)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name}{" "}
                  <span className="text-slate-500">{"->"} {preset.output}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Numbers
                </label>
                <input
                  value={numbersInput}
                  onChange={(event) => setNumbersInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="3, 2, 1, 5, 6, 4"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">k</label>
                <input
                  value={kInput}
                  onChange={(event) => setKInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="2"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Use comma or space separated numbers. k is clamped to a valid rank.
              </span>
              <button
                onClick={() => runWithValues(numbersInput, kInput)}
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

            <KthLargestWorkbench step={step} />
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
                kthLargest = {formatAnswer(liveAnswer)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Heap Root
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.heapTop?.value ?? "none"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Heap Size
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.heap.length}/{step.state.k}
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
                  O(n log k) time / O(k) space
                </span>
              </span>
              <span>
                Last removed:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.lastRemoved?.value ?? "none"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
