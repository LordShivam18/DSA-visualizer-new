"use client";

import CodePanel from "../../../components/array-string/insert-delete-getrandom-o1/CodePanel";
import Controls from "../../../components/array-string/insert-delete-getrandom-o1/Controls";
import MicroscopeView from "../../../components/array-string/insert-delete-getrandom-o1/MicroscopeView";
import RandomizedSetVisualizer from "../../../components/array-string/insert-delete-getrandom-o1/RandomizedSetVisualizer";
import TracePanel from "../../../components/array-string/insert-delete-getrandom-o1/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/insert-delete-getrandom-o1/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";
import ArrayStringLessonPage from "@/components/array-string/shared/ArrayStringLessonPage";

const defaultInputs = {
  operations:
    '["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"]',
  args: "[[],[1],[2],[2],[],[1],[2],[]]",
};

const presets = [
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
  return (
    <ArrayStringLessonPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Hashmap + Array",
        title: "Insert Delete GetRandom O(1)",
        difficulty: "Medium",
        description: "Replay a full RandomizedSet operation log and watch how the dense array and hashmap cooperate to preserve average O(1) operations.",
        complexity: "Average O(1) insert/remove/getRandom / O(n) space",
      }}
      defaultInputs={defaultInputs}
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
      presets={presets}
      buildTrace={buildTrace}
      Controls={Controls}
      Visualization={RandomizedSetVisualizer}
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
                Return history for the processed operation sequence.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            returns = [{step.state.returns.join(", ")}]
          </div>
        </div>
      )}
    />
  );
}
