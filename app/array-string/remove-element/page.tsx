"use client";

import CodePanel from "../../../components/array-string/remove-element/CodePanel";
import Controls from "../../../components/array-string/remove-element/Controls";
import MicroscopeView from "../../../components/array-string/remove-element/MicroscopeView";
import RemoveElementVisualizer from "../../../components/array-string/remove-element/RemoveElementVisualizer";
import TracePanel from "../../../components/array-string/remove-element/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/remove-element/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";
import ArrayStringLessonPage from "@/components/array-string/shared/ArrayStringLessonPage";

const defaultInputs = {
  nums: "[3,2,2,3]",
  target: "3",
};

const presets = [
  { name: "Example 1", summary: "=> k = 2", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> k = 5",
    values: { nums: "[0,1,2,2,3,0,4,2]", target: "2" },
  },
  {
    name: "No removals",
    summary: "Target absent",
    values: { nums: "[1,4,5,7]", target: "3" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums, values.target);
}

export default function RemoveElementPage() {
  return (
    <ArrayStringLessonPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / In-Place Filtering",
        title: "Remove Element",
        difficulty: "Easy",
        description: "Compact every non-target value into the front of the array and treat the remaining tail as irrelevant.",
        complexity: "O(n) time / O(1) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[3,2,2,3]" },
        { key: "target", label: "val", placeholder: "3" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={RemoveElementVisualizer}
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
                The judge only checks the first k slots.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            k = {step.state.keptLength}, nums prefix ={" "}
            {formatArray(step.state.working.slice(0, step.state.keptLength))}
          </div>
        </div>
      )}
    />
  );
}
