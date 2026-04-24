"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/roman-to-integer/CodePanel";
import Controls from "../../../components/array-string/roman-to-integer/Controls";
import MicroscopeView from "../../../components/array-string/roman-to-integer/MicroscopeView";
import RomanToIntegerVisualizer from "../../../components/array-string/roman-to-integer/RomanToIntegerVisualizer";
import TracePanel from "../../../components/array-string/roman-to-integer/TracePanel";
import {
  generateTrace,
  type RomanToIntegerTraceStep,
} from "../../../components/array-string/roman-to-integer/generateTrace";
import DarkProblemShell from "../../../components/array-string/shared/DarkProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";

const defaultInputs = {
  roman: "MCMXCIV",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 3", values: { roman: "III" } },
  { name: "Example 2", summary: "=> 58", values: { roman: "LVIII" } },
  { name: "Example 3", summary: "=> 1994", values: { roman: "MCMXCIV" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.roman);
}

export default function RomanToIntegerPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RomanToIntegerTraceStep[]>(() =>
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
      taxonomy="Array / String / Roman Numerals / Lookahead"
      title="Roman to Integer"
      difficulty="Easy"
      description="Convert a Roman numeral into an integer by comparing each glyph to its immediate lookahead and turning it into a signed contribution."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        {
          key: "roman",
          label: "Roman numeral",
          placeholder: "MCMXCIV",
          help: "Invalid characters are ignored safely.",
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
      visualization={<RomanToIntegerVisualizer step={step} />}
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
                The integer value represented by the cleaned Roman numeral.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            value = {step.state.result ?? step.state.total}
          </div>
        </div>
      }
    />
  );
}
