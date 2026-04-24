"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/h-index/CodePanel";
import Controls from "../../../components/array-string/h-index/Controls";
import HIndexVisualizer from "../../../components/array-string/h-index/HIndexVisualizer";
import MicroscopeView from "../../../components/array-string/h-index/MicroscopeView";
import TracePanel from "../../../components/array-string/h-index/TracePanel";
import {
  generateTrace,
  type HIndexTraceStep,
} from "../../../components/array-string/h-index/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  citations: "[3,0,6,1,5]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 3", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 1",
    values: { citations: "[1,3,1]" },
  },
  {
    name: "High plateau",
    summary: "=> 4",
    values: { citations: "[7,6,6,5,4,2]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.citations);
}

export default function HIndexPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<HIndexTraceStep[]>(() =>
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
      taxonomy="Array / String / Threshold Logic"
      title="H-Index"
      difficulty="Medium"
      description="Sort citations in descending order and locate the largest threshold where citations[i] still supports h = i + 1."
      complexity="O(n log n) time / sort-dependent extra space"
      inputFields={[
        { key: "citations", label: "citations", placeholder: "[3,0,6,1,5]" },
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
      visualization={<HIndexVisualizer step={step} />}
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
                The largest h such that at least h papers have at least h citations.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            hIndex = {step.state.result ?? step.state.h}
          </div>
        </div>
      }
    />
  );
}
