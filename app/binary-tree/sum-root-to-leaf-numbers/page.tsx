"use client";

import { useState } from "react";

import CodePanel from "../../../components/binary-tree/sum-root-to-leaf-numbers/CodePanel";
import CompletedPathsTable from "../../../components/binary-tree/sum-root-to-leaf-numbers/CompletedPathsTable";
import Controls from "../../../components/binary-tree/sum-root-to-leaf-numbers/Controls";
import MicroscopeView from "../../../components/binary-tree/sum-root-to-leaf-numbers/MicroscopeView";
import SumRootToLeafWorkbench from "../../../components/binary-tree/sum-root-to-leaf-numbers/SumRootToLeafWorkbench";
import TracePanel from "../../../components/binary-tree/sum-root-to-leaf-numbers/TracePanel";
import {
  formatSumResult,
  generateTrace,
  type SumRootTraceStep,
} from "../../../components/binary-tree/sum-root-to-leaf-numbers/generateTrace";
import BackButton from "../../../components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "../../../components/ui/InputPanel";

const defaultTree = "4,9,0,5,1";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "Level-order tree input",
    type: "text",
    placeholder: "e.g. 4,9,0,5,1",
    defaultValue: defaultTree,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: {
      root: "1,2,3",
    },
  },
  {
    name: "Example 2",
    values: {
      root: "4,9,0,5,1",
    },
  },
  {
    name: "Single Digit",
    values: {
      root: "7",
    },
  },
  {
    name: "Empty Tree",
    values: {
      root: "[]",
    },
  },
];

export default function SumRootToLeafNumbersPage() {
  const [treeInput, setTreeInput] = useState(defaultTree);
  const [trace, setTrace] = useState<SumRootTraceStep[]>(() =>
    generateTrace(defaultTree)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function handleRun(values: Record<string, string>) {
    const nextTree = values.root ?? "";
    setTreeInput(nextTree);
    setTrace(generateTrace(nextTree));
    setCursor(0);
  }

  const displayedResult = step.done
    ? step.state.result
    : step.state.totalSumSoFar;

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/binary-tree" label="Binary Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Tree / Root-to-Leaf Arithmetic
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Sum Root to Leaf Numbers
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Each root-to-leaf path is read as a decimal number. This visualizer
            shows how DFS builds those numbers digit by digit and then combines
            the returned subtree totals into one final sum.
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <InputPanel
            fields={inputFields}
            presets={presets}
            onRun={handleRun}
            accentColor="#22d3ee"
          />
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

            <SumRootToLeafWorkbench step={step} />
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
                sumNumbers = {formatSumResult(displayedResult)}
              </span>
            </div>

            <div className="mt-4">
              <CompletedPathsTable
                title="Leaf Contributions"
                paths={step.state.completedPaths}
                nodes={step.state.nodes}
                total={step.state.totalSumSoFar}
                highlightLeafId={step.pointers.focusLeafId}
                emptyLabel="No completed root-to-leaf numbers have been recorded yet."
                helperText="These are the exact path numbers already added into the sum."
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Input:{" "}
                <span className="font-mono text-slate-200">
                  {treeInput.trim() || "[]"}
                </span>
              </span>
              <span>
                Steps:{" "}
                <span className="font-mono text-slate-200">{trace.length}</span>
              </span>
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(n) time / O(h) stack space
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
