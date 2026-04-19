"use client";

import { useState } from "react";

import BackButton from "@/components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "@/components/ui/InputPanel";
import CodePanel from "@/components/binary-tree/flatten-binary-tree-to-linked-list/CodePanel";
import Controls from "@/components/binary-tree/flatten-binary-tree-to-linked-list/Controls";
import FlattenWorkbench from "@/components/binary-tree/flatten-binary-tree-to-linked-list/FlattenWorkbench";
import TracePanel from "@/components/binary-tree/flatten-binary-tree-to-linked-list/TracePanel";
import {
  formatSerializedOutput,
  generateTrace,
  type FlattenTraceStep,
} from "@/components/binary-tree/flatten-binary-tree-to-linked-list/generateTrace";

const defaultInput = "1,2,5,3,4,null,6";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "Level-order tree input",
    type: "text",
    placeholder: "e.g. 1,2,5,3,4,null,6",
    defaultValue: defaultInput,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: { root: "1,2,5,3,4,null,6" },
  },
  {
    name: "Empty Tree",
    values: { root: "[]" },
  },
  {
    name: "Single Node",
    values: { root: "[0]" },
  },
  {
    name: "Left Heavy",
    values: { root: "1,2,null,3,null,4,null,5" },
  },
];

export default function FlattenBinaryTreeToLinkedListPage() {
  const [inputValue, setInputValue] = useState(defaultInput);
  const [trace, setTrace] = useState<FlattenTraceStep[]>(() =>
    generateTrace(defaultInput)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[cursor];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function handleRun(values: Record<string, string>) {
    const nextInput = values.root ?? "";
    setInputValue(nextInput);
    setTrace(generateTrace(nextInput));
    setCursor(0);
  }

  function handlePrev() {
    setCursor((current) => Math.max(current - 1, 0));
  }

  function handleNext() {
    setCursor((current) => Math.min(current + 1, trace.length - 1));
  }

  function handleReset() {
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#04050b] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.10),transparent_26%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_24%),linear-gradient(180deg,rgba(4,5,11,0.95),rgba(4,5,11,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/binary-tree" label="Binary Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Tree / In-Place Rewiring
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Flatten{" "}
            <span className="text-amber-300 [text-shadow:0_0_22px_rgba(251,191,36,0.45)]">
              Binary Tree
            </span>{" "}
            to Linked List
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Rewire the tree in preorder so every node points right to the next
            value and every left pointer becomes null. This visualizer focuses
            on the in-place iterative splice with a moving predecessor pointer.
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <InputPanel
            fields={inputFields}
            presets={presets}
            onRun={handleRun}
            accentColor="#fbbf24"
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
              onPrev={handlePrev}
              onNext={handleNext}
              onReset={handleReset}
              canPrev={canPrev}
              canNext={canNext}
            />

            <FlattenWorkbench step={step} />
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
                  step.done ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Flattened Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done ? "text-emerald-400" : "text-amber-300"
                }`}
              >
                {step.done ? "Ready" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span className={step.done ? "text-emerald-300" : "text-amber-200"}>
                {formatSerializedOutput(step.state.serializedOutput)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Input:{" "}
                <span className="font-mono text-slate-200">
                  {inputValue.trim() || "[]"}
                </span>
              </span>
              <span>
                Steps:{" "}
                <span className="font-mono text-slate-200">{trace.length}</span>
              </span>
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(n) time / O(1) extra space
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
