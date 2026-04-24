"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/merge-sorted-array/CodePanel";
import Controls from "../../../components/array-string/merge-sorted-array/Controls";
import MergeSortedArrayVisualizer from "../../../components/array-string/merge-sorted-array/MergeSortedArrayVisualizer";
import MicroscopeView from "../../../components/array-string/merge-sorted-array/MicroscopeView";
import TracePanel from "../../../components/array-string/merge-sorted-array/TracePanel";
import {
  generateTrace,
  type MergeSortedArrayTraceStep,
} from "../../../components/array-string/merge-sorted-array/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { formatArray, parseNumberList } from "../../../components/array-string/shared/parsers";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums1: "[1,2,3,0,0,0]",
  m: "3",
  nums2: "[2,5,6]",
  n: "3",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> [1,2,2,3,5,6]", values: defaultInputs },
  {
    name: "Example 2",
    summary: "Single value",
    values: { nums1: "[1]", m: "1", nums2: "[]", n: "0" },
  },
  {
    name: "All nums2 first",
    summary: "=> [1,2,3,4,5,6]",
    values: { nums1: "[4,5,6,0,0,0]", m: "3", nums2: "[1,2,3]", n: "3" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums1, values.m, values.nums2, values.n);
}

export default function MergeSortedArrayPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<MergeSortedArrayTraceStep[]>(() =>
    buildTrace(defaultInputs)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];

  function run(nextValues = inputs) {
    setInputs(nextValues);
    setTrace(buildTrace(nextValues));
    setCursor(0);
  }

  const mergedOutput = step.state.result ?? step.state.working;
  const rawOutput = formatArray(mergedOutput);
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  return (
    <ProblemShell
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / In-Place Merge"
      title="Merge Sorted Array"
      difficulty="Easy"
      description="Merge two sorted arrays directly into nums1 and watch how the rightmost free slot makes in-place merging safe."
      complexity="O(m + n) time / O(1) extra space"
      inputFields={[
        { key: "nums1", label: "nums1", placeholder: "[1,2,3,0,0,0]" },
        { key: "m", label: "m", placeholder: "3" },
        { key: "nums2", label: "nums2", placeholder: "[2,5,6]" },
        { key: "n", label: "n", placeholder: "3" },
      ]}
      inputValues={inputs}
      onInputChange={(key, value) =>
        setInputs((current) => ({ ...current, [key]: value }))
      }
      onRun={() => run()}
      presets={presets}
      onPreset={(preset) => run(preset.values as typeof defaultInputs)}
      step={step}
      mode={mode}
      controls={
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
      }
      visualization={<MergeSortedArrayVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode={mode} />}
      tracePanel={<TracePanel step={step} />}
      codePanel={<CodePanel step={step} />}
      output={
        <div
          className={`${lightPanelClassName} p-5 ${
            step.done ? "border-emerald-200 bg-emerald-50/60" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Output</h3>
              <p className="text-sm text-slate-500">
                nums1 after the current trace step.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            nums1 = {rawOutput}
          </div>
          <div className="mt-4 text-sm leading-7 text-slate-600">
            Effective valid length = {parseNumberList(inputs.nums1).length} slots,
            with the first {step.state.m} considered original nums1 values.
          </div>
        </div>
      }
    />
  );
}
