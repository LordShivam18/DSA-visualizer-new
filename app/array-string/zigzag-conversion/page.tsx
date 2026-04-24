"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/zigzag-conversion/CodePanel";
import Controls from "../../../components/array-string/zigzag-conversion/Controls";
import MicroscopeView from "../../../components/array-string/zigzag-conversion/MicroscopeView";
import TracePanel from "../../../components/array-string/zigzag-conversion/TracePanel";
import ZigzagConversionVisualizer from "../../../components/array-string/zigzag-conversion/ZigzagConversionVisualizer";
import {
  generateTrace,
  type ZigzagConversionTraceStep,
} from "../../../components/array-string/zigzag-conversion/generateTrace";
import DarkProblemShell from "../../../components/array-string/shared/DarkProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";

const defaultInputs = {
  s: "PAYPALISHIRING",
  numRows: "3",
};

const presets: PresetConfig[] = [
  {
    name: "Example 1",
    summary: '=> "PAHNAPLSIIGYIR"',
    values: { s: "PAYPALISHIRING", numRows: "3" },
  },
  {
    name: "Example 2",
    summary: '=> "PINALSIGYAHRPI"',
    values: { s: "PAYPALISHIRING", numRows: "4" },
  },
  {
    name: "Straight row",
    summary: '=> "ABC"',
    values: { s: "ABC", numRows: "1" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.s, values.numRows);
}

export default function ZigzagConversionPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<ZigzagConversionTraceStep[]>(() =>
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
    <DarkProblemShell
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Simulation / Zigzag Routing"
      title="Zigzag Conversion"
      difficulty="Medium"
      description="Route characters through a bouncing row pointer, then read the row buffers back in order to form the zigzag-converted string."
      complexity="O(n) time / O(n) extra space"
      inputFields={[
        {
          key: "s",
          label: "String",
          placeholder: "PAYPALISHIRING",
        },
        {
          key: "numRows",
          label: "numRows",
          placeholder: "3",
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
      visualization={<ZigzagConversionVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode={mode} />}
      tracePanel={<TracePanel step={step} />}
      codePanel={<CodePanel step={step} />}
      output={
        <div
          className={`${darkPanelClassName} p-5 ${
            step.done ? "border-emerald-400/30 bg-emerald-500/5" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Output</h3>
              <p className="text-sm text-slate-400">
                The string obtained after zigzag routing and row concatenation.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            zigzag = {step.state.finalResult ?? step.state.result}
          </div>
        </div>
      }
    />
  );
}
