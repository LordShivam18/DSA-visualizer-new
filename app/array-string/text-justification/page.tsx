"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/text-justification/CodePanel";
import Controls from "../../../components/array-string/text-justification/Controls";
import MicroscopeView from "../../../components/array-string/text-justification/MicroscopeView";
import TextJustificationVisualizer from "../../../components/array-string/text-justification/TextJustificationVisualizer";
import TracePanel from "../../../components/array-string/text-justification/TracePanel";
import {
  generateTrace,
  type TextJustificationTraceStep,
} from "../../../components/array-string/text-justification/generateTrace";
import DarkProblemShell from "../../../components/array-string/shared/DarkProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";

const defaultInputs = {
  words: '["This","is","an","example","of","text","justification."]',
  maxWidth: "16",
};

const presets: PresetConfig[] = [
  {
    name: "Example 1",
    summary: "=> 3 lines",
    values: {
      words: '["This","is","an","example","of","text","justification."]',
      maxWidth: "16",
    },
  },
  {
    name: "Example 2",
    summary: "=> 3 lines",
    values: {
      words: '["What","must","be","acknowledgment","shall","be"]',
      maxWidth: "16",
    },
  },
  {
    name: "Wide line",
    summary: "=> 2 lines",
    values: {
      words: '["Listen","to","many,","speak","to","a","few."]',
      maxWidth: "18",
    },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.words, values.maxWidth);
}

export default function TextJustificationPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<TextJustificationTraceStep[]>(() =>
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
      taxonomy="Array / String / Greedy Packing / Formatting"
      title="Text Justification"
      difficulty="Hard"
      description="Greedily pack words into each line, distribute the remaining spaces across the gaps, and left-justify the final line."
      complexity="O(total chars) time / O(total output) extra space"
      inputFields={[
        {
          key: "words",
          label: "Words",
          placeholder: '["This","is","an","example","of","text","justification."]',
          multiline: true,
          rows: 5,
          help: "Use JSON arrays, comma-separated words, or newline-separated entries.",
        },
        {
          key: "maxWidth",
          label: "maxWidth",
          placeholder: "16",
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
      visualization={<TextJustificationVisualizer step={step} />}
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
                The justified lines, shown with visible middots for spaces.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-sm text-cyan-200 whitespace-pre-wrap">
            {(step.state.result ?? step.state.builtLines)
              .map((line) => line.replace(/ /g, "·"))
              .join("\n")}
          </div>
        </div>
      }
    />
  );
}
