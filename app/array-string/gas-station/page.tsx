"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/gas-station/CodePanel";
import Controls from "../../../components/array-string/gas-station/Controls";
import GasStationVisualizer from "../../../components/array-string/gas-station/GasStationVisualizer";
import MicroscopeView from "../../../components/array-string/gas-station/MicroscopeView";
import TracePanel from "../../../components/array-string/gas-station/TracePanel";
import {
  generateTrace,
  type GasStationTraceStep,
} from "../../../components/array-string/gas-station/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  gas: "[1,2,3,4,5]",
  cost: "[3,4,5,1,2]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 3", values: defaultInputs },
  {
    name: "No solution",
    summary: "=> -1",
    values: { gas: "[2,3,4]", cost: "[3,4,3]" },
  },
  {
    name: "Small route",
    summary: "candidate resets once",
    values: { gas: "[5,1,2,3,4]", cost: "[4,4,1,5,1]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.gas, values.cost);
}

export default function GasStationPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<GasStationTraceStep[]>(() =>
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
      taxonomy="Array / String / Greedy Circuit Proof"
      title="Gas Station"
      difficulty="Medium"
      description="Find the unique start index by combining a global balance check with a local running tank that resets on failure."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        { key: "gas", label: "gas", placeholder: "[1,2,3,4,5]" },
        { key: "cost", label: "cost", placeholder: "[3,4,5,1,2]" },
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
      visualization={<GasStationVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode={mode} />}
      tracePanel={<TracePanel step={step} />}
      codePanel={<CodePanel step={step} />}
      output={
        <div
          className={`${lightPanelClassName} p-5 ${
            step.done
              ? step.state.result === -1
                ? "border-rose-200 bg-rose-50/60"
                : "border-emerald-200 bg-emerald-50/60"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done
                  ? step.state.result === -1
                    ? "bg-rose-400"
                    : "bg-emerald-400"
                  : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Output</h3>
              <p className="text-sm text-slate-500">
                The starting station index, or -1 if the circuit is impossible.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            startIndex = {String(step.state.result ?? step.state.start)}
          </div>
        </div>
      }
    />
  );
}
