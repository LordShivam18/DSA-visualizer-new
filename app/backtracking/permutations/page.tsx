"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/backtracking/permutations/CodePanel";
import MicroscopeView from "../../../components/backtracking/permutations/MicroscopeView";
import PermutationsWorkbench from "../../../components/backtracking/permutations/PermutationsWorkbench";
import TracePanel from "../../../components/backtracking/permutations/TracePanel";
import {
  formatPermutationResults,
  generateTrace,
} from "../../../components/backtracking/permutations/generateTrace";

const defaultInputs = {
  nums: "[1,2,3]",
};

const presets = [
  {
    name: "Example 1",
    summary: "6 permutations",
    values: { nums: "[1,2,3]" },
  },
  {
    name: "Example 2",
    summary: "[[0,1],[1,0]]",
    values: { nums: "[0,1]" },
  },
  {
    name: "Example 3",
    summary: "[[1]]",
    values: { nums: "[1]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function PermutationsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/backtracking"
      categoryLabel="Backtracking"
      taxonomy="Backtracking / Used Mask / Slot Filling"
      title="Permutations"
      difficulty="Medium"
      description="Fill the next slot with one unused value, recurse until every slot is occupied, then undo the placement so a different ordering can be explored cleanly."
      complexity="O(n * n!)"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "nums",
          label: "Distinct numbers",
          placeholder: "[1,2,3]",
        },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      renderVisualization={({ step }) => <PermutationsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
      renderOutput={({ step, trace }) => (
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
              permute(...) = {formatPermutationResults(step.state.results)}
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Items
              </p>
              <p className="mt-2 text-2xl font-semibold text-cyan-200">
                {step.state.nums.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Permutations
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {step.state.results.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Trace Steps
              </p>
              <p className="mt-2 text-2xl font-semibold text-violet-200">
                {trace.length}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
            <span>
              Complexity: <span className="font-mono text-slate-200">O(n * n!)</span>
            </span>
            <span>
              Last permutation:{" "}
              <span className="font-mono text-slate-200">
                {step.state.results.length === 0
                  ? "none"
                  : `[${step.state.results[step.state.results.length - 1].join(", ")}]`}
              </span>
            </span>
          </div>
        </div>
      )}
    />
  );
}
