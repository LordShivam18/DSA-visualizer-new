"use client";

import { useState } from "react";

import CandyVisualizer from "../../../components/array-string/candy/CandyVisualizer";
import CodePanel from "../../../components/array-string/candy/CodePanel";
import Controls from "../../../components/array-string/candy/Controls";
import MicroscopeView from "../../../components/array-string/candy/MicroscopeView";
import TracePanel from "../../../components/array-string/candy/TracePanel";
import {
  generateTrace,
  type CandyTraceStep,
} from "../../../components/array-string/candy/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  ratings: "[1,0,2]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 5", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 4",
    values: { ratings: "[1,2,2]" },
  },
  {
    name: "Long slope",
    summary: "two-pass repair is visible",
    values: { ratings: "[1,3,4,5,2]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.ratings);
}

export default function CandyPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<CandyTraceStep[]>(() =>
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
      taxonomy="Array / String / Greedy Two-Pass Constraints"
      title="Candy"
      difficulty="Hard"
      description="Distribute the fewest candies by enforcing rating inequalities once from the left and once from the right."
      complexity="O(n) time / O(n) extra space"
      inputFields={[
        { key: "ratings", label: "ratings", placeholder: "[1,0,2]" },
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
      visualization={<CandyVisualizer step={step} />}
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
                The minimum total candies after both directional constraints are
                satisfied.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            minimumCandies ={" "}
            {String(
              step.state.result ??
                step.state.candies.reduce((sum, value) => sum + value, 0)
            )}
          </div>
        </div>
      }
    />
  );
}
