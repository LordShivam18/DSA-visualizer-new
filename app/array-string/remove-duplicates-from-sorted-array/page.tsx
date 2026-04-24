"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/remove-duplicates-from-sorted-array/CodePanel";
import Controls from "../../../components/array-string/remove-duplicates-from-sorted-array/Controls";
import MicroscopeView from "../../../components/array-string/remove-duplicates-from-sorted-array/MicroscopeView";
import RemoveDuplicatesVisualizer from "../../../components/array-string/remove-duplicates-from-sorted-array/RemoveDuplicatesVisualizer";
import TracePanel from "../../../components/array-string/remove-duplicates-from-sorted-array/TracePanel";
import {
  generateTrace,
  type RemoveDuplicatesTraceStep,
} from "../../../components/array-string/remove-duplicates-from-sorted-array/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[0,0,1,1,1,2,2,3,3,4]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> k = 5", values: defaultInputs },
  {
    name: "Short run",
    summary: "=> k = 2",
    values: { nums: "[1,1,2]" },
  },
  {
    name: "Already unique",
    summary: "=> k = 5",
    values: { nums: "[1,2,3,4,5]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function RemoveDuplicatesPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RemoveDuplicatesTraceStep[]>(() =>
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
      taxonomy="Array / String / Sorted Array Prefix"
      title="Remove Duplicates from Sorted Array"
      difficulty="Easy"
      description="Use the sorted order to keep a compact unique prefix and skip repeated values with a single comparison."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        {
          key: "nums",
          label: "nums",
          placeholder: "[0,0,1,1,1,2,2,3,3,4]",
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
      visualization={<RemoveDuplicatesVisualizer step={step} />}
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
                The first k positions hold the deduplicated sorted array.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            k = {step.state.uniqueLength}, unique prefix ={" "}
            {formatArray(step.state.working.slice(0, step.state.uniqueLength))}
          </div>
        </div>
      }
    />
  );
}
