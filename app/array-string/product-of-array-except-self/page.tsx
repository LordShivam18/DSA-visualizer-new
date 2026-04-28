"use client";

import CodePanel from "../../../components/array-string/product-of-array-except-self/CodePanel";
import Controls from "../../../components/array-string/product-of-array-except-self/Controls";
import MicroscopeView from "../../../components/array-string/product-of-array-except-self/MicroscopeView";
import ProductExceptSelfVisualizer from "../../../components/array-string/product-of-array-except-self/ProductExceptSelfVisualizer";
import TracePanel from "../../../components/array-string/product-of-array-except-self/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/product-of-array-except-self/generateTrace";
import { formatArray } from "../../../components/array-string/shared/parsers";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";
import ArrayStringLessonPage from "@/components/array-string/shared/ArrayStringLessonPage";

const defaultInputs = {
  nums: "[1,2,3,4]",
};

const presets = [
  { name: "Example 1", summary: "=> [24,12,8,6]", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> [0,0,9,0,0]",
    values: { nums: "[-1,1,0,-3,3]" },
  },
  {
    name: "Single zero",
    summary: "exactly one non-zero answer",
    values: { nums: "[2,0,4,5]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function ProductOfArrayExceptSelfPage() {
  return (
    <ArrayStringLessonPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Prefix and Suffix Products",
        title: "Product of Array Except Self",
        difficulty: "Medium",
        description: "Compute the product for every index without division by first storing left products and then multiplying in right products.",
        complexity: "O(n) time / O(1) extra space beyond output",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        { key: "nums", label: "nums", placeholder: "[1,2,3,4]" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={ProductExceptSelfVisualizer}
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
                The completed answer array after both directional passes.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            answer = {formatArray(step.state.result ?? step.state.answer)}
          </div>
        </div>
      )}
    />
  );
}
