"use client";

import { useState } from "react";

import CodePanel from "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/CodePanel";
import Controls from "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/Controls";
import MicroscopeView from "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/MicroscopeView";
import TracePanel from "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/TracePanel";
import ZigzagLevelOrderWorkbench from "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/ZigzagLevelOrderWorkbench";
import {
  formatNestedLevels,
  generateTrace,
  type ZigzagTraceStep,
} from "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/generateTrace";
import BackButton from "../../../components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "../../../components/ui/InputPanel";

const defaultTree = "[3,9,20,null,null,15,7]";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "Binary tree (level order)",
    type: "text",
    placeholder: "e.g. [3,9,20,null,null,15,7]",
    defaultValue: defaultTree,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: {
      root: "[3,9,20,null,null,15,7]",
    },
  },
  {
    name: "Single Node",
    values: {
      root: "[1]",
    },
  },
  {
    name: "Sparse",
    values: {
      root: "[1,null,2,3]",
    },
  },
  {
    name: "Wide Tree",
    values: {
      root: "[1,2,3,4,5,6,7,8,9,10,11]",
    },
  },
  {
    name: "Empty Tree",
    values: {
      root: "[]",
    },
  },
];

export default function BinaryTreeZigzagLevelOrderTraversalPage() {
  const [treeInput, setTreeInput] = useState(defaultTree);
  const [trace, setTrace] = useState<ZigzagTraceStep[]>(() =>
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

  const progressLabel = step.done
    ? `zigzagLevelOrder = ${formatNestedLevels(step.state.resultLevels)}`
    : `zigzag rows so far = ${formatNestedLevels(step.state.resultLevels)}`;

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/binary-tree-bfs" label="Binary Tree BFS" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Tree BFS / Zigzag Level Order Traversal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Binary Tree{" "}
            <span className="text-cyan-400 text-glow-cyan">
              Zigzag Level Order
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This visualizer teaches LeetCode 103 by keeping the BFS queue simple
            while alternating the write index for each level. The queue still
            discovers children left-to-right; the row buffer creates the zigzag output.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
              Example Input{" "}
              <span className="font-mono text-cyan-200">
                [3,9,20,null,null,15,7]
              </span>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
              Example Output{" "}
              <span className="font-mono">[[3], [20, 9], [15, 7]]</span>
            </div>
            <div className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs text-violet-100">
              Target Complexity <span className="font-mono">O(n)</span>
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

            <ZigzagLevelOrderWorkbench step={step} />
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
                {progressLabel}
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
                Steps:{" "}
                <span className="font-mono text-slate-200">{trace.length}</span>
              </span>
              <span>
                Levels Resolved:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.levelSummaries.length}
                </span>
              </span>
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(n) time / O(w) queue
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
