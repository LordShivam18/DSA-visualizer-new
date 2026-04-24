"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/length-of-last-word/CodePanel";
import Controls from "../../../components/array-string/length-of-last-word/Controls";
import LengthOfLastWordVisualizer from "../../../components/array-string/length-of-last-word/LengthOfLastWordVisualizer";
import MicroscopeView from "../../../components/array-string/length-of-last-word/MicroscopeView";
import TracePanel from "../../../components/array-string/length-of-last-word/TracePanel";
import {
  generateTrace,
  type LengthOfLastWordTraceStep,
} from "../../../components/array-string/length-of-last-word/generateTrace";
import DarkProblemShell from "../../../components/array-string/shared/DarkProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";

const defaultInputs = {
  s: "Hello World",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 5", values: { s: "Hello World" } },
  { name: "Example 2", summary: "=> 4", values: { s: "   fly me   to   the moon  " } },
  { name: "Example 3", summary: "=> 6", values: { s: "luffy is still joyboy" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.s);
}

export default function LengthOfLastWordPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<LengthOfLastWordTraceStep[]>(() =>
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
      taxonomy="Array / String / Reverse Scan / Whitespace"
      title="Length of Last Word"
      difficulty="Easy"
      description="Return the length of the last word in a string by scanning from the end, trimming spaces, and counting the final non-space stretch."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        {
          key: "s",
          label: "Sentence",
          placeholder: "Hello World",
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
      visualization={<LengthOfLastWordVisualizer step={step} />}
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
                The number of characters in the final word.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            length = {step.state.result ?? step.state.length}
          </div>
        </div>
      }
    />
  );
}
