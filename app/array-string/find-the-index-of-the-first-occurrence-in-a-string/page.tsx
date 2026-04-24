"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/find-the-index-of-the-first-occurrence-in-a-string/CodePanel";
import Controls from "../../../components/array-string/find-the-index-of-the-first-occurrence-in-a-string/Controls";
import FirstOccurrenceVisualizer from "../../../components/array-string/find-the-index-of-the-first-occurrence-in-a-string/FirstOccurrenceVisualizer";
import MicroscopeView from "../../../components/array-string/find-the-index-of-the-first-occurrence-in-a-string/MicroscopeView";
import TracePanel from "../../../components/array-string/find-the-index-of-the-first-occurrence-in-a-string/TracePanel";
import {
  generateTrace,
  type FirstOccurrenceTraceStep,
} from "../../../components/array-string/find-the-index-of-the-first-occurrence-in-a-string/generateTrace";
import DarkProblemShell from "../../../components/array-string/shared/DarkProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";

const defaultInputs = {
  haystack: "sadbutsad",
  needle: "sad",
};

const presets: PresetConfig[] = [
  {
    name: "Example 1",
    summary: "=> 0",
    values: { haystack: "sadbutsad", needle: "sad" },
  },
  {
    name: "Example 2",
    summary: "=> -1",
    values: { haystack: "leetcode", needle: "leeto" },
  },
  {
    name: "Middle hit",
    summary: "=> 4",
    values: { haystack: "mississippi", needle: "issip" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.haystack, values.needle);
}

export default function FirstOccurrencePage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<FirstOccurrenceTraceStep[]>(() =>
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
      taxonomy="Array / String / Substring Search / Sliding Alignment"
      title="Find the Index of the First Occurrence in a String"
      difficulty="Easy"
      description="Return the first index where the needle appears in the haystack by testing candidate windows left to right."
      complexity="O((n - m + 1) * m) time / O(1) extra space"
      inputFields={[
        {
          key: "haystack",
          label: "haystack",
          placeholder: "sadbutsad",
        },
        {
          key: "needle",
          label: "needle",
          placeholder: "sad",
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
      visualization={<FirstOccurrenceVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode={mode} />}
      tracePanel={<TracePanel step={step} />}
      codePanel={<CodePanel step={step} />}
      output={
        <div
          className={`${darkPanelClassName} p-5 ${
            step.done && (step.state.result ?? -1) >= 0
              ? "border-emerald-400/30 bg-emerald-500/5"
              : step.done
              ? "border-rose-400/30 bg-rose-500/5"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done && (step.state.result ?? -1) >= 0
                  ? "bg-emerald-400"
                  : step.done
                  ? "bg-rose-400"
                  : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Output</h3>
              <p className="text-sm text-slate-400">
                The first matching start index, or -1 if the needle never appears.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            index = {step.state.result ?? "searching"}
          </div>
        </div>
      }
    />
  );
}
