"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/array-string/jump-game/CodePanel";
import JumpGameVisualizer from "../../../components/array-string/jump-game/JumpGameVisualizer";
import MicroscopeView from "../../../components/array-string/jump-game/MicroscopeView";
import TracePanel from "../../../components/array-string/jump-game/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/jump-game/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  nums: "[2,3,1,1,4]",
};

const presets = [
  { name: "Example 1", summary: "=> true", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> false",
    values: { nums: "[3,2,1,0,4]" },
  },
  {
    name: "Short leap",
    summary: "=> true",
    values: { nums: "[1,2,0,1]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function JumpGamePage() {
  return (
    <TraceLessonPage
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Frontier"
      title="Jump Game"
      difficulty="Medium"
      description="Keep a single farthest-reachable frontier and decide whether the last index ever becomes reachable."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "[2,3,1,1,4]" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      renderVisualization={({ step }) => <JumpGameVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
      renderOutput={({ step }) => (
        <div
          className={`${lightPanelClassName} p-5 ${
            step.done
              ? step.state.result
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-rose-200 bg-rose-50/60"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.state.result ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Output</h3>
              <p className="text-sm text-slate-500">
                Whether the final index is reachable.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            canJump = {String(step.state.result ?? (step.state.maxReach >= 0))}
          </div>
        </div>
      )}
    />
  );
}
