"use client";

import CodePanel from "../../../components/array-string/h-index/CodePanel";
import Controls from "../../../components/array-string/h-index/Controls";
import HIndexVisualizer from "../../../components/array-string/h-index/HIndexVisualizer";
import MicroscopeView from "../../../components/array-string/h-index/MicroscopeView";
import TracePanel from "../../../components/array-string/h-index/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/h-index/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";
import ArrayStringLessonPage from "@/components/array-string/shared/ArrayStringLessonPage";

const defaultInputs = {
  citations: "[3,0,6,1,5]",
};

const presets = [
  { name: "Example 1", summary: "=> 3", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 1",
    values: { citations: "[1,3,1]" },
  },
  {
    name: "High plateau",
    summary: "=> 4",
    values: { citations: "[7,6,6,5,4,2]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.citations);
}

export default function HIndexPage() {
  return (
    <ArrayStringLessonPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Threshold Logic",
        title: "H-Index",
        difficulty: "Medium",
        description: "Sort citations in descending order and locate the largest threshold where citations[i] still supports h = i + 1.",
        complexity: "O(n log n) time / sort-dependent extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        { key: "citations", label: "citations", placeholder: "[3,0,6,1,5]" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={HIndexVisualizer}
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
                The largest h such that at least h papers have at least h citations.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            hIndex = {step.state.result ?? step.state.h}
          </div>
        </div>
      )}
    />
  );
}
