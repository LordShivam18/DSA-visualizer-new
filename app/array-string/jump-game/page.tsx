"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/jump-game/CodePanel";
import Controls from "../../../components/array-string/jump-game/Controls";
import JumpGameVisualizer from "../../../components/array-string/jump-game/JumpGameVisualizer";
import MicroscopeView from "../../../components/array-string/jump-game/MicroscopeView";
import TracePanel from "../../../components/array-string/jump-game/TracePanel";
import {
  generateTrace,
  type JumpGameTraceStep,
} from "../../../components/array-string/jump-game/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[2,3,1,1,4]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> true", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> false",
    values: { nums: "[3,2,1,0,4]" },
  },
  {
    name: "Short leap",
    summary: "=> true",
    values: { nums: "[1,2,0,1]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function JumpGamePage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<JumpGameTraceStep[]>(() =>
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
      taxonomy="Array / String / Greedy Frontier"
      title="Jump Game"
      difficulty="Medium"
      description="Keep a single farthest-reachable frontier and decide whether the last index ever becomes reachable."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[2,3,1,1,4]" },
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
      visualization={<JumpGameVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode={mode} />}
      tracePanel={<TracePanel step={step} />}
      codePanel={<CodePanel step={step} />}
      output={
        <div
          className={`${lightPanelClassName} p-5 ${
            step.done
              ? step.state.result
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-rose-200 bg-rose-50/60"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.state.result ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Output</h3>
              <p className="text-sm text-slate-500">
                Whether the final index is reachable.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            canJump = {String(step.state.result ?? (step.state.maxReach >= 0))}
          </div>
        </div>
      }
    />
  );
}
