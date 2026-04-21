"use client";

import { useState } from "react";

import CodePanel from "../../../components/bst/validate-binary-search-tree/CodePanel";
import Controls from "../../../components/bst/validate-binary-search-tree/Controls";
import MicroscopeView from "../../../components/bst/validate-binary-search-tree/MicroscopeView";
import TracePanel from "../../../components/bst/validate-binary-search-tree/TracePanel";
import ValidateBSTWorkbench from "../../../components/bst/validate-binary-search-tree/ValidateBSTWorkbench";
import {
  formatResult,
  generateTrace,
  type ValidateTraceStep,
} from "../../../components/bst/validate-binary-search-tree/generateTrace";
import BackButton from "../../../components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "../../../components/ui/InputPanel";

const defaultTree = "[2,1,3]";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "Binary tree level-order input",
    type: "text",
    placeholder: "e.g. [2,1,3]",
    defaultValue: defaultTree,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: { root: "[2,1,3]" },
  },
  {
    name: "Invalid Example",
    values: { root: "[5,1,4,null,null,3,6]" },
  },
  {
    name: "Ancestor Trap",
    values: { root: "[10,5,15,null,null,6,20]" },
  },
  {
    name: "Duplicate",
    values: { root: "[2,2,3]" },
  },
  {
    name: "Empty",
    values: { root: "[]" },
  },
];

export default function ValidateBinarySearchTreePage() {
  const [treeInput, setTreeInput] = useState(defaultTree);
  const [trace, setTrace] = useState<ValidateTraceStep[]>(() =>
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

  const outputLabel = step.done
    ? `isValidBST = ${formatResult(step.state.result)}`
    : `status = ${formatResult(step.state.result)}`;

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,113,133,0.09),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/bst" label="Binary Search Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Search Tree / Strict Range Validation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Validate{" "}
            <span className="text-cyan-400 text-glow-cyan">
              Binary Search Tree
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This visualizer teaches LeetCode 98 by carrying exclusive lower and
            upper bounds into every subtree. Parent-only checks are not enough;
            each node must also respect every ancestor constraint.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
              Example Input <span className="font-mono text-cyan-200">[2,1,3]</span>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
              Example Output <span className="font-mono">true</span>
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

            <ValidateBSTWorkbench step={step} />
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
                ? step.state.result
                  ? "border-emerald-400/30 bg-emerald-500/5"
                  : "border-rose-400/30 bg-rose-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.done
                    ? step.state.result
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
                    ? step.state.result
                      ? "text-emerald-400"
                      : "text-rose-400"
                    : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Checking"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span
                className={
                  step.done
                    ? step.state.result
                      ? "text-emerald-300"
                      : "text-rose-300"
                    : "text-cyan-300"
                }
              >
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
                Steps: <span className="font-mono text-slate-200">{trace.length}</span>
              </span>
              <span>
                Checks:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.records.length}
                </span>
              </span>
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(n) time / O(h) stack
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
