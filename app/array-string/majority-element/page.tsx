"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/majority-element/CodePanel";
import Controls from "../../../components/array-string/majority-element/Controls";
import MajorityElementVisualizer from "../../../components/array-string/majority-element/MajorityElementVisualizer";
import MicroscopeView from "../../../components/array-string/majority-element/MicroscopeView";
import TracePanel from "../../../components/array-string/majority-element/TracePanel";
import {
  generateTrace,
  type MajorityElementTraceStep,
} from "../../../components/array-string/majority-element/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[2,2,1,1,1,2,2]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 3", values: { nums: "[3,2,3]" } },
  { name: "Example 2", summary: "=> 2", values: defaultInputs },
  {
    name: "Long cancel battle",
    summary: "Majority survives",
    values: { nums: "[5,1,5,2,5,3,5,4,5]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function MajorityElementPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<MajorityElementTraceStep[]>(() =>
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
      taxonomy="Array / String / Voting Invariant"
      title="Majority Element"
      difficulty="Easy"
      description="Watch Boyer-Moore pair off competing values until the majority element remains as the final survivor."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[2,2,1,1,1,2,2]" },
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
      visualization={<MajorityElementVisualizer step={step} />}
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
                The surviving candidate after all vote cancellations.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            majority = {step.state.result ?? step.state.candidate ?? "none"}
          </div>
        </div>
      }
    />
  );
}
