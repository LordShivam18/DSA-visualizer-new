"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/trapping-rain-water/CodePanel";
import Controls from "../../../components/array-string/trapping-rain-water/Controls";
import MicroscopeView from "../../../components/array-string/trapping-rain-water/MicroscopeView";
import TracePanel from "../../../components/array-string/trapping-rain-water/TracePanel";
import TrappingRainWaterVisualizer from "../../../components/array-string/trapping-rain-water/TrappingRainWaterVisualizer";
import {
  generateTrace,
  type TrappingRainWaterTraceStep,
} from "../../../components/array-string/trapping-rain-water/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  height: "[0,1,0,2,1,0,1,3,2,1,2,1]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 6", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 9",
    values: { height: "[4,2,0,3,2,5]" },
  },
  {
    name: "Small basin",
    summary: "single valley",
    values: { height: "[3,0,2,0,4]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.height);
}

export default function TrappingRainWaterPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<TrappingRainWaterTraceStep[]>(() =>
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
      taxonomy="Array / String / Two-Pointer Boundary Maxima"
      title="Trapping Rain Water"
      difficulty="Hard"
      description="Count trapped water in one pass by always resolving the shorter side and maintaining left and right boundary maxima."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        {
          key: "height",
          label: "height",
          placeholder: "[0,1,0,2,1,0,1,3,2,1,2,1]",
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
      visualization={<TrappingRainWaterVisualizer step={step} />}
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
                The total amount of water trapped between the bars.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            trappedWater = {String(step.state.result ?? step.state.water)}
          </div>
        </div>
      }
    />
  );
}
