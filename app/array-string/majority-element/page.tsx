"use client";

import CodePanel from "../../../components/array-string/majority-element/CodePanel";
import Controls from "../../../components/array-string/majority-element/Controls";
import MajorityElementVisualizer from "../../../components/array-string/majority-element/MajorityElementVisualizer";
import MicroscopeView from "../../../components/array-string/majority-element/MicroscopeView";
import TracePanel from "../../../components/array-string/majority-element/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/majority-element/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";
import ArrayStringLessonPage from "@/components/array-string/shared/ArrayStringLessonPage";

const defaultInputs = {
  nums: "[2,2,1,1,1,2,2]",
};

const presets = [
  { name: "Example 1", summary: "=> 3", values: { nums: "[3,2,3]" } },
  { name: "Example 2", summary: "=> 2", values: defaultInputs },
  {
    name: "Long cancel battle",
    summary: "Majority survives",
    values: { nums: "[5,1,5,2,5,3,5,4,5]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function MajorityElementPage() {
  return (
    <ArrayStringLessonPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Voting Invariant",
        title: "Majority Element",
        difficulty: "Easy",
        description: "Watch Boyer-Moore pair off competing values until the majority element remains as the final survivor.",
        complexity: "O(n) time / O(1) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[2,2,1,1,1,2,2]" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={MajorityElementVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
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
                The surviving candidate after all vote cancellations.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            majority = {step.state.result ?? step.state.candidate ?? "none"}
          </div>
        </div>
      )}
    />
  );
}
