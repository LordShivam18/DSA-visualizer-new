"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/heap/find-k-pairs-with-smallest-sums/CodePanel";
import Controls from "../../../components/heap/find-k-pairs-with-smallest-sums/Controls";
import MicroscopeView from "../../../components/heap/find-k-pairs-with-smallest-sums/MicroscopeView";
import SmallestPairsWorkbench from "../../../components/heap/find-k-pairs-with-smallest-sums/SmallestPairsWorkbench";
import TracePanel from "../../../components/heap/find-k-pairs-with-smallest-sums/TracePanel";
import {
  formatPairs,
  generateTrace,
  type KSmallestPairsTraceStep,
} from "../../../components/heap/find-k-pairs-with-smallest-sums/generateTrace";

const defaultNums1 = "1, 7, 11";
const defaultNums2 = "2, 4, 6";
const defaultK = "3";

const presets = [
  {
    name: "Example 1",
    nums1: "1, 7, 11",
    nums2: "2, 4, 6",
    k: "3",
    output: "[[1, 2], [1, 4], [1, 6]]",
  },
  {
    name: "Example 2",
    nums1: "1, 1, 2",
    nums2: "1, 2, 3",
    k: "2",
    output: "[[1, 1], [1, 1]]",
  },
  {
    name: "Tight Grid",
    nums1: "1, 2, 3",
    nums2: "1, 2",
    k: "4",
    output: "[[1, 1], [1, 2], [2, 1], [2, 2]]",
  },
] as const;

export default function FindKPairsWithSmallestSumsPage() {
  const [nums1Input, setNums1Input] = useState(defaultNums1);
  const [nums2Input, setNums2Input] = useState(defaultNums2);
  const [kInput, setKInput] = useState(defaultK);
  const [trace, setTrace] = useState<KSmallestPairsTraceStep[]>(() =>
    generateTrace(defaultNums1, defaultNums2, defaultK)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValues(nextNums1: string, nextNums2: string, nextK: string) {
    setNums1Input(nextNums1);
    setNums2Input(nextNums2);
    setKInput(nextK);
    setTrace(generateTrace(nextNums1, nextNums2, nextK));
    setCursor(0);
  }

  const liveAnswer = step.state.answer;

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/heap" label="Heap" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Heap / Frontier Expansion / Sorted Grid
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Find K Pairs with Smallest Sums
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Treat the two arrays like a sorted matrix of pair sums and let a
            min-heap reveal only the next promising cell from each row.
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
                  onClick={() => runWithValues(preset.nums1, preset.nums2, preset.k)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name}{" "}
                  <span className="text-slate-500">{"->"} {preset.output}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px]">
              <div>
                <label className="text-xs font-medium text-slate-400">nums1</label>
                <input
                  value={nums1Input}
                  onChange={(event) => setNums1Input(event.target.value)}
                  className="input-field mt-2"
                  placeholder="1, 7, 11"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">nums2</label>
                <input
                  value={nums2Input}
                  onChange={(event) => setNums2Input(event.target.value)}
                  className="input-field mt-2"
                  placeholder="2, 4, 6"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">k</label>
                <input
                  value={kInput}
                  onChange={(event) => setKInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="3"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Arrays should be sorted in non-decreasing order to match the heap strategy.
              </span>
              <button
                onClick={() => runWithValues(nums1Input, nums2Input, kInput)}
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

            <SmallestPairsWorkbench step={step} />
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
                pairs = {formatPairs(liveAnswer)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Output Count
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.resultPairs.length}/{step.state.k}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Heap Size
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.heap.length}
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
                  O(k log min(k, nums1.size())) time / O(min(k, nums1.size())) space
                </span>
              </span>
              <span>
                Seed rows:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.seedLimit}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
