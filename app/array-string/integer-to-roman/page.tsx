"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/integer-to-roman/CodePanel";
import Controls from "../../../components/array-string/integer-to-roman/Controls";
import IntegerToRomanVisualizer from "../../../components/array-string/integer-to-roman/IntegerToRomanVisualizer";
import MicroscopeView from "../../../components/array-string/integer-to-roman/MicroscopeView";
import TracePanel from "../../../components/array-string/integer-to-roman/TracePanel";
import {
  generateTrace,
  type IntegerToRomanTraceStep,
} from "../../../components/array-string/integer-to-roman/generateTrace";
import DarkProblemShell from "../../../components/array-string/shared/DarkProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";

const defaultInputs = {
  num: "3749",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> MMMDCCXLIX", values: { num: "3749" } },
  { name: "Compact", summary: "=> LVIII", values: { num: "58" } },
  { name: "Subtractive", summary: "=> MCMXCIV", values: { num: "1994" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.num);
}

export default function IntegerToRomanPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<IntegerToRomanTraceStep[]>(() =>
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
      taxonomy="Array / String / Greedy Denominations / Roman Numerals"
      title="Integer to Roman"
      difficulty="Medium"
      description="Convert an integer into a Roman numeral by greedily minting the largest denomination that still fits the remaining value."
      complexity="O(1) time / O(1) extra space"
      inputFields={[
        {
          key: "num",
          label: "Integer",
          placeholder: "3749",
          help: "Values are clamped safely into the standard Roman range 1..3999.",
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
      visualization={<IntegerToRomanVisualizer step={step} />}
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
                The Roman numeral assembled from the greedy denomination table.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            roman = {step.state.result ?? step.state.output}
          </div>
        </div>
      }
    />
  );
}
