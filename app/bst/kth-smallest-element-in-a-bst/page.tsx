"use client";

import { useState } from "react";

import CodePanel from "../../../components/bst/kth-smallest-element-in-a-bst/CodePanel";
import Controls from "../../../components/bst/kth-smallest-element-in-a-bst/Controls";
import KthSmallestWorkbench from "../../../components/bst/kth-smallest-element-in-a-bst/KthSmallestWorkbench";
import MicroscopeView from "../../../components/bst/kth-smallest-element-in-a-bst/MicroscopeView";
import TracePanel from "../../../components/bst/kth-smallest-element-in-a-bst/TracePanel";
import {
  formatResult,
  generateTrace,
  type KthTraceStep,
} from "../../../components/bst/kth-smallest-element-in-a-bst/generateTrace";
import BackButton from "../../../components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "../../../components/ui/InputPanel";

const defaultTree = "[3,1,4,null,2]";
const defaultK = "1";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "BST level-order input",
    type: "text",
    placeholder: "e.g. [3,1,4,null,2]",
    defaultValue: defaultTree,
  },
  {
    key: "k",
    label: "k (1-indexed rank)",
    type: "number",
    placeholder: "e.g. 1",
    defaultValue: defaultK,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: { root: "[3,1,4,null,2]", k: "1" },
  },
  {
    name: "Example 2",
    values: { root: "[5,3,6,2,4,null,null,1]", k: "3" },
  },
  {
    name: "Balanced",
    values: { root: "[8,3,10,1,6,null,14,null,null,4,7,13]", k: "5" },
  },
  {
    name: "Right Chain",
    values: { root: "[1,null,2,null,3,null,4]", k: "4" },
  },
  {
    name: "Out of Range",
    values: { root: "[2,1,3]", k: "5" },
  },
];

export default function KthSmallestElementInABSTPage() {
  const [treeInput, setTreeInput] = useState(defaultTree);
  const [kInput, setKInput] = useState(defaultK);
  const [trace, setTrace] = useState<KthTraceStep[]>(() =>
    generateTrace(defaultTree, defaultK)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function handleRun(values: Record<string, string>) {
    const nextTree = values.root ?? "";
    const nextK = values.k ?? "";
    setTreeInput(nextTree);
    setKInput(nextK);
    setTrace(generateTrace(nextTree, nextK));
    setCursor(0);
  }

  const outputLabel = step.state.invalidReason
    ? step.state.invalidReason
    : step.done
    ? `kthSmallest = ${formatResult(step.state.resultValue)}`
    : `current count = ${step.state.count}, result = ${formatResult(step.state.resultValue)}`;

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/bst" label="Binary Search Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Search Tree / Sorted Rank Query
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Kth Smallest Element{" "}
            <span className="text-cyan-400 text-glow-cyan">in a BST</span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This visualizer teaches LeetCode 230 by walking the BST in sorted
            inorder order and counting ranks. The moment count reaches k, the
            traversal returns without scanning unnecessary larger values.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
              Example Input{" "}
              <span className="font-mono text-cyan-200">
                root = [3,1,4,null,2], k = 1
              </span>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
              Example Output <span className="font-mono">1</span>
            </div>
            <div className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs text-violet-100">
              Target Complexity <span className="font-mono">O(h + k)</span>
            </div>
          </div>
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

            <KthSmallestWorkbench step={step} />
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
                {step.done ? "Resolved" : "Counting"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span className={step.done ? "text-emerald-300" : "text-cyan-300"}>
                {outputLabel}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Input:{" "}
                <span className="font-mono text-slate-200">
                  {treeInput.trim() || "[]"}
                </span>
              </span>
              <span>
                k: <span className="font-mono text-slate-200">{kInput}</span>
              </span>
              <span>
                Steps: <span className="font-mono text-slate-200">{trace.length}</span>
              </span>
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(h + k) time / O(h) stack
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
