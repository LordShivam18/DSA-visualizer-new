"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/array-string/jump-game-ii/CodePanel";
import JumpGameIIVisualizer from "../../../components/array-string/jump-game-ii/JumpGameIIVisualizer";
import MicroscopeView from "../../../components/array-string/jump-game-ii/MicroscopeView";
import TracePanel from "../../../components/array-string/jump-game-ii/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/jump-game-ii/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[2,3,1,1,4]",
};

const presets = [
  { name: "Example 1", summary: "=> 2", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 2",
    values: { nums: "[2,3,0,1,4]" },
  },
  {
    name: "Wide window",
    summary: "Greedy layer expansion",
    values: { nums: "[4,1,1,3,1,1,1]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function JumpGameIIPage() {
  return (
    <TraceLessonPage
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Minimum Jump Layers"
      title="Jump Game II"
      difficulty="Medium"
      description="Interpret the array as BFS layers: currentEnd closes the current jump window, and farthest builds the next one."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "[2,3,1,1,4]" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      renderVisualization={({ step }) => <JumpGameIIVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
      renderOutput={({ step }) => (
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
                Minimum jumps needed to reach the last index.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            jumps = {step.state.result ?? step.state.jumps}
          </div>
        </div>
      )}
    />
  );
}
