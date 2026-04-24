"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/remove-element/CodePanel";
import Controls from "../../../components/array-string/remove-element/Controls";
import MicroscopeView from "../../../components/array-string/remove-element/MicroscopeView";
import RemoveElementVisualizer from "../../../components/array-string/remove-element/RemoveElementVisualizer";
import TracePanel from "../../../components/array-string/remove-element/TracePanel";
import {
  generateTrace,
  type RemoveElementTraceStep,
} from "../../../components/array-string/remove-element/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[3,2,2,3]",
  target: "3",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> k = 2", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> k = 5",
    values: { nums: "[0,1,2,2,3,0,4,2]", target: "2" },
  },
  {
    name: "No removals",
    summary: "Target absent",
    values: { nums: "[1,4,5,7]", target: "3" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums, values.target);
}

export default function RemoveElementPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RemoveElementTraceStep[]>(() =>
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
      taxonomy="Array / String / In-Place Filtering"
      title="Remove Element"
      difficulty="Easy"
      description="Compact every non-target value into the front of the array and treat the remaining tail as irrelevant."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[3,2,2,3]" },
        { key: "target", label: "val", placeholder: "3" },
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
      visualization={<RemoveElementVisualizer step={step} />}
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
                The judge only checks the first k slots.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            k = {step.state.keptLength}, nums prefix ={" "}
            {formatArray(step.state.working.slice(0, step.state.keptLength))}
          </div>
        </div>
      }
    />
  );
}
