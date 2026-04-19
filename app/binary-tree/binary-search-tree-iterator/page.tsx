"use client";

import { useState } from "react";

import CodePanel from "@/components/binary-tree/binary-search-tree-iterator/CodePanel";
import Controls from "@/components/binary-tree/binary-search-tree-iterator/Controls";
import IteratorWorkbench from "@/components/binary-tree/binary-search-tree-iterator/IteratorWorkbench";
import TracePanel from "@/components/binary-tree/binary-search-tree-iterator/TracePanel";
import {
  formatOutputArray,
  generateTrace,
  type IteratorTraceStep,
} from "@/components/binary-tree/binary-search-tree-iterator/generateTrace";
import BackButton from "@/components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "@/components/ui/InputPanel";

const defaultRoot = "[7,3,15,null,null,9,20]";
const defaultOperations =
  '["BSTIterator","next","next","hasNext","next","hasNext","next","hasNext","next","hasNext"]';

const inputFields: InputField[] = [
  {
    key: "root",
    label: "BST level-order input",
    type: "text",
    placeholder: "e.g. [7,3,15,null,null,9,20]",
    defaultValue: defaultRoot,
  },
  {
    key: "operations",
    label: "Operations (BSTIterator optional)",
    type: "text",
    placeholder: 'e.g. ["BSTIterator","next","hasNext"]',
    defaultValue: defaultOperations,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: {
      root: "[7,3,15,null,null,9,20]",
      operations:
        '["BSTIterator","next","next","hasNext","next","hasNext","next","hasNext","next","hasNext"]',
    },
  },
  {
    name: "Balanced BST",
    values: {
      root: "[8,3,10,1,6,null,14,null,null,4,7,13]",
      operations:
        '["BSTIterator","next","next","next","next","next","hasNext"]',
    },
  },
  {
    name: "Left Chain",
    values: {
      root: "[5,4,null,3,null,2,null,1]",
      operations: '["BSTIterator","hasNext","next","next","next","hasNext"]',
    },
  },
  {
    name: "Empty BST",
    values: {
      root: "[]",
      operations: '["BSTIterator","hasNext"]',
    },
  },
];

export default function BinarySearchTreeIteratorPage() {
  const [treeInput, setTreeInput] = useState(defaultRoot);
  const [operationsInput, setOperationsInput] = useState(defaultOperations);
  const [trace, setTrace] = useState<IteratorTraceStep[]>(() =>
    generateTrace(defaultRoot, defaultOperations)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;
  const constructorIncluded =
    step.state.calls[0]?.contributesToOutput ?? false;

  function handleRun(values: Record<string, string>) {
    const nextTree = values.root ?? "";
    const nextOperations = values.operations ?? "";

    setTreeInput(nextTree);
    setOperationsInput(nextOperations);
    setTrace(generateTrace(nextTree, nextOperations));
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
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#04060d] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_24%),linear-gradient(180deg,rgba(4,6,13,0.95),rgba(4,6,13,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-5xl">
          <BackButton href="/binary-tree" label="Binary Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Tree / BST Inorder Iterator
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Binary Search Tree{" "}
            <span className="text-lime-300 [text-shadow:0_0_22px_rgba(163,230,53,0.45)]">
              Iterator
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Implement a lazy iterator that returns BST values in sorted inorder
            sequence. This visualizer focuses on the stack frontier that makes
            the constructor O(h), keeps hasNext() O(1), and makes next()
            amortized O(1).
          </p>
        </header>

        <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <section className="glass-card p-5">
            <div className="flex items-center gap-3">
              <span className="h-4 w-1.5 rounded-full bg-lime-400" />
              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  Problem Statement
                </h2>
                <p className="text-sm text-slate-400">
                  Build an iterator over the inorder traversal of a BST.
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>
                <span className="font-mono text-cyan-200">
                  BSTIterator(TreeNode* root)
                </span>{" "}
                initializes the iterator so the pointer starts before the
                smallest value.
              </li>
              <li>
                <span className="font-mono text-cyan-200">next()</span> moves
                to the next inorder value and returns it.
              </li>
              <li>
                <span className="font-mono text-cyan-200">hasNext()</span>{" "}
                reports whether another inorder value still exists.
              </li>
            </ul>

            <p className="mt-4 rounded-[1rem] border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-400">
              The first call to <span className="font-mono text-slate-200">next()</span>{" "}
              must return the smallest node in the BST, which is why the
              constructor preloads the left spine onto a stack.
            </p>
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center gap-3">
              <span className="h-4 w-1.5 rounded-full bg-amber-400" />
              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  Sample From Prompt
                </h2>
                <p className="text-sm text-slate-400">
                  The default preset matches the attached example.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 rounded-[1.2rem] border border-slate-800/80 bg-[#050916] p-4 font-mono text-xs text-slate-300">
              <p className="break-words">
                {
                  'ops = ["BSTIterator","next","next","hasNext","next","hasNext","next","hasNext","next","hasNext"]'
                }
              </p>
              <p className="break-words">
                {"args = [[[7,3,15,null,null,9,20]],[],[],[],[],[],[],[],[],[]]"}
              </p>
              <p className="break-words text-emerald-200">
                {"output = [null, 3, 7, true, 9, true, 15, true, 20, false]"}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              This page lets you edit the tree and the method-call list, then
              step through every constructor push, stack pop, right-subtree
              expansion, and boolean check.
            </p>
          </section>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <InputPanel
            fields={inputFields}
            presets={presets}
            onRun={handleRun}
            accentColor="#a3e635"
          />
        </div>

        <div className="mx-auto w-full max-w-5xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-4 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
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

            <IteratorWorkbench step={step} />
          </section>

          <aside className="space-y-5">
            <TracePanel step={step} />
            <CodePanel step={step} />
          </aside>
        </div>

        <div className="mx-auto w-full max-w-5xl">
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
                  step.done ? "bg-emerald-400" : "bg-lime-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done ? "text-emerald-400" : "text-lime-300"
                }`}
              >
                {step.done ? "Ready" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span className={step.done ? "text-emerald-300" : "text-lime-200"}>
                {formatOutputArray(step.state.output)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Tree:{" "}
                <span className="font-mono text-slate-200">
                  {treeInput.trim() || "[]"}
                </span>
              </span>
              <span>
                Operations:{" "}
                <span className="font-mono text-slate-200">
                  {operationsInput.trim() || "[]"}
                </span>
              </span>
              <span>
                Constructor output:{" "}
                <span className="font-mono text-slate-200">
                  {constructorIncluded ? "included" : "implicit"}
                </span>
              </span>
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(h) space / next() amortized O(1)
                </span>
              </span>
            </div>

            {!constructorIncluded ? (
              <p className="mt-3 text-xs leading-6 text-slate-500">
                If you omit{" "}
                <span className="font-mono text-slate-300">BSTIterator</span>{" "}
                from the operations list, setup still happens but the leading{" "}
                <span className="font-mono text-slate-300">null</span> is not
                added to the output array.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
