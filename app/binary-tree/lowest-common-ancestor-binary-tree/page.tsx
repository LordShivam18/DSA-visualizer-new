"use client";

import { useState } from "react";

import CodePanel from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/CodePanel";
import Controls from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/Controls";
import LowestCommonAncestorWorkbench from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/LowestCommonAncestorWorkbench";
import MicroscopeView from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/MicroscopeView";
import TracePanel from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/TracePanel";
import {
  formatLcaResult,
  generateTrace,
  type LcaTraceStep,
} from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/generateTrace";
import BackButton from "../../../components/ui/BackButton";
import InputPanel, {
  type InputField,
  type PresetExample,
} from "../../../components/ui/InputPanel";

const defaultTree = "[3,5,1,6,2,0,8,null,null,7,4]";
const defaultP = "5";
const defaultQ = "1";

const inputFields: InputField[] = [
  {
    key: "root",
    label: "Binary tree (level order)",
    type: "text",
    placeholder: "e.g. [3,5,1,6,2,0,8,null,null,7,4]",
    defaultValue: defaultTree,
  },
  {
    key: "p",
    label: "Target p",
    type: "text",
    placeholder: "e.g. 5",
    defaultValue: defaultP,
  },
  {
    key: "q",
    label: "Target q",
    type: "text",
    placeholder: "e.g. 1",
    defaultValue: defaultQ,
  },
];

const presets: PresetExample[] = [
  {
    name: "Example 1",
    values: {
      root: "[3,5,1,6,2,0,8,null,null,7,4]",
      p: "5",
      q: "1",
    },
  },
  {
    name: "Example 2",
    values: {
      root: "[3,5,1,6,2,0,8,null,null,7,4]",
      p: "5",
      q: "4",
    },
  },
  {
    name: "Example 3",
    values: {
      root: "[1,2]",
      p: "1",
      q: "2",
    },
  },
  {
    name: "Balanced",
    values: {
      root: "[6,2,8,0,4,7,9,null,null,3,5]",
      p: "2",
      q: "8",
    },
  },
];

export default function LowestCommonAncestorBinaryTreePage() {
  const [treeInput, setTreeInput] = useState(defaultTree);
  const [pInput, setPInput] = useState(defaultP);
  const [qInput, setQInput] = useState(defaultQ);
  const [trace, setTrace] = useState<LcaTraceStep[]>(() =>
    generateTrace(defaultTree, defaultP, defaultQ)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function handleRun(values: Record<string, string>) {
    const nextTree = values.root ?? "";
    const nextP = values.p ?? "";
    const nextQ = values.q ?? "";

    setTreeInput(nextTree);
    setPInput(nextP);
    setQInput(nextQ);
    setTrace(generateTrace(nextTree, nextP, nextQ));
    setCursor(0);
  }

  const outputLabel = formatLcaResult(step.state.resultValue, !step.done);

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.09),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/binary-tree" label="Binary Tree" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Tree / Recursive Ancestor Search
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Lowest Common Ancestor of a Binary Tree
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This visualizer teaches the classic recursive LCA trick: every
            subtree returns either `null`, target `p`, target `q`, or the final
            ancestor node where both sides meet.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
              Example Root{" "}
              <span className="font-mono text-cyan-200">
                [3,5,1,6,2,0,8,null,null,7,4]
              </span>
            </div>
            <div className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-100">
              p = <span className="font-mono">5</span>
            </div>
            <div className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs text-violet-100">
              q = <span className="font-mono">1</span>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
              Output <span className="font-mono">3</span>
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

            <LowestCommonAncestorWorkbench step={step} />
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
                {step.done ? "Resolved" : "Searching"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
              <span className={step.done ? "text-emerald-300" : "text-cyan-300"}>
                lowestCommonAncestor = {outputLabel}
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
                p: <span className="font-mono text-slate-200">{pInput.trim() || "?"}</span>
              </span>
              <span>
                q: <span className="font-mono text-slate-200">{qInput.trim() || "?"}</span>
              </span>
              <span>
                Steps:{" "}
                <span className="font-mono text-slate-200">{trace.length}</span>
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
