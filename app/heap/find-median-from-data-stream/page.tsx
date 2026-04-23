"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/heap/find-median-from-data-stream/CodePanel";
import Controls from "../../../components/heap/find-median-from-data-stream/Controls";
import MedianStreamWorkbench from "../../../components/heap/find-median-from-data-stream/MedianStreamWorkbench";
import MicroscopeView from "../../../components/heap/find-median-from-data-stream/MicroscopeView";
import TracePanel from "../../../components/heap/find-median-from-data-stream/TracePanel";
import {
  formatOutputs,
  generateTrace,
  type MedianStreamTraceStep,
} from "../../../components/heap/find-median-from-data-stream/generateTrace";

const defaultOperations = `add 1
add 2
median
add 3
median`;

const presets = [
  {
    name: "Example 1",
    value: `add 1
add 2
median
add 3
median`,
    output: "[null, null, 1.5, null, 2]",
  },
  {
    name: "Growing",
    value: `add 1
add 2
add 3
median
add 4
median`,
    output: "[null, null, null, 2, null, 2.5]",
  },
  {
    name: "Mixed",
    value: `add 5
add 15
median
add 1
median
add 3
median`,
    output: "[null, null, 10, null, 5, null, 4]",
  },
] as const;

export default function FindMedianFromDataStreamPage() {
  const [operationsInput, setOperationsInput] = useState(defaultOperations);
  const [trace, setTrace] = useState<MedianStreamTraceStep[]>(() =>
    generateTrace(defaultOperations)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValue(nextValue: string) {
    setOperationsInput(nextValue);
    setTrace(generateTrace(nextValue));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/heap" label="Heap" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Heap / Online Statistics / Balanced Halves
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Find Median from Data Stream
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Feed operations into a two-heap data structure and watch the balance
            invariant keep median queries constant-time.
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
                  {preset.name}{" "}
                  <span className="text-slate-500">{"->"} {preset.output}</span>
                </button>
              ))}
            </div>

            <label className="text-xs font-medium text-slate-400">
              Operations
            </label>
            <textarea
              value={operationsInput}
              onChange={(event) => setOperationsInput(event.target.value)}
              className="input-field mt-2 min-h-[180px] resize-y"
              placeholder={"add 1\\nadd 2\\nmedian\\nadd 3\\nmedian"}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Use one command per line: &quot;add 5&quot; or &quot;median&quot;. &quot;addNum&quot; and &quot;findMedian&quot; also work.
              </span>
              <button
                onClick={() => runWithValue(operationsInput)}
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

            <MedianStreamWorkbench step={step} />
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
                outputs = {formatOutputs(step.state.outputs)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Last Median
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.lastMedian ?? "none"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Stream Size
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.streamValues.length}
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
                  add O(log n), median O(1), space O(n)
                </span>
              </span>
              <span>
                Heap sizes:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.lowerHeap.length}/{step.state.upperHeap.length}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
