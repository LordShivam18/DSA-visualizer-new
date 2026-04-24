"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/insert-delete-getrandom-o1/CodePanel";
import Controls from "../../../components/array-string/insert-delete-getrandom-o1/Controls";
import MicroscopeView from "../../../components/array-string/insert-delete-getrandom-o1/MicroscopeView";
import RandomizedSetVisualizer from "../../../components/array-string/insert-delete-getrandom-o1/RandomizedSetVisualizer";
import TracePanel from "../../../components/array-string/insert-delete-getrandom-o1/TracePanel";
import {
  generateTrace,
  type RandomizedSetTraceStep,
} from "../../../components/array-string/insert-delete-getrandom-o1/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  operations:
    '["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"]',
  args: "[[],[1],[2],[2],[],[1],[2],[]]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "LeetCode sequence", values: defaultInputs },
  {
    name: "Swap delete",
    summary: "Middle removal",
    values: {
      operations:
        '["RandomizedSet","insert","insert","insert","remove","getRandom"]',
      args: "[[],[10],[20],[30],[20],[]]",
    },
  },
  {
    name: "Duplicate checks",
    summary: "Insert/remove failures",
    values: {
      operations:
        '["RandomizedSet","insert","insert","remove","remove","getRandom"]',
      args: "[[],[5],[5],[7],[5],[]]",
    },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.operations, values.args);
}

export default function RandomizedSetPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RandomizedSetTraceStep[]>(() =>
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
      taxonomy="Array / String / Hashmap + Array"
      title="Insert Delete GetRandom O(1)"
      difficulty="Medium"
      description="Replay a full RandomizedSet operation log and watch how the dense array and hashmap cooperate to preserve average O(1) operations."
      complexity="Average O(1) insert/remove/getRandom / O(n) space"
      inputFields={[
        {
          key: "operations",
          label: "operations",
          multiline: true,
          rows: 4,
          placeholder:
            '["RandomizedSet","insert","remove","insert","getRandom"]',
          help: "JSON array of operation names.",
        },
        {
          key: "args",
          label: "arguments",
          multiline: true,
          rows: 4,
          placeholder: "[[],[1],[2],[2],[]]",
          help: "JSON array of argument arrays aligned with operations.",
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
      visualization={<RandomizedSetVisualizer step={step} />}
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
                Return history for the processed operation sequence.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            returns = [{step.state.returns.join(", ")}]
          </div>
        </div>
      }
    />
  );
}
