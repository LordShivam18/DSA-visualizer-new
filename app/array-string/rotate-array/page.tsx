"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/rotate-array/CodePanel";
import Controls from "../../../components/array-string/rotate-array/Controls";
import MicroscopeView from "../../../components/array-string/rotate-array/MicroscopeView";
import RotateArrayVisualizer from "../../../components/array-string/rotate-array/RotateArrayVisualizer";
import TracePanel from "../../../components/array-string/rotate-array/TracePanel";
import {
  generateTrace,
  type RotateArrayTraceStep,
} from "../../../components/array-string/rotate-array/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[1,2,3,4,5,6,7]",
  k: "3",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> [5,6,7,1,2,3,4]", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> [3,99,-1,-100]",
    values: { nums: "[-1,-100,3,99]", k: "2" },
  },
  {
    name: "Large k",
    summary: "k wraps around",
    values: { nums: "[10,20,30,40]", k: "10" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums, values.k);
}

export default function RotateArrayPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RotateArrayTraceStep[]>(() =>
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
      taxonomy="Array / String / Reversal Trick"
      title="Rotate Array"
      difficulty="Medium"
      description="Rotate right by k steps using the classic reverse-all, reverse-front, reverse-back strategy."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[1,2,3,4,5,6,7]" },
        { key: "k", label: "k", placeholder: "3" },
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
      visualization={<RotateArrayVisualizer step={step} />}
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
                nums after applying the in-place rotation.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            rotated nums = {formatArray(step.state.result ?? step.state.working)}
          </div>
        </div>
      }
    />
  );
}
