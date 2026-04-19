"use client";

import { useState } from "react";

import CodePanel from "../../../components/binary-tree/path-sum/CodePanel";
import Controls from "../../../components/binary-tree/path-sum/Controls";
import MicroscopeView from "../../../components/binary-tree/path-sum/MicroscopeView";
import PathExpressionStrip from "../../../components/binary-tree/path-sum/PathExpressionStrip";
import PathSumWorkbench from "../../../components/binary-tree/path-sum/PathSumWorkbench";
import TracePanel from "../../../components/binary-tree/path-sum/TracePanel";
import {
  formatBooleanResult,
  generateTrace,
  type PathSumTraceStep,
} from "../../../components/binary-tree/path-sum/generateTrace";
import BackButton from "../../../components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "../../../components/ui/InputPanel";

const defaultTree = "5,4,8,11,null,13,4,7,2,null,null,null,1";
const defaultTarget = "22";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "Level-order tree input",
    type: "text",
    placeholder: "e.g. 5,4,8,11,null,13,4,7,2,null,null,null,1",
    defaultValue: defaultTree,
  },
  {
    key: "target",
    label: "Target sum",
    type: "text",
    placeholder: "e.g. 22",
    defaultValue: defaultTarget,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: {
      root: "5,4,8,11,null,13,4,7,2,null,null,null,1",
      target: "22",
    },
  },
  {
    name: "Example 2",
    values: {
      root: "1,2,3",
      target: "5",
    },
  },
  {
    name: "Empty Tree",
    values: {
      root: "[]",
      target: "0",
    },
  },
  {
    name: "Negative Path",
    values: {
      root: "1,-2,-3,1,3,-2,null,-1",
      target: "-1",
    },
  },
];

export default function PathSumPage() {
  const [treeInput, setTreeInput] = useState(defaultTree);
  const [targetInput, setTargetInput] = useState(defaultTarget);
  const [trace, setTrace] = useState<PathSumTraceStep[]>(() =>
    generateTrace(defaultTree, defaultTarget)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function handleRun(values: Record<string, string>) {
    const nextTree = values.root ?? "";
    const nextTarget = values.target ?? "";
    setTreeInput(nextTree);
    setTargetInput(nextTarget);
    setTrace(generateTrace(nextTree, nextTarget));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(52,211,153,0.10),transparent_26%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/binary-tree" label="Binary Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Tree / Recursive DFS
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">Path Sum</span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Check whether any root-to-leaf path adds up to the target. This
            visualizer shows the recursive DFS, the live path arithmetic, and
            the call stack that backtracks through dead ends.
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

            <PathSumWorkbench step={step} />
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
              step.state.result === true
                ? "border-emerald-400/30 bg-emerald-500/5"
                : step.done
                ? "border-rose-400/30 bg-rose-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.state.result === true
                    ? "bg-emerald-400"
                    : step.done
                    ? "bg-rose-400"
                    : "bg-cyan-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Result
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.state.result === true
                    ? "text-emerald-400"
                    : step.done
                    ? "text-rose-300"
                    : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Searching"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span
                className={
                  step.state.result === true
                    ? "text-emerald-300"
                    : step.done
                    ? "text-rose-300"
                    : "text-cyan-300"
                }
              >
                hasPathSum = {formatBooleanResult(step.state.result)}
              </span>
            </div>

            <div className="mt-4">
              <PathExpressionStrip
                title="Winning Path"
                ids={step.state.successPathIds}
                nodes={step.state.nodes}
                accent="emerald"
                emptyLabel="No matching root-to-leaf path has been found."
                helperText="If the answer is true, this is the exact path responsible for it."
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
                Target:{" "}
                <span className="font-mono text-slate-200">
                  {targetInput.trim() || "0"}
                </span>
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
