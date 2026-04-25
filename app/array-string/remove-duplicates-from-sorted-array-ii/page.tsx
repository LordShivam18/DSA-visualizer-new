"use client";

import CodePanel from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/CodePanel";
import Controls from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/Controls";
import MicroscopeView from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/MicroscopeView";
import RemoveDuplicatesIIVisualizer from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/RemoveDuplicatesIIVisualizer";
import TracePanel from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/remove-duplicates-from-sorted-array-ii/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";
import ArrayStringLessonPage from "@/components/array-string/shared/ArrayStringLessonPage";

const defaultInputs = {
  nums: "[1,1,1,2,2,3]",
};

const presets = [
  { name: "Example 1", summary: "=> k = 5", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> k = 7",
    values: { nums: "[0,0,1,1,1,1,2,3,3]" },
  },
  {
    name: "Already valid",
    summary: "No third copies",
    values: { nums: "[1,1,2,2,3,3]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function RemoveDuplicatesIIPage() {
  return (
    <ArrayStringLessonPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Bounded Duplicates",
        title: "Remove Duplicates from Sorted Array II",
        difficulty: "Medium",
        description: "Keep a valid prefix where every value appears at most twice, using the write-2 lookback to block third copies.",
        complexity: "O(n) time / O(1) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        {
          key: "nums",
          label: "nums",
          placeholder: "[1,1,1,2,2,3]",
        },
      ]}
      presets={presets}
      buildTrace={buildTrace}
      Controls={Controls}
      Visualization={RemoveDuplicatesIIVisualizer}
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
                The accepted answer is the first k elements.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            k = {step.state.keptLength}, valid prefix ={" "}
            {formatArray(step.state.working.slice(0, step.state.keptLength))}
          </div>
        </div>
      )}
    />
  );
}
