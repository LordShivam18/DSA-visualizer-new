"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/CodePanel";
import Controls from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/Controls";
import MicroscopeView from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/MicroscopeView";
import RemoveDuplicatesIIVisualizer from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/RemoveDuplicatesIIVisualizer";
import TracePanel from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/TracePanel";
import {
  generateTrace,
  type RemoveDuplicatesIITraceStep,
} from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[1,1,1,2,2,3]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> k = 5", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> k = 7",
    values: { nums: "[0,0,1,1,1,1,2,3,3]" },
  },
  {
    name: "Already valid",
    summary: "No third copies",
    values: { nums: "[1,1,2,2,3,3]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function RemoveDuplicatesIIPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RemoveDuplicatesIITraceStep[]>(() =>
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

  return (
    <ProblemShell
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Bounded Duplicates"
      title="Remove Duplicates from Sorted Array II"
      difficulty="Medium"
      description="Keep a valid prefix where every value appears at most twice, using the write-2 lookback to block third copies."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        {
          key: "nums",
          label: "nums",
          placeholder: "[1,1,1,2,2,3]",
        },
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
          canPrev={cursor > 0}
          canNext={cursor < trace.length - 1}
        />
      }
      visualization={<RemoveDuplicatesIIVisualizer step={step} />}
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
                The accepted answer is the first k elements.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            k = {step.state.keptLength}, valid prefix ={" "}
            {formatArray(step.state.working.slice(0, step.state.keptLength))}
          </div>
        </div>
      }
    />
  );
}
